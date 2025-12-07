import { User } from "@models/User.model";
import { IUser } from "../types/user.types";

export class UserRepository {
  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select("+password");
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  /**
   * Create a new user
   */
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Update user by ID
   */
  async updateById(
    id: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete user by ID
   */
  async deleteById(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
  }

  /**
   * Find user by password reset token
   */
  async findByResetToken(token: string): Promise<IUser | null> {
    return await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+password +passwordResetToken +passwordResetExpires");
  }

  /**
   * Set password reset token
   */
  async setPasswordResetToken(
    email: string,
    token: string,
    expiresAt: Date
  ): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { email },
      {
        passwordResetToken: token,
        passwordResetExpires: expiresAt,
      },
      { new: true }
    );
  }

  /**
   * Clear password reset token
   */
  async clearPasswordResetToken(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      {
        $unset: {
          passwordResetToken: 1,
          passwordResetExpires: 1,
        },
      },
      { new: true }
    );
  }

  /**
   * Check if user exists by email
   */
  async existsByEmail(email: string): Promise<boolean> {
    const count = await User.countDocuments({ email });
    return count > 0;
  }
}

export const userRepository = new UserRepository();
