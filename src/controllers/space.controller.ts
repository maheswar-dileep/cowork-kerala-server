import { Request, Response, NextFunction } from 'express';
import { spaceService } from '@services/space.service';
import { ISpaceFilters } from '../types/space.types';

export class SpaceController {
    /**
     * Get all spaces
     * GET /api/v1/spaces
     */
    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page = 1, limit = 10, status, city, search } = req.query;

            const filters: ISpaceFilters = {};
            if (status) filters.status = status as 'active' | 'inactive' | 'pending';
            if (city) filters.city = city as string;
            if (search) filters.search = search as string;

            const pagination = {
                page: Number(page),
                limit: Number(limit),
            };

            const result = await spaceService.getAllSpaces(filters, pagination);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get featured spaces
     * GET /api/v1/spaces/featured
     */
    async getFeatured(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await spaceService.getFeaturedSpaces();

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get space by ID
     * GET /api/v1/spaces/:id
     */
    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            const space = await spaceService.getSpaceById(id);

            res.status(200).json({
                success: true,
                data: space,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create new space
     * POST /api/v1/spaces
     */
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const spaceData = req.body;

            const space = await spaceService.createSpace(spaceData);

            res.status(201).json({
                success: true,
                message: 'Space created successfully',
                data: space,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update space
     * PUT /api/v1/spaces/:id
     */
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const space = await spaceService.updateSpace(id, updateData);

            res.status(200).json({
                success: true,
                message: 'Space updated successfully',
                data: space,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete space (soft delete)
     * DELETE /api/v1/spaces/:id
     */
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            await spaceService.deleteSpace(id);

            res.status(200).json({
                success: true,
                message: 'Space deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}

export const spaceController = new SpaceController();
