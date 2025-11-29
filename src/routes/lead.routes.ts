import { Router } from 'express';
import { leadController } from '@controllers/lead.controller';
import { authenticate } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validation.middleware';
import {
  createLeadSchema,
  updateLeadSchema,
  updateLeadStatusSchema,
  getLeadsQuerySchema,
  getLeadByIdSchema,
  deleteLeadSchema,
} from '@validators/lead.validator';

const router = Router();

/**
 * @swagger
 * /leads:
 *   get:
 *     tags:
 *       - Leads
 *     summary: Get all leads
 *     description: Retrieve list of all leads with pagination and filters
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
 *           enum: [new, contacted, qualified, converted, lost]
 *         description: Filter by status
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, phone, or enquired space
 *     responses:
 *       200:
 *         description: List of leads retrieved successfully
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
 *                     $ref: '#/components/schemas/Lead'
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
  validate(getLeadsQuerySchema),
  leadController.getAll.bind(leadController)
);

/**
 * @swagger
 * /leads/{id}:
 *   get:
 *     tags:
 *       - Leads
 *     summary: Get lead by ID
 *     description: Retrieve detailed information about a specific lead
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lead ID
 *     responses:
 *       200:
 *         description: Lead details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Lead'
 *       404:
 *         description: Lead not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/:id',
  authenticate,
  validate(getLeadByIdSchema),
  leadController.getById.bind(leadController)
);

/**
 * @swagger
 * /leads:
 *   post:
 *     tags:
 *       - Leads
 *     summary: Create new lead (Public Endpoint)
 *     description: Create a new lead from website contact/enquiry form. This endpoint does not require authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - enquiredFor
 *               - spaceType
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               phone:
 *                 type: string
 *                 example: +91 9876543210
 *               enquiredFor:
 *                 type: string
 *                 example: WorkHub Kochi
 *               spaceType:
 *                 type: string
 *                 example: Hot Desk
 *               numberOfSeats:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *               location:
 *                 type: string
 *                 example: Kochi
 *               message:
 *                 type: string
 *                 example: I would like to schedule a visit
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-12-01T10:00:00Z
 *     responses:
 *       201:
 *         description: Lead created successfully
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
 *                   example: Lead created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Lead'
 *       400:
 *         description: Validation error
 */
router.post(
  '/',
  validate(createLeadSchema),
  leadController.create.bind(leadController)
);

/**
 * @swagger
 * /leads/{id}:
 *   put:
 *     tags:
 *       - Leads
 *     summary: Update lead
 *     description: Update an existing lead with full data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lead ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               enquiredFor:
 *                 type: string
 *               spaceType:
 *                 type: string
 *               numberOfSeats:
 *                 type: integer
 *               location:
 *                 type: string
 *               message:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [new, contacted, qualified, converted, lost]
 *     responses:
 *       200:
 *         description: Lead updated successfully
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
 *                   example: Lead updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Lead'
 *       404:
 *         description: Lead not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/:id',
  authenticate,
  validate(updateLeadSchema),
  leadController.update.bind(leadController)
);

/**
 * @swagger
 * /leads/{id}:
 *   patch:
 *     tags:
 *       - Leads
 *     summary: Update lead status
 *     description: Update the status of an existing lead (for admin tracking)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lead ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, contacted, qualified, converted, lost]
 *                 example: contacted
 *     responses:
 *       200:
 *         description: Lead status updated successfully
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
 *                   example: Lead status updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Lead'
 *       404:
 *         description: Lead not found
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/:id',
  authenticate,
  validate(updateLeadStatusSchema),
  leadController.updateStatus.bind(leadController)
);

/**
 * @swagger
 * /leads/{id}:
 *   delete:
 *     tags:
 *       - Leads
 *     summary: Delete lead
 *     description: Soft delete a lead (marks as deleted but keeps in database)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lead ID
 *     responses:
 *       200:
 *         description: Lead deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Lead not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/:id',
  authenticate,
  validate(deleteLeadSchema),
  leadController.delete.bind(leadController)
);

export default router;
