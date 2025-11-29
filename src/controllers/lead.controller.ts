import { Request, Response, NextFunction } from 'express';
import { leadService } from '@services/lead.service';
import { ILeadFilters } from '../types/lead.types';

export class LeadController {
  /**
   * Get all leads
   * GET /api/v1/leads
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, status, location, search } = req.query;

      const filters: ILeadFilters = {};
      if (status) filters.status = status as 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
      if (location) filters.location = location as string;
      if (search) filters.search = search as string;

      const pagination = {
        page: Number(page),
        limit: Number(limit),
      };

      const result = await leadService.getAllLeads(filters, pagination);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get lead by ID
   * GET /api/v1/leads/:id
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const lead = await leadService.getLeadById(id);

      res.status(200).json({
        success: true,
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new lead (public endpoint)
   * POST /api/v1/leads
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const leadData = req.body;

      const lead = await leadService.createLead(leadData);

      res.status(201).json({
        success: true,
        message: 'Lead created successfully',
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update lead (full update)
   * PUT /api/v1/leads/:id
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const lead = await leadService.updateLead(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Lead updated successfully',
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update lead status
   * PATCH /api/v1/leads/:id
   */
  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const statusData = req.body;

      console.log('Lead Update - ID:', id);
      console.log('Lead Update - Status Data:', statusData);
      console.log('Lead Update - Status Data Keys:', Object.keys(statusData));

      const lead = await leadService.updateLeadStatus(id, statusData);

      res.status(200).json({
        success: true,
        message: 'Lead status updated successfully',
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete lead (soft delete)
   * DELETE /api/v1/leads/:id
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await leadService.deleteLead(id);

      res.status(200).json({
        success: true,
        message: 'Lead deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const leadController = new LeadController();
