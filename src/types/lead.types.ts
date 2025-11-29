import { Document, Types } from 'mongoose';

export interface ILead extends Document {
  _id: Types.ObjectId;
  leadId: string; // Auto-generated ID like "LD-2025-001"
  name: string;
  email: string;
  phone: string;
  enquiredFor: string; // Space name they're interested in
  spaceType: string; // Hot Desk, Dedicated Desk, Private Office, etc.
  numberOfSeats?: number;
  location?: string;
  message?: string;
  date?: Date;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  isDeleted: boolean; // For soft delete
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadInput {
  name: string;
  email: string;
  phone: string;
  enquiredFor: string;
  spaceType: string;
  numberOfSeats?: number;
  location?: string;
  message?: string;
  date?: Date;
}

export interface ILeadResponse {
  id: string;
  leadId: string;
  name: string;
  email: string;
  phone: string;
  enquiredFor: string;
  spaceType: string;
  numberOfSeats?: number;
  location?: string;
  message?: string;
  date?: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadFilters {
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  search?: string;
  location?: string;
}

export interface IPaginatedLeadsResponse {
  success: boolean;
  data: ILeadResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ILeadStatusUpdate {
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
}
