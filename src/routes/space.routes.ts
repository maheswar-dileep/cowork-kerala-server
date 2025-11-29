import { Router } from 'express';
import { spaceController } from '@controllers/space.controller';
import { authenticate } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validation.middleware';
import {
  createSpaceSchema,
  updateSpaceSchema,
  getSpacesQuerySchema,
  getSpaceByIdSchema,
  deleteSpaceSchema,
} from '@validators/space.validator';

const router = Router();

/**
 * @swagger
 * /spaces:
 *   get:
 *     tags:
 *       - Spaces
 *     summary: Get all coworking spaces
 *     description: Retrieve list of all coworking spaces with pagination and filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, pending]
 *         description: Filter by status
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by space name, city, or type
 *     responses:
 *       200:
 *         description: List of spaces retrieved successfully
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
 *                     $ref: '#/components/schemas/Space'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/',
  authenticate,
  validate(getSpacesQuerySchema),
  spaceController.getAll.bind(spaceController)
);

/**
 * @swagger
 * /spaces/{id}:
 *   get:
 *     tags:
 *       - Spaces
 *     summary: Get space by ID
 *     description: Retrieve detailed information about a specific coworking space
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Space ID
 *     responses:
 *       200:
 *         description: Space details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Space'
 *       404:
 *         description: Space not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/:id',
  authenticate,
  validate(getSpaceByIdSchema),
  spaceController.getById.bind(spaceController)
);

/**
 * @swagger
 * /spaces:
 *   post:
 *     tags:
 *       - Spaces
 *     summary: Create new coworking space
 *     description: Create a new coworking space with all details
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - spaceName
 *               - spaceType
 *               - city
 *               - spaceCategory
 *             properties:
 *               spaceName:
 *                 type: string
 *                 example: WorkHub Kochi
 *               spaceType:
 *                 type: string
 *                 example: Coworking Space
 *               city:
 *                 type: string
 *                 example: Kochi
 *               spaceCategory:
 *                 type: string
 *                 example: Premium
 *               shortDescription:
 *                 type: string
 *                 example: Modern coworking space in the heart of Kochi
 *               longDescription:
 *                 type: string
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [WiFi, Coffee, Meeting Rooms, Parking]
 *               pricing:
 *                 type: object
 *                 properties:
 *                   hotDesk:
 *                     type: number
 *                     example: 500
 *                   dedicatedDesk:
 *                     type: number
 *                     example: 1000
 *                   privateOffice:
 *                     type: number
 *                     example: 5000
 *               location:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                     example: 123 MG Road
 *                   pincode:
 *                     type: string
 *                     example: 682001
 *                   latitude:
 *                     type: number
 *                     example: 9.9312
 *                   longitude:
 *                     type: number
 *                     example: 76.2673
 *               contact:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Manager Name
 *                   email:
 *                     type: string
 *                     example: contact@workhub.com
 *                   phone:
 *                     type: string
 *                     example: +91 1234567890
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [https://r2.example.com/space1.jpg]
 *               status:
 *                 type: string
 *                 enum: [active, inactive, pending]
 *                 default: pending
 *     responses:
 *       201:
 *         description: Space created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Space created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Space'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Space already exists
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authenticate,
  validate(createSpaceSchema),
  spaceController.create.bind(spaceController)
);

/**
 * @swagger
 * /spaces/{id}:
 *   put:
 *     tags:
 *       - Spaces
 *     summary: Update space
 *     description: Update an existing coworking space
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Space ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               spaceName:
 *                 type: string
 *               spaceType:
 *                 type: string
 *               city:
 *                 type: string
 *               spaceCategory:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               longDescription:
 *                 type: string
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               pricing:
 *                 type: object
 *               location:
 *                 type: object
 *               contact:
 *                 type: object
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, pending]
 *     responses:
 *       200:
 *         description: Space updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Space updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Space'
 *       404:
 *         description: Space not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/:id',
  authenticate,
  validate(updateSpaceSchema),
  spaceController.update.bind(spaceController)
);

/**
 * @swagger
 * /spaces/{id}:
 *   delete:
 *     tags:
 *       - Spaces
 *     summary: Delete space
 *     description: Soft delete a coworking space (marks as deleted but keeps in database)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Space ID
 *     responses:
 *       200:
 *         description: Space deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Space not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/:id',
  authenticate,
  validate(deleteSpaceSchema),
  spaceController.delete.bind(spaceController)
);

export default router;
