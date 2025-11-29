import { leadRepository } from '@repositories/lead.repository';
import {
  ILead,
  ILeadInput,
  ILeadResponse,
  ILeadFilters,
  IPaginatedLeadsResponse,
  ILeadStatusUpdate,
} from '../types/lead.types';
import { ApiError } from '../types/common.types';

interface IPaginationParams {
  page: number;
  limit: number;
}

export class LeadService {
  /**
   * Get all leads with pagination and filters
   */
  async getAllLeads(
    filters: ILeadFilters,
    pagination: IPaginationParams
  ): Promise<IPaginatedLeadsResponse> {
    const { leads, total } = await leadRepository.findAll(filters, pagination);

    const totalPages = Math.ceil(total / pagination.limit);

    return {
      success: true,
      data: leads.map((lead) => this.formatLeadResponse(lead)),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get lead by ID
   */
  async getLeadById(id: string): Promise<ILeadResponse> {
    const lead = await leadRepository.findById(id);

    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }

    return this.formatLeadResponse(lead);
  }

  /**
   * Create new lead (public endpoint for website forms)
   */
  async createLead(leadData: ILeadInput): Promise<ILeadResponse> {
    const lead = await leadRepository.create(leadData);

    return this.formatLeadResponse(lead);
  }

  /**
   * Update lead (full update)
   */
  async updateLead(id: string, updateData: Partial<ILeadInput>): Promise<ILeadResponse> {
    // Check if lead exists
    const existingLead = await leadRepository.findById(id);

    if (!existingLead) {
      throw new ApiError(404, 'Lead not found');
    }

    const updatedLead = await leadRepository.updateById(id, updateData);

    if (!updatedLead) {
      throw new ApiError(404, 'Lead not found');
    }

    return this.formatLeadResponse(updatedLead);
  }

  /**
   * Update lead status
   */
  async updateLeadStatus(id: string, statusData: ILeadStatusUpdate): Promise<ILeadResponse> {
    console.log('Service - Received ID:', id);
    console.log('Service - Received Status Data:', statusData);

    // Check if lead exists
    const existingLead = await leadRepository.findById(id);

    if (!existingLead) {
      throw new ApiError(404, 'Lead not found');
    }

    console.log('Service - Existing Lead Found:', existingLead.leadId);
    console.log('Service - Current Status:', existingLead.status);
    console.log('Service - New Status:', statusData.status);

    const updatedLead = await leadRepository.updateStatusById(id, statusData);

    if (!updatedLead) {
      throw new ApiError(404, 'Lead not found');
    }

    console.log('Service - Updated Lead Status:', updatedLead.status);

    return this.formatLeadResponse(updatedLead);
  }

  /**
   * Delete lead (soft delete)
   */
  async deleteLead(id: string): Promise<void> {
    const lead = await leadRepository.softDeleteById(id);

    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }
  }

  /**
   * Format lead response (remove sensitive data)
   */
  formatLeadResponse(lead: ILead): ILeadResponse {
    return {
      id: lead._id.toString(),
      leadId: lead.leadId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      enquiredFor: lead.enquiredFor,
      spaceType: lead.spaceType,
      numberOfSeats: lead.numberOfSeats,
      location: lead.location,
      message: lead.message,
      date: lead.date,
      status: lead.status,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    };
  }
}

export const leadService = new LeadService();
