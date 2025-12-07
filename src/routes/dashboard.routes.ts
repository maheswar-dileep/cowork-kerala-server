import { Router } from "express";
import { dashboardController } from "@controllers/dashboard.controller";
import { authenticate } from "@middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get dashboard statistics
 *     description: Retrieve comprehensive dashboard stats including space counts, lead counts, and chart data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object
 *                     charts:
 *                       type: object
 *                     recentLeads:
 *                       type: array
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/stats",
  authenticate,
  dashboardController.getStats.bind(dashboardController)
);

export default router;
