import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('[Error Middleware]', err);

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const capitalized = field.charAt(0).toUpperCase() + field.slice(1);
    res.status(409).json({
      success: false,
      message: `A student account with this ${capitalized} already exists.`,
      field
    });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val: any) => val.message);
    res.status(400).json({
      success: false,
      message: messages.join('. '),
      errors: messages
    });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Invalid session token. Please log in again.'
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Session token has expired. Please log in again.'
    });
    return;
  }

  // MongoDB Atlas connection / buffering timeout error
  if (
    err.name === 'MongooseServerSelectionError' ||
    (err.message && err.message.includes('buffering timed out'))
  ) {
    res.status(503).json({
      success: false,
      message:
        'MongoDB Atlas connection timed out. Please verify that your current IP address is whitelisted in MongoDB Atlas under Network Access (select "Allow Access from Anywhere" or add 0.0.0.0/0).'
    });
    return;
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error. Please try again later.'
  });
}
