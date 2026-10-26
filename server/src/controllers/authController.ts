import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { generateToken, AuthenticatedRequest } from '../middleware/authMiddleware';

function setAuthCookie(res: Response, token: string): void {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { fullName, rollNumber, email, username, password, confirmPassword } = req.body;

    // Field presence validation
    if (!fullName || !rollNumber || !email || !username || !password || !confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'All fields are required. Please fill in all information.'
      });
      return;
    }

    // Password matching check
    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'Passwords do not match. Please verify and re-enter.'
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
      return;
    }

    // Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
      return;
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanRoll = rollNumber.trim().toUpperCase();

    // Check unique constraints explicitly for clear user-facing messages
    const existingUser = await User.findOne({
      $or: [
        { username: cleanUsername },
        { email: cleanEmail },
        { rollNumber: cleanRoll }
      ]
    });

    if (existingUser) {
      if (existingUser.username === cleanUsername) {
        res.status(409).json({
          success: false,
          message: 'This username is already taken. Please choose another username.'
        });
        return;
      }
      if (existingUser.email === cleanEmail) {
        res.status(409).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
        return;
      }
      if (existingUser.rollNumber === cleanRoll) {
        res.status(409).json({
          success: false,
          message: 'A student account with this Roll Number already exists.'
        });
        return;
      }
    }

    // Hash password securely
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user in MongoDB
    const newUser = await User.create({
      fullName: fullName.trim(),
      rollNumber: cleanRoll,
      email: cleanEmail,
      username: cleanUsername,
      passwordHash
    });

    const token = generateToken(newUser._id.toString());
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        rollNumber: newUser.rollNumber,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Please enter your username and password.'
      });
      return;
    }

    const cleanUsername = username.trim().toLowerCase();

    // Find student by username or email
    const user = await User.findOne({
      $or: [{ username: cleanUsername }, { email: cleanUsername }]
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid username or password. Please try again.'
      });
      return;
    }

    // Verify password hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid username or password. Please try again.'
      });
      return;
    }

    const token = generateToken(user._id.toString());
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        rollNumber: user.rollNumber,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Not authenticated.'
    });
    return;
  }

  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      rollNumber: req.user.rollNumber,
      email: req.user.email,
      username: req.user.username,
      role: req.user.role,
      createdAt: req.user.createdAt
    }
  });
}
