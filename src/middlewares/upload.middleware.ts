import multer from 'multer';
import { Request } from 'express';
import { config } from '@config/env';
import { ApiError } from '../types/common.types';

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter to validate mime types
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  const allowedMimes = config.upload.allowedMimeTypes;

  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new ApiError(
        400,
        `Invalid file type. Allowed types: ${allowedMimes.join(', ')}`
      )
    );
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize, // Max file size in bytes
  },
});

/**
 * Middleware for single file upload
 * Field name: 'file'
 */
export const uploadSingle = upload.single('file');

/**
 * Middleware for multiple files upload (max 10 files)
 * Field name: 'files'
 */
export const uploadMultiple = upload.array('files', 10);

/**
 * Middleware for multiple fields with files
 */
export const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'document', maxCount: 5 },
]);

/**
 * Handle multer errors
 */
export const handleMulterError = (
  error: any,
  _req: Request,
  _res: any,
  next: any
): void => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      next(
        new ApiError(
          400,
          `File too large. Maximum size is ${config.upload.maxFileSize / 1024 / 1024}MB`
        )
      );
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      next(new ApiError(400, 'Too many files uploaded'));
    } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      next(new ApiError(400, 'Unexpected field name'));
    } else {
      next(new ApiError(400, error.message));
    }
  } else {
    next(error);
  }
};
