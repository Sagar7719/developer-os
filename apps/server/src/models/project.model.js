import mongoose from 'mongoose';

export const PROJECT_CATEGORIES = Object.freeze([
  'web',
  'mobile',
  'backend',
  'fullstack',
  'open-source',
]);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: {
        values: PROJECT_CATEGORIES,
        message: '{VALUE} is not a valid project category',
      },
      default: 'web',
      index: true,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [200, 'Subtitle cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    techStack: [
      {
        type: String,
        trim: true,
      },
    ],
    githubUrl: {
      type: String,
      trim: true,
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    galleryImages: [
      {
        type: String,
        trim: true,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

// Compound index for querying published, non-deleted, featured projects ordered
projectSchema.index({ isDeleted: 1, isPublished: 1, featured: 1, order: 1 });

export const Project = mongoose.model('Project', projectSchema);
export default Project;
