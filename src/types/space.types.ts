import { Document, Types } from 'mongoose';

export interface IPricing {
  hotDesk?: number;
  dedicatedDesk?: number;
  privateOffice?: number;
}

export interface ILocation {
  address: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
}

export interface IContact {
  name: string;
  email: string;
  phone: string;
}

export interface ISpace extends Document {
  _id: Types.ObjectId;
  spaceId: string; // Auto-generated ID like "SP-2025-001"
  spaceName: string;
  spaceType: string;
  city: string;
  spaceCategory: string;
  shortDescription?: string;
  longDescription?: string;
  amenities: string[];
  pricing: IPricing;
  location: ILocation;
  contact: IContact;
  images?: string[]; // Array of R2 image URLs
  status: 'active' | 'inactive' | 'pending';
  isDeleted: boolean; // For soft delete
  createdAt: Date;
  updatedAt: Date;
}

export interface ISpaceInput {
  spaceName: string;
  spaceType: string;
  city: string;
  spaceCategory: string;
  shortDescription?: string;
  longDescription?: string;
  amenities?: string[];
  pricing?: IPricing;
  location?: ILocation;
  contact?: IContact;
  images?: string[];
  status?: 'active' | 'inactive' | 'pending';
}

export interface ISpaceResponse {
  id: string;
  spaceId: string;
  spaceName: string;
  spaceType: string;
  city: string;
  spaceCategory: string;
  shortDescription?: string;
  longDescription?: string;
  amenities: string[];
  pricing: IPricing;
  location: ILocation;
  contact: IContact;
  images?: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISpaceFilters {
  status?: 'active' | 'inactive' | 'pending';
  city?: string;
  search?: string;
}

export interface IPaginationParams {
  page: number;
  limit: number;
}

export interface IPaginatedSpacesResponse {
  success: boolean;
  data: ISpaceResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
