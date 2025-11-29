import { Router } from 'express';
import { authController } from '@controllers/auth.controller';
import { authenticate } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validation.middleware';
import { passwordChangeSchema } from '@validators/auth.validator';

const router = Router();

/**
 * @swagger
 * /settings/password:
 *   put:
 *     tags:
 *       - Settings
 *     summary: Update password
 *     description: Change password for the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error or password requirements not met
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized or incorrect current password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/password',
  authenticate,
  validate(passwordChangeSchema),
  authController.changePassword.bind(authController)
);

export default router;
