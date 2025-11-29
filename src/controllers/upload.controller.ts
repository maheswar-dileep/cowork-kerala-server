import { Request, Response, NextFunction } from 'express';
import { r2Service } from '@services/r2.service';
import { ApiError } from '../types/common.types';
import { UploadFolder } from '../types/upload.types';

export class UploadController {
  /**
   * Upload single file
   * POST /api/v1/upload
   */
  async uploadSingle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new ApiError(400, 'No file provided');
      }

      if (!r2Service.isConfigured()) {
        throw new ApiError(500, 'R2 storage is not configured');
      }

      const folder = (req.query.folder as UploadFolder) || UploadFolder.GENERAL;

      const uploadedFile = await r2Service.uploadFile(req.file, folder);

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          ...uploadedFile,
          originalName: req.file.originalname,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload multiple files
   * POST /api/v1/upload/multiple
   */
  async uploadMultiple(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        throw new ApiError(400, 'No files provided');
      }

      if (!r2Service.isConfigured()) {
        throw new ApiError(500, 'R2 storage is not configured');
      }

      const folder = (req.query.folder as UploadFolder) || UploadFolder.GENERAL;

      const files = req.files as Express.Multer.File[];
      const uploadedFiles = await r2Service.uploadMultipleFiles(files, folder);

      res.status(200).json({
        success: true,
        message: `${uploadedFiles.length} file(s) uploaded successfully`,
        data: uploadedFiles.map((file, index) => ({
          ...file,
          originalName: files[index].originalname,
        })),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete file
   * DELETE /api/v1/upload
   */
  async deleteFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { key } = req.body;

      if (!r2Service.isConfigured()) {
        throw new ApiError(500, 'R2 storage is not configured');
      }

      await r2Service.deleteFile(key);

      res.status(200).json({
        success: true,
        message: 'File deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete multiple files
   * DELETE /api/v1/upload/multiple
   */
  async deleteMultiple(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { keys } = req.body;

      if (!r2Service.isConfigured()) {
        throw new ApiError(500, 'R2 storage is not configured');
      }

      await r2Service.deleteMultipleFiles(keys);

      res.status(200).json({
        success: true,
        message: `${keys.length} file(s) deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get signed URL for temporary access
   * GET /api/v1/upload/signed-url
   */
  async getSignedUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { key, expiresIn } = req.query;

      if (!r2Service.isConfigured()) {
        throw new ApiError(500, 'R2 storage is not configured');
      }

      const signedUrl = await r2Service.getSignedUrl(
        key as string,
        expiresIn ? parseInt(expiresIn as string) : 3600
      );

      res.status(200).json({
        success: true,
        data: {
          key,
          signedUrl,
          expiresIn: expiresIn || 3600,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
