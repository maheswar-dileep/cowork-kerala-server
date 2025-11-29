import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { userRepository } from '@repositories/user.repository';
import {
  IUser,
  IUserResponse,
  IAuthResponse,
  ILoginCredentials,
} from '../types/user.types';
import { IJWTPayload } from '../types/express';
import { config } from '@config/env';
import { ApiError } from '../types/common.types';

export class AuthService {
  /**
   * Login user and generate JWT token
   */
  async login(credentials: ILoginCredentials): Promise<IAuthResponse> {
    const { email, password } = credentials;

    // Find user by email
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError(403, 'Account is inactive. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    // Format user response
    const userResponse = this.formatUserResponse(user);

    return {
      success: true,
      token,
      user: userResponse,
    };
  }

  /**
   * Generate JWT token
   */
  generateToken(user: IUser): string {
    const payload: IJWTPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): IJWTPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as IJWTPayload;
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired token');
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<string> {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      // Don't reveal that email doesn't exist for security
      throw new ApiError(200, 'If the email exists, a reset link has been sent');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Calculate expiry (1 hour from now)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Save hashed token to database
    await userRepository.setPasswordResetToken(email, hashedToken, expiresAt);

    return resetToken;
  }

  /**
   * Reset password using token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Hash the token to match database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await userRepository.findByResetToken(hashedToken);

    if (!user) {
      throw new ApiError(400, 'Invalid or expired reset token');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Clear reset token
    await userRepository.clearPasswordResetToken(user._id.toString());
  }

  /**
   * Change password (for logged-in users)
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await userRepository.findByEmail(
      (await userRepository.findById(userId))?.email || ''
    );

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();
  }

  /**
   * Format user response (remove sensitive data)
   */
  formatUserResponse(user: IUser): IUserResponse {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<IUser | null> {
    return await userRepository.findById(userId);
  }
}

export const authService = new AuthService();
