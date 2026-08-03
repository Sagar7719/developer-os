import { Contact } from '../models/contact.model.js';

/**
 * ContactRepository — Layer 4: Data Access abstraction for Contact entity.
 */
export class ContactRepository {
  /**
   * Find all non-deleted contact messages with optional filtering & multi-field search.
   * @param {Object} options
   * @param {string} [options.status]
   * @param {string} [options.search]
   * @returns {Promise<import('mongoose').Document[]>}
   */
  async findAll({ status, search } = {}) {
    const filter = { isDeleted: false };

    if (status) {
      filter.status = status;
    }

    if (search && search.trim().length > 0) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex },
      ];
    }

    return Contact.find(filter).sort({ createdAt: -1 }).exec();
  }

  /**
   * Find contact message by ID.
   * @param {string} id
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async findById(id) {
    return Contact.findOne({ _id: id, isDeleted: false }).exec();
  }

  /**
   * Create a new contact submission.
   * @param {Object} contactData
   * @returns {Promise<import('mongoose').Document>}
   */
  async create(contactData) {
    const contact = new Contact(contactData);
    return contact.save();
  }

  /**
   * Update message status by ID.
   * @param {string} id
   * @param {string} status
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async updateStatus(id, status) {
    return Contact.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { status } },
      { new: true, runValidators: true }
    ).exec();
  }

  /**
   * Soft delete contact message by ID.
   * @param {string} id
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async softDeleteById(id) {
    return Contact.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    ).exec();
  }
}

export const contactRepository = new ContactRepository();
export default contactRepository;
