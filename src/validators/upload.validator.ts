import { z } from "zod";
import { UploadFolder } from "../types/upload.types";

/**
 * Upload query parameters validation
 */
export const uploadQuerySchema = z.object({
  query: z.object({
    folder: z.nativeEnum(UploadFolder).optional().default(UploadFolder.GENERAL),
  }),
});

/**
 * Delete file validation
 */
export const deleteFileSchema = z.object({
  body: z.object({
    key: z
      .string({
        required_error: "File key is required",
      })
      .min(1, "File key cannot be empty"),
  }),
});

/**
 * Delete multiple files validation
 */
export const deleteMultipleFilesSchema = z.object({
  body: z.object({
    keys: z.array(z.string()).min(1, "At least one file key is required"),
  }),
});

/**
 * Get signed URL validation
 */
export const getSignedUrlSchema = z.object({
  query: z.object({
    key: z
      .string({
        required_error: "File key is required",
      })
      .min(1, "File key cannot be empty"),
    expiresIn: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 3600)),
  }),
});

/**
 * Get PUT signed URL validation
 */
export const getPutSignedUrlSchema = z.object({
  query: z.object({
    folder: z.nativeEnum(UploadFolder).optional().default(UploadFolder.GENERAL),
    fileName: z.string().min(1, "File name is required"),
    contentType: z.string().min(1, "Content type is required"),
  }),
});

export type UploadQueryInput = z.infer<typeof uploadQuerySchema>;
export type DeleteFileInput = z.infer<typeof deleteFileSchema>;
export type DeleteMultipleFilesInput = z.infer<
  typeof deleteMultipleFilesSchema
>;
export type GetSignedUrlInput = z.infer<typeof getSignedUrlSchema>;
export type GetPutSignedUrlInput = z.infer<typeof getPutSignedUrlSchema>;
