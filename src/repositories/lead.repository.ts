import { Lead } from '@models/Lead.model';
import { ILead, ILeadInput, ILeadFilters, ILeadStatusUpdate } from '../types/lead.types';

interface IPaginationParams {
  page: number;
  limit: number;
}

export class LeadRepository {
  /**
   * Find all leads with filters and pagination (excluding soft-deleted)
   */
  async findAll(
    filters: ILeadFilters,
    pagination: IPaginationParams
  ): Promise<{ leads: ILead[]; total: number }> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { isDeleted: false };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.location) {
      query.location = new RegExp(filters.location, 'i'); // Case-insensitive search
    }

    if (filters.search) {
      query.$or = [
        { name: new RegExp(filters.search, 'i') },
        { email: new RegExp(filters.search, 'i') },
        { phone: new RegExp(filters.search, 'i') },
        { enquiredFor: new RegExp(filters.search, 'i') },
      ];
    }

    const [leads, total] = await Promise.all([
      Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Lead.countDocuments(query),
    ]);

    return { leads, total };
  }

  /**
   * Find lead by ID (excluding soft-deleted)
   */
  async findById(id: string): Promise<ILead | null> {
    return await Lead.findOne({ _id: id, isDeleted: false });
  }

  /**
   * Find lead by leadId (excluding soft-deleted)
   */
  async findByLeadId(leadId: string): Promise<ILead | null> {
    return await Lead.findOne({ leadId, isDeleted: false });
  }

  /**
   * Create a new lead
   */
  async create(leadData: ILeadInput): Promise<ILead> {
    const lead = new Lead(leadData);
    return await lead.save();
  }

  /**
   * Update lead by ID (full update)
   */
  async updateById(id: string, updateData: Partial<ILeadInput>): Promise<ILead | null> {
    return await Lead.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /**
   * Update lead status by ID
   */
  async updateStatusById(id: string, statusData: ILeadStatusUpdate): Promise<ILead | null> {
    console.log('Repository - Update ID:', id);
    console.log('Repository - Status Data:', statusData);
    console.log('Repository - Setting status to:', statusData.status);

    const result = await Lead.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { status: statusData.status } },
      {
        new: true,
        runValidators: true,
      }
    );

    console.log('Repository - Update Result:', result ? 'Success' : 'Not found');
    if (result) {
      console.log('Repository - Updated Status:', result.status);
    }

    return result;
  }

  /**
   * Soft delete lead by ID
   */
  async softDeleteById(id: string): Promise<ILead | null> {
    return await Lead.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );
  }

  /**
   * Hard delete lead by ID (for admin purposes)
   */
  async hardDeleteById(id: string): Promise<ILead | null> {
    return await Lead.findByIdAndDelete(id);
  }

  /**
   * Count documents with filters
   */
  async countDocuments(filters: ILeadFilters): Promise<number> {
    const query: any = { isDeleted: false };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.location) {
      query.location = new RegExp(filters.location, 'i');
    }

    if (filters.search) {
      query.$or = [
        { name: new RegExp(filters.search, 'i') },
        { email: new RegExp(filters.search, 'i') },
        { phone: new RegExp(filters.search, 'i') },
        { enquiredFor: new RegExp(filters.search, 'i') },
      ];
    }

    return await Lead.countDocuments(query);
  }

  /**
   * Check if lead exists by email (for duplicate prevention)
   */
  async existsByEmail(email: string, excludeId?: string): Promise<boolean> {
    const query: any = {
      email: new RegExp(`^${email}$`, 'i'),
      isDeleted: false,
    };

    // Exclude current lead when checking for duplicates during update
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const count = await Lead.countDocuments(query);
    return count > 0;
  }
}

export const leadRepository = new LeadRepository();
