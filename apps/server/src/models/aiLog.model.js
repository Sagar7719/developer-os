import mongoose from 'mongoose';

const aiLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    promptType: {
      type: String,
      required: true,
      enum: [
        'GENERATE_PROJECT_DESC',
        'SUMMARIZE_BLOG_POST',
        'OPTIMIZE_SEO',
        'SUGGEST_CONTACT_REPLY',
        'FREEFORM_ASSISTANT',
      ],
      index: true,
    },
    model: {
      type: String,
      required: true,
      default: 'gemini-2.0-flash',
    },
    promptTokens: {
      type: Number,
      default: 0,
    },
    completionTokens: {
      type: Number,
      default: 0,
    },
    totalTokens: {
      type: Number,
      default: 0,
    },
    latencyMs: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      default: 'SUCCESS',
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Composite Index for User audit history
aiLogSchema.index({ user: 1, createdAt: -1 });

// MongoDB TTL Index: 90 days automatic expiration (90 * 24 * 60 * 60 = 7776000 seconds)
aiLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

export const AILog = mongoose.model('AILog', aiLogSchema);
export default AILog;
