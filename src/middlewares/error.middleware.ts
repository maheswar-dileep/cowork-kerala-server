import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types/common.types';
import { config } from '@config/env';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  error: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle known ApiError
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  }

  // Handle Mongoose duplicate key error
  if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    statusCode = 409;
    message = 'Resource already exists';
  }

  // Handle Mongoose cast error
  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Log error in development
  if (config.nodeEnv === 'development') {
    console.error('Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      statusCode,
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === 'development' && {
      error: error.message,
    }),
  });
};

/**
 * Handle 404 routes
 */
export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(error);
};
