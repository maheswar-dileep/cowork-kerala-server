import { z } from 'zod';

/**
 * Create lead validation schema
 */
export const createLeadSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }).min(1, 'Name cannot be empty'),
    email: z.string({
      required_error: 'Email is required',
    }).email('Invalid email address'),
    phone: z.string({
      required_error: 'Phone number is required',
    }).min(10, 'Phone number must be at least 10 digits'),
    enquiredFor: z.string({
      required_error: 'Enquired space is required',
    }).min(1, 'Enquired space cannot be empty'),
    spaceType: z.string({
      required_error: 'Space type is required',
    }).min(1, 'Space type cannot be empty'),
    numberOfSeats: z.number().int().min(1, 'Number of seats must be at least 1').optional(),
    location: z.string().optional(),
    message: z.string().optional(),
    date: z.string().datetime().optional().or(z.date().optional()),
  }),
});

/**
 * Update lead (full update) validation schema
 */
export const updateLeadSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Lead ID is required'),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).optional(),
    enquiredFor: z.string().min(1).optional(),
    spaceType: z.string().min(1).optional(),
    numberOfSeats: z.number().int().min(1).optional(),
    location: z.string().optional(),
    message: z.string().optional(),
    date: z.string().datetime().optional().or(z.date().optional()),
    status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).optional(),
  }),
});

/**
 * Update lead status validation schema
 */
export const updateLeadStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Lead ID is required'),
  }),
  body: z.object({
    status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost'], {
      required_error: 'Status is required',
    }),
  }),
});

/**
 * Get leads query parameters validation
 */
export const getLeadsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default('1').transform((val) => parseInt(val)),
    limit: z.string().optional().default('10').transform((val) => parseInt(val)),
    status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).optional(),
    location: z.string().optional(),
    search: z.string().optional(),
  }),
});

/**
 * Get lead by ID validation
 */
export const getLeadByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Lead ID is required'),
  }),
});

/**
 * Delete lead validation
 */
export const deleteLeadSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Lead ID is required'),
  }),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
export type GetLeadsQueryInput = z.infer<typeof getLeadsQuerySchema>;
export type GetLeadByIdInput = z.infer<typeof getLeadByIdSchema>;
export type DeleteLeadInput = z.infer<typeof deleteLeadSchema>;
