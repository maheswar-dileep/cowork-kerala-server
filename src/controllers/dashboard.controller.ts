import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Space } from "@models/Space.model";
import { Lead } from "@models/Lead.model";
import { Location } from "@models/Location.model";

export class DashboardController {
  /**
   * Get dashboard statistics
   * GET /api/v1/dashboard/stats
   */
  async getStats(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Run all queries in parallel for better performance
      const [
        totalSpaces,
        activeSpaces,
        pendingSpaces,
        inactiveSpaces,
        totalLeads,
        newLeads,
        qualifiedLeads,
        convertedLeads,
        totalLocations,
        spacesByType,
        spacesByCity,
        recentLeads,
        leadsByStatus,
      ] = await Promise.all([
        // Space counts
        Space.countDocuments({ isDeleted: false }),
        Space.countDocuments({ isDeleted: false, status: "active" }),
        Space.countDocuments({ isDeleted: false, status: "pending" }),
        Space.countDocuments({ isDeleted: false, status: "inactive" }),

        // Lead counts
        Lead.countDocuments({ isDeleted: false }),
        Lead.countDocuments({ isDeleted: false, status: "new" }),
        Lead.countDocuments({ isDeleted: false, status: "qualified" }),
        Lead.countDocuments({ isDeleted: false, status: "converted" }),

        // Location count
        Location.countDocuments({ isActive: true }),

        // Spaces grouped by type
        Space.aggregate([
          { $match: { isDeleted: { $ne: true } } },
          { $group: { _id: "$spaceType", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),

        // Spaces grouped by city (populated)
        Space.aggregate([
          { $match: { isDeleted: { $ne: true } } },
          {
            $lookup: {
              from: "locations",
              localField: "city",
              foreignField: "_id",
              as: "cityInfo",
            },
          },
          { $unwind: { path: "$cityInfo", preserveNullAndEmptyArrays: true } },
          {
            $group: {
              _id: "$cityInfo.name",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]),

        // Recent leads (last 5)
        Lead.find({ isDeleted: false })
          .sort({ createdAt: -1 })
          .limit(5)
          .select("leadId name email enquiredFor spaceType status createdAt"),

        // Leads grouped by status
        Lead.aggregate([
          { $match: { isDeleted: { $ne: true } } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
      ]);

      // Calculate conversion rate
      const conversionRate =
        totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0";

      res.status(200).json({
        success: true,
        data: {
          overview: {
            totalSpaces,
            activeSpaces,
            pendingSpaces,
            inactiveSpaces,
            totalLeads,
            newLeads,
            qualifiedLeads,
            convertedLeads,
            totalLocations,
            conversionRate: `${conversionRate}%`,
          },
          charts: {
            spacesByType: spacesByType.map((item) => ({
              name: item._id || "Unknown",
              value: item.count,
            })),
            spacesByCity: spacesByCity.map((item) => ({
              name: item._id || "Unknown",
              value: item.count,
            })),
            leadsByStatus: leadsByStatus.map((item) => ({
              name: item._id || "Unknown",
              value: item.count,
            })),
          },
          recentLeads: recentLeads.map((lead) => ({
            id: lead._id,
            leadId: lead.leadId,
            name: lead.name,
            email: lead.email,
            enquiredFor: lead.enquiredFor,
            spaceType: lead.spaceType,
            status: lead.status,
            createdAt: lead.createdAt,
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
