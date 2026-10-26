import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

/**
 * GET /api/profile
 * Get current student profile
 */
export async function getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    res.status(200).json({
      success: true,
      profile: {
        id: user._id,
        fullName: user.fullName,
        rollNumber: user.rollNumber,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/profile
 * Update student profile (fullName, rollNumber, email, username)
 */
export async function updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { fullName, rollNumber, email, username } = req.body;

    if (!fullName || !rollNumber || !email || !username) {
      res.status(400).json({
        success: false,
        message: 'Full name, roll number, email, and username are all required.'
      });
      return;
    }

    const cleanFullName = fullName.trim();
    const cleanRollNumber = rollNumber.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();

    // Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(cleanEmail)) {
      res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
      return;
    }

    // Username format validation
    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!usernameRegex.test(cleanUsername)) {
      res.status(400).json({
        success: false,
        message: 'Username can only contain alphanumeric characters, dots, underscores, and hyphens.'
      });
      return;
    }

    // Check uniqueness conflicts against OTHER users
    const conflicts = await User.find({
      _id: { $ne: user._id },
      $or: [
        { rollNumber: cleanRollNumber },
        { email: cleanEmail },
        { username: cleanUsername }
      ]
    });

    if (conflicts.length > 0) {
      for (const conflict of conflicts) {
        if (conflict.rollNumber === cleanRollNumber) {
          res.status(409).json({
            success: false,
            message: 'Roll number is already in use by another student.'
          });
          return;
        }
        if (conflict.email === cleanEmail) {
          res.status(409).json({
            success: false,
            message: 'Email address is already in use by another student.'
          });
          return;
        }
        if (conflict.username === cleanUsername) {
          res.status(409).json({
            success: false,
            message: 'Username is already taken by another student.'
          });
          return;
        }
      }
    }

    // Update user document
    user.fullName = cleanFullName;
    user.rollNumber = cleanRollNumber;
    user.email = cleanEmail;
    user.username = cleanUsername;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      profile: {
        id: user._id,
        fullName: user.fullName,
        rollNumber: user.rollNumber,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/profile/password
 * Change student password with current password verification
 */
export async function changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      res.status(400).json({
        success: false,
        message: 'Please provide current password, new password, and confirmation.'
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match.'
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
      return;
    }

    // Verify current password against stored hash
    const isCurrentMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentMatch) {
      res.status(400).json({
        success: false,
        message: 'Current password does not match our records.'
      });
      return;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    next(error);
  }
}
