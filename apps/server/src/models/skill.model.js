import mongoose from 'mongoose';

export const SKILL_CATEGORIES = Object.freeze([
  'frontend',
  'backend',
  'database',
  'devops',
  'tools',
]);

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Skill name cannot exceed 50 characters'],
    },
    category: {
      type: String,
      enum: {
        values: SKILL_CATEGORIES,
        message: '{VALUE} is not a valid skill category',
      },
      required: [true, 'Skill category is required'],
      index: true,
    },
    proficiency: {
      type: Number,
      min: [1, 'Proficiency must be at least 1'],
      max: [100, 'Proficiency cannot exceed 100'],
      default: 85,
    },
    yearsOfExperience: {
      type: Number,
      min: [0, 'Years of experience cannot be negative'],
      default: 1,
    },
    icon: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
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

// Compound index for category filtering and ordering of non-deleted skills
skillSchema.index({ isDeleted: 1, category: 1, order: 1 });

export const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
