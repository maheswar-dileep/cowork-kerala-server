import mongoose, { Schema } from "mongoose";
import { ILead } from "../types/lead.types";

const leadSchema = new Schema<ILead>(
  {
    leadId: {
      type: String,
      unique: true,
      // Not required since it's auto-generated in pre-save hook
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    enquiredFor: {
      type: String,
      required: [true, "Enquired space is required"],
      trim: true,
    },
    spaceType: {
      type: String,
      required: [true, "Space type is required"],
      trim: true,
    },
    numberOfSeats: {
      type: Number,
      min: [1, "Number of seats must be at least 1"],
    },
    location: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "converted", "lost"],
      default: "new",
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
leadSchema.index({ status: 1 });
leadSchema.index({ isDeleted: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ createdAt: -1 });

// Pre-save hook to generate leadId
leadSchema.pre("save", async function (next) {
  if (!this.leadId) {
    try {
      // Get the current year
      const year = new Date().getFullYear();

      // Find the latest lead ID for this year
      const lastLead = await mongoose
        .model("Lead")
        .findOne({ leadId: new RegExp(`^LD-${year}-`) }, { leadId: 1 })
        .sort({ leadId: -1 });

      let sequence = 1;
      if (lastLead && lastLead.leadId) {
        const lastSequence = parseInt(lastLead.leadId.split("-")[2]);
        sequence = lastSequence + 1;
      }

      // Generate new ID: LD-YYYY-NNN
      this.leadId = `LD-${year}-${String(sequence).padStart(3, "0")}`;
    } catch (error: any) {
      next(error);
    }
  }
  next();
});

// Method to soft delete
leadSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

// Static method to find non-deleted leads
leadSchema.statics.findNonDeleted = function (filter = {}) {
  return this.find({ ...filter, isDeleted: false });
};

export const Lead = mongoose.model<ILead>("Lead", leadSchema);
