/**
 * Contact Data Transfer Object (DTO).
 * Sanitizes Contact document payloads before returning API responses.
 */
export class ContactDTO {
  /**
   * @param {Object} contact - Mongoose Contact document or raw object
   */
  constructor(contact) {
    this.id = contact._id ? contact._id.toString() : contact.id;
    this.name = contact.name;
    this.email = contact.email;
    this.subject = contact.subject;
    this.message = contact.message;
    this.status = contact.status || 'unread';
    this.attachments = contact.attachments || [];
    this.createdAt = contact.createdAt;
    this.updatedAt = contact.updatedAt;
  }

  /**
   * Transforms single document or list of documents to ContactDTO(s).
   * @param {Object|Array} data
   * @returns {ContactDTO|ContactDTO[]|null}
   */
  static from(data) {
    if (!data) return null;
    if (Array.isArray(data)) {
      return data.map((item) => new ContactDTO(item));
    }
    return new ContactDTO(data);
  }
}

export default ContactDTO;
