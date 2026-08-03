import { contactRepository } from '../repositories/contact.repository.js';
import { emailService } from './email.service.js';
import { ContactDTO } from '../dtos/contact.dto.js';
import { ApiError } from '../utils/apiError.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';
import { logger } from '../config/logger.js';

/**
 * ContactService — Layer 3: Business domain logic for Contact submissions.
 */
export class ContactService {
  /**
   * Submit a new contact message and dispatch email notification.
   * @param {Object} contactData - { name, email, subject, message }
   * @returns {Promise<ContactDTO>}
   */
  async createContact(contactData) {
    const newContact = await contactRepository.create({
      ...contactData,
      status: 'unread',
    });

    const contactId = newContact._id.toString();

    logger.info('[Audit] Contact submitted successfully', {
      contactId,
      email: newContact.email,
      name: newContact.name,
    });

    // Asynchronously dispatch admin notification email
    emailService.sendContactNotification({
      name: newContact.name,
      email: newContact.email,
      subject: newContact.subject,
      message: newContact.message,
      contactId,
    });

    return ContactDTO.from(newContact);
  }

  /**
   * Get list of contact messages matching status filter or search term.
   * @param {Object} queryOptions - { status, search }
   * @returns {Promise<ContactDTO[]>}
   */
  async getContacts(queryOptions = {}) {
    const contacts = await contactRepository.findAll(queryOptions);
    return ContactDTO.from(contacts);
  }

  /**
   * Get single contact message by ID. Automatically marks unread messages as read.
   * @param {string} id
   * @returns {Promise<ContactDTO>}
   */
  async getContactById(id) {
    let contact = await contactRepository.findById(id);
    if (!contact) {
      throw new ApiError(HttpStatus.NOT_FOUND, ResponseMessages.NOT_FOUND);
    }

    if (contact.status === 'unread') {
      contact = await contactRepository.updateStatus(id, 'read');
      logger.info('[Audit] Contact marked as read', { contactId: id });
    }

    return ContactDTO.from(contact);
  }

  /**
   * Update message status (e.g., 'read', 'replied').
   * @param {string} id
   * @param {string} status
   * @returns {Promise<ContactDTO>}
   */
  async updateStatus(id, status) {
    const existing = await contactRepository.findById(id);
    if (!existing) {
      throw new ApiError(HttpStatus.NOT_FOUND, ResponseMessages.NOT_FOUND);
    }

    const updated = await contactRepository.updateStatus(id, status);

    logger.info(`[Audit] Contact marked as ${status}`, { contactId: id });

    return ContactDTO.from(updated);
  }

  /**
   * Soft delete a contact message.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async deleteContact(id) {
    const existing = await contactRepository.findById(id);
    if (!existing) {
      throw new ApiError(HttpStatus.NOT_FOUND, ResponseMessages.NOT_FOUND);
    }

    await contactRepository.softDeleteById(id);

    logger.info('[Audit] Contact soft deleted successfully', { contactId: id });
  }
}

export const contactService = new ContactService();
export default contactService;
