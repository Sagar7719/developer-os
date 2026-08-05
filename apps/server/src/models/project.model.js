import mongoose from 'mongoose';

export const PROJECT_CATEGORIES = Object.freeze([
  'web',
  'mobile',
  'backend',
  'fullstack',
  'open-source',
  'ai-ml',
]);

export const PROJECT_STATUSES = Object.freeze(['draft', 'published', 'archived']);

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
    longDescription: {
      type: String,
      default: '',
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
      default: '',
    },
    liveUrl: {
      type: String,
      trim: true,
      default: '',
    },
    figmaUrl: {
      type: String,
      trim: true,
      default: '',
    },
    coverImage: {
      type: String,
      trim: true,
      default: '',
    },
    coverImageMediaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
      default: null,
    },
    gallery: [
      {
        mediaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Media', default: null },
        url: { type: String, required: true, trim: true },
        caption: { type: String, trim: true, default: '' },
        altText: { type: String, trim: true, default: '' },
        order: { type: Number, default: 0 },
      },
    ],
    galleryImages: [
      {
        type: String,
        trim: true,
      },
    ],
    seo: {
      metaTitle: { type: String, trim: true, maxlength: 70, default: '' },
      metaDescription: { type: String, trim: true, maxlength: 160, default: '' },
      keywords: [{ type: String, trim: true }],
      canonicalUrl: { type: String, trim: true, default: '' },
      ogImage: { type: String, trim: true, default: '' },
      noIndex: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: {
        values: PROJECT_STATUSES,
        message: '{VALUE} is not a valid status',
      },
      default: 'published',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
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
    publishedAt: {
      type: Date,
      default: Date.now,
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
    deletedAt: {
      type: Date,
      default: null,
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
        return ret;
      },
    },
  }
);

// Pre-save hook to keep featured and isFeatured in sync, and isPublished synced with status
projectSchema.pre('save', function (next) {
  if (this.isModified('isFeatured')) {
    this.featured = this.isFeatured;
  } else if (this.isModified('featured')) {
    this.isFeatured = this.featured;
  }
  if (this.isModified('status')) {
    this.isPublished = this.status === 'published';
    if (this.status === 'published' && !this.publishedAt) {
      this.publishedAt = new Date();
    }
  } else if (this.isModified('isPublished')) {
    this.status = this.isPublished ? 'published' : 'draft';
  }
  next();
});

// Compound index for featured-first ordering on public portfolio queries
projectSchema.index({ isDeleted: 1, isPublished: 1, isFeatured: -1, order: 1, createdAt: -1 });
projectSchema.index({ isDeleted: 1, status: 1, isFeatured: -1, order: 1, createdAt: -1 });

// Text index for full-text search across title, description, and techStack
projectSchema.index({ title: 'text', description: 'text', techStack: 'text' });

export const Project = mongoose.model('Project', projectSchema);
export default Project;
