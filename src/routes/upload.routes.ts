import { Router } from 'express';
import { uploadController } from '@controllers/upload.controller';
import { authenticate } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validation.middleware';
import {
  uploadSingle,
  uploadMultiple,
  handleMulterError,
} from '@middlewares/upload.middleware';
import {
  uploadQuerySchema,
  deleteFileSchema,
  deleteMultipleFilesSchema,
  getSignedUrlSchema,
} from '@validators/upload.validator';

const router = Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     tags:
 *       - Upload
 *     summary: Upload single file
 *     description: Upload a single file to Cloudflare R2 storage
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 *           enum: [spaces, leads, users, documents, uploads]
 *         description: Folder to upload the file to
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                       example: uploads/image_1234567890_abcdef12.jpg
 *                     url:
 *                       type: string
 *                       example: https://pub-xxxxx.r2.dev/uploads/image_1234567890_abcdef12.jpg
 *                     size:
 *                       type: number
 *                       example: 102400
 *                     mimeType:
 *                       type: string
 *                       example: image/jpeg
 *                     originalName:
 *                       type: string
 *                       example: profile.jpg
 *       400:
 *         description: Bad request - No file provided or invalid file type
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: R2 storage not configured or upload failed
 */
router.post(
  '/',
  authenticate,
  uploadSingle,
  handleMulterError,
  validate(uploadQuerySchema),
  uploadController.uploadSingle.bind(uploadController)
);

/**
 * @swagger
 * /upload/multiple:
 *   post:
 *     tags:
 *       - Upload
 *     summary: Upload multiple files
 *     description: Upload multiple files to Cloudflare R2 storage (max 10 files)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 *           enum: [spaces, leads, users, documents, uploads]
 *         description: Folder to upload files to
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Files to upload (max 10)
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 3 file(s) uploaded successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       key:
 *                         type: string
 *                       url:
 *                         type: string
 *                       size:
 *                         type: number
 *                       mimeType:
 *                         type: string
 *                       originalName:
 *                         type: string
 *       400:
 *         description: Bad request - No files provided or invalid file types
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/multiple',
  authenticate,
  uploadMultiple,
  handleMulterError,
  validate(uploadQuerySchema),
  uploadController.uploadMultiple.bind(uploadController)
);

/**
 * @swagger
 * /upload:
 *   delete:
 *     tags:
 *       - Upload
 *     summary: Delete file
 *     description: Delete a file from Cloudflare R2 storage
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *             properties:
 *               key:
 *                 type: string
 *                 example: uploads/image_1234567890_abcdef12.jpg
 *                 description: File key to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/',
  authenticate,
  validate(deleteFileSchema),
  uploadController.deleteFile.bind(uploadController)
);

/**
 * @swagger
 * /upload/multiple:
 *   delete:
 *     tags:
 *       - Upload
 *     summary: Delete multiple files
 *     description: Delete multiple files from Cloudflare R2 storage
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - keys
 *             properties:
 *               keys:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['uploads/file1.jpg', 'uploads/file2.pdf']
 *                 description: Array of file keys to delete
 *     responses:
 *       200:
 *         description: Files deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/multiple',
  authenticate,
  validate(deleteMultipleFilesSchema),
  uploadController.deleteMultiple.bind(uploadController)
);

/**
 * @swagger
 * /upload/signed-url:
 *   get:
 *     tags:
 *       - Upload
 *     summary: Get signed URL
 *     description: Generate a temporary signed URL for accessing a private file
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: File key to generate signed URL for
 *         example: uploads/document.pdf
 *       - in: query
 *         name: expiresIn
 *         schema:
 *           type: number
 *           default: 3600
 *         description: URL expiration time in seconds
 *     responses:
 *       200:
 *         description: Signed URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                       example: uploads/document.pdf
 *                     signedUrl:
 *                       type: string
 *                       example: https://xxxxx.r2.cloudflarestorage.com/...
 *                     expiresIn:
 *                       type: number
 *                       example: 3600
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/signed-url',
  authenticate,
  validate(getSignedUrlSchema),
  uploadController.getSignedUrl.bind(uploadController)
);

export default router;
