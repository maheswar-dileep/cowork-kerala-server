import mongoose, { Schema } from 'mongoose';
import { ISpace } from '../types/space.types';

const spaceSchema = new Schema<ISpace>(
  {
    spaceId: {
      type: String,
      unique: true,
      // Not required since it's auto-generated in pre-save hook
    },
    spaceName: {
      type: String,
      required: [true, 'Space name is required'],
      trim: true,
    },
    spaceType: {
      type: String,
      required: [true, 'Space type is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    spaceCategory: {
      type: String,
      required: [true, 'Space category is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    longDescription: {
      type: String,
      trim: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    pricing: {
      hotDesk: { type: Number },
      dedicatedDesk: { type: Number },
      privateOffice: { type: Number },
    },
    location: {
      address: { type: String, required: false },
      pincode: { type: String, required: false },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    contact: {
      name: { type: String, required: false },
      email: { type: String, required: false },
      phone: { type: String, required: false },
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'pending',
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false, // Don't include in queries by default
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
spaceSchema.index({ city: 1, status: 1 });
spaceSchema.index({ spaceId: 1 });
spaceSchema.index({ isDeleted: 1 });

// Pre-save hook to generate spaceId
spaceSchema.pre('save', async function (next) {
  if (!this.spaceId) {
    try {
      // Get the current year
      const year = new Date().getFullYear();

      // Find the latest space ID for this year
      const lastSpace = await mongoose.model('Space').findOne(
        { spaceId: new RegExp(`^SP-${year}-`) },
        { spaceId: 1 }
      ).sort({ spaceId: -1 });

      let sequence = 1;
      if (lastSpace && lastSpace.spaceId) {
        const lastSequence = parseInt(lastSpace.spaceId.split('-')[2]);
        sequence = lastSequence + 1;
      }

      // Generate new ID: SP-YYYY-NNN
      this.spaceId = `SP-${year}-${String(sequence).padStart(3, '0')}`;
    } catch (error: any) {
      next(error);
    }
  }
  next();
});

// Method to soft delete
spaceSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

// Static method to find non-deleted spaces
spaceSchema.statics.findNonDeleted = function (filter = {}) {
  return this.find({ ...filter, isDeleted: false });
};

export const Space = mongoose.model<ISpace>('Space', spaceSchema);
