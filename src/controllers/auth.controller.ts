import { Request, Response, NextFunction } from 'express';
import { authService } from '@services/auth.service';
import { emailService } from '@services/email.service';
import { ApiError } from '../types/common.types';

export class AuthController {
  /**
   * Login controller
   * POST /api/v1/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const authResponse = await authService.login({ email, password });

      res.status(200).json(authResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout controller
   * POST /api/v1/auth/logout
   */
  async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // With JWT, logout is handled on the client side by removing the token
      // But we can perform any cleanup here if needed

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Request password reset
   * POST /api/v1/auth/forgot-password
   */
  async requestPasswordReset(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      const resetToken = await authService.requestPasswordReset(email);

      // Get user details for personalized email
      const user = await authService.getUserById(
        (await authService.login({ email, password: '' })).user.id
      );

      // Send reset email (in production, you'd send this to the user's email)
      if (user) {
        await emailService.sendPasswordResetEmail(email, resetToken, user.name);
      }

      res.status(200).json({
        success: true,
        message: 'If the email exists, a reset link has been sent',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password using token
   * POST /api/v1/auth/reset-password
   */
  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      await authService.resetPassword(token, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change password (for logged-in users)
   * PUT /api/v1/settings/password
   */
  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const { currentPassword, newPassword } = req.body;

      await authService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user
   * GET /api/v1/auth/me
   */
  async getCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const user = await authService.getUserById(userId);

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      res.status(200).json({
        success: true,
        data: authService.formatUserResponse(user),
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
