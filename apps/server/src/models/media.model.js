import mongoose from 'mongoose';
import { ALLOWED_MEDIA_FOLDERS, MediaFolder } from '../constants/mediaFolder.js';

const mediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, 'Filename is required'],
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true,
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      trim: true,
    },
    size: {
      type: Number,
      required: [true, 'File size in bytes is required'],
      min: [0, 'File size cannot be negative'],
    },
    folder: {
      type: String,
      enum: {
        values: ALLOWED_MEDIA_FOLDERS,
        message: '{VALUE} is not a valid media folder',
      },
      default: MediaFolder.GENERAL,
      index: true,
    },
    publicId: {
      type: String,
      required: [true, 'Storage provider public ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    url: {
      type: String,
      required: [true, 'Public URL is required'],
      trim: true,
    },
    secureUrl: {
      type: String,
      required: [true, 'Secure URL is required'],
      trim: true,
    },
    resourceType: {
      type: String,
      default: 'image',
      trim: true,
    },
    dimensions: {
      width: { type: Number, default: null },
      height: { type: Number, default: null },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.isDeleted;
        return ret;
      },
    },
  }
);

// Compound index for querying active media by folder and creation date
mediaSchema.index({ isDeleted: 1, folder: 1, createdAt: -1 });

export const Media = mongoose.model('Media', mediaSchema);
export default Media;
