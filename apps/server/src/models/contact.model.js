import mongoose from 'mongoose';

export const CONTACT_STATUS = Object.freeze(['unread', 'read', 'replied', 'archived']);

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: CONTACT_STATUS,
        message: '{VALUE} is not a valid contact status',
      },
      default: 'unread',
      index: true,
    },
    // Schema support for future file attachments
    attachments: [
      {
        name: { type: String, trim: true },
        url: { type: String, trim: true },
        size: { type: Number },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
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

// Compound index for querying non-deleted messages by status sorted chronologically
contactSchema.index({ isDeleted: 1, status: 1, createdAt: -1 });

export const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
