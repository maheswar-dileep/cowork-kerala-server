import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "@config/env";
import crypto from "crypto";
import path from "path";

export class R2Service {
  private client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    // Initialize S3 client for Cloudflare R2
    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${config.r2.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.r2.accessKeyId,
        secretAccessKey: config.r2.secretAccessKey,
      },
    });

    this.bucketName = config.r2.bucketName;
    this.publicUrl = config.r2.publicUrl;
  }

  /**
   * Generate a unique filename
   */
  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString("hex");
    const ext = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, ext);
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, "_");

    return `${sanitizedName}_${timestamp}_${randomString}${ext}`;
  }

  /**
   * Upload file to R2
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = "uploads"
  ): Promise<{ key: string; url: string; size: number; mimeType: string }> {
    try {
      const fileName = this.generateFileName(file.originalname);
      const key = `${folder}/${fileName}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
        },
      });

      await this.client.send(command);

      // Construct public URL
      const url = this.publicUrl
        ? `${this.publicUrl}/${key}`
        : `https://${this.bucketName}.${config.r2.accountId}.r2.cloudflarestorage.com/${key}`;

      return {
        key,
        url,
        size: file.size,
        mimeType: file.mimetype,
      };
    } catch (error) {
      console.error("R2 upload error:", error);
      throw new Error("Failed to upload file to R2");
    }
  }

  /**
   * Upload multiple files to R2
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = "uploads"
  ): Promise<
    Array<{ key: string; url: string; size: number; mimeType: string }>
  > {
    const uploadPromises = files.map((file) => this.uploadFile(file, folder));
    return await Promise.all(uploadPromises);
  }

  /**
   * Delete file from R2
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.client.send(command);
    } catch (error) {
      console.error("R2 delete error:", error);
      throw new Error("Failed to delete file from R2");
    }
  }

  /**
   * Delete multiple files from R2
   */
  async deleteMultipleFiles(keys: string[]): Promise<void> {
    const deletePromises = keys.map((key) => this.deleteFile(key));
    await Promise.all(deletePromises);
  }

  /**
   * Generate a pre-signed URL for temporary access (GET)
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.client, command, { expiresIn });
      return signedUrl;
    } catch (error) {
      console.error("R2 signed URL error:", error);
      throw new Error("Failed to generate signed URL");
    }
  }

  /**
   * Generate a pre-signed URL for uploading (PUT)
   */
  async getPutSignedUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      });

      const signedUrl = await getSignedUrl(this.client, command, { expiresIn });
      return signedUrl;
    } catch (error) {
      console.error("R2 PUT signed URL error:", error);
      throw new Error("Failed to generate upload signed URL");
    }
  }

  /**
   * Check if R2 is properly configured
   */
  isConfigured(): boolean {
    return !!(
      config.r2.accountId &&
      config.r2.accessKeyId &&
      config.r2.secretAccessKey &&
      config.r2.bucketName
    );
  }
}

export const r2Service = new R2Service();
