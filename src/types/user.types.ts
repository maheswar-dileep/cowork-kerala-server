import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IAuthResponse {
  success: boolean;
  token: string;
  user: IUserResponse;
}

export interface IPasswordResetRequest {
  email: string;
}

export interface IPasswordReset {
  token: string;
  newPassword: string;
}

export interface IPasswordChange {
  currentPassword: string;
  newPassword: string;
}
