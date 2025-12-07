import { Router } from "express";
import { locationController } from "@controllers/location.controller";

const router = Router();

import { authenticate, authorize } from "@middlewares/auth.middleware";

// Public routes
/**
 * @swagger
 * /locations:
 *   get:
 *     tags:
 *       - Locations
 *     summary: Get all locations
 *     description: Retrieve a list of all active locations
 *     responses:
 *       200:
 *         description: List of locations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Location'
 *       500:
 *         description: Server error
 */
router.get("/", locationController.getAll);

/**
 * @swagger
 * /locations/{id}:
 *   get:
 *     tags:
 *       - Locations
 *     summary: Get location by ID
 *     description: Retrieve detailed information about a specific location
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Location ID
 *     responses:
 *       200:
 *         description: Location details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Location'
 *       404:
 *         description: Location not found
 *       500:
 *         description: Server error
 */
router.get("/:id", locationController.getOne);

// Protected routes (Admin only)
router.use(authenticate);
router.use(authorize("admin", "super_admin"));

/**
 * @swagger
 * /locations:
 *   post:
 *     tags:
 *       - Locations
 *     summary: Create new location
 *     description: Create a new location (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kochi
 *               description:
 *                 type: string
 *                 example: The commercial capital of Kerala
 *               image:
 *                 type: string
 *                 example: https://r2.example.com/kochi.jpg
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Location created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Location'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/", locationController.create);

/**
 * @swagger
 * /locations/{id}:
 *   put:
 *     tags:
 *       - Locations
 *     summary: Update location
 *     description: Update an existing location (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Location ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Location'
 *       404:
 *         description: Location not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put("/:id", locationController.update);

/**
 * @swagger
 * /locations/{id}:
 *   delete:
 *     tags:
 *       - Locations
 *     summary: Delete location
 *     description: Delete a location (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Location ID
 *     responses:
 *       200:
 *         description: Location deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Location not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete("/:id", locationController.delete);

export default router;
