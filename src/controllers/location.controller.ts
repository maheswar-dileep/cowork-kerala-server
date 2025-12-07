import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Location } from "@models/Location.model";
import { ApiError } from "../types/common.types";

export class LocationController {
  /**
   * Create a new location
   * POST /api/v1/locations
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const location = await Location.create(req.body);
      res.status(201).json({
        success: true,
        data: location,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all locations
   * GET /api/v1/locations
   */
  async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const locations = await Location.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        data: locations,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get location by ID
   * GET /api/v1/locations/:id
   */
  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const location = await Location.findById(req.params.id);
      if (!location) {
        throw new ApiError(404, "Location not found");
      }
      res.status(200).json({
        success: true,
        data: location,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update location
   * PUT /api/v1/locations/:id
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const location = await Location.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!location) {
        throw new ApiError(404, "Location not found");
      }
      res.status(200).json({
        success: true,
        data: location,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete location
   * DELETE /api/v1/locations/:id
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const location = await Location.findById(req.params.id);
      if (!location) {
        throw new ApiError(404, "Location not found");
      }

      // Check if any space is using this location
      const isLocationInUse = await mongoose.model("Space").exists({
        city: location._id,
        isDeleted: false,
      });

      if (isLocationInUse) {
        throw new ApiError(
          400,
          "Cannot delete location because it is associated with one or more spaces."
        );
      }

      await Location.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Location deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const locationController = new LocationController();
