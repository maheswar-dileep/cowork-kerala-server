import { z } from 'zod';

/**
 * Pricing schema
 */
const pricingSchema = z.object({
  hotDesk: z.number().positive().optional(),
  dedicatedDesk: z.number().positive().optional(),
  privateOffice: z.number().positive().optional(),
});

/**
 * Location schema
 */
const locationSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

/**
 * Contact schema
 */
const contactSchema = z.object({
  name: z.string().min(1, 'Contact name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

/**
 * Create space validation schema
 */
export const createSpaceSchema = z.object({
  body: z.object({
    spaceName: z.string({
      required_error: 'Space name is required',
    }).min(1, 'Space name cannot be empty'),
    spaceType: z.string({
      required_error: 'Space type is required',
    }).min(1, 'Space type cannot be empty'),
    city: z.string({
      required_error: 'City is required',
    }).min(1, 'City cannot be empty'),
    spaceCategory: z.string({
      required_error: 'Space category is required',
    }).min(1, 'Space category cannot be empty'),
    shortDescription: z.string().optional(),
    longDescription: z.string().optional(),
    amenities: z.array(z.string()).optional().default([]),
    pricing: pricingSchema.optional(),
    location: locationSchema.optional(),
    contact: contactSchema.optional(),
    images: z.array(z.string().url()).optional().default([]),
    status: z.enum(['active', 'inactive', 'pending']).optional().default('pending'),
  }),
});

/**
 * Update space validation schema (all fields optional)
 */
export const updateSpaceSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Space ID is required'),
  }),
  body: z.object({
    spaceName: z.string().min(1).optional(),
    spaceType: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    spaceCategory: z.string().min(1).optional(),
    shortDescription: z.string().optional(),
    longDescription: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    pricing: pricingSchema.optional(),
    location: locationSchema.optional(),
    contact: contactSchema.optional(),
    images: z.array(z.string().url()).optional(),
    status: z.enum(['active', 'inactive', 'pending']).optional(),
  }),
});

/**
 * Get spaces query parameters validation
 */
export const getSpacesQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default('1').transform((val) => parseInt(val)),
    limit: z.string().optional().default('10').transform((val) => parseInt(val)),
    status: z.enum(['active', 'inactive', 'pending']).optional(),
    city: z.string().optional(),
    search: z.string().optional(),
  }),
});

/**
 * Get space by ID validation
 */
export const getSpaceByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Space ID is required'),
  }),
});

/**
 * Delete space validation
 */
export const deleteSpaceSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Space ID is required'),
  }),
});

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceInput = z.infer<typeof updateSpaceSchema>;
export type GetSpacesQueryInput = z.infer<typeof getSpacesQuerySchema>;
export type GetSpaceByIdInput = z.infer<typeof getSpaceByIdSchema>;
export type DeleteSpaceInput = z.infer<typeof deleteSpaceSchema>;
