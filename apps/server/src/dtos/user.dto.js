/**
 * User Data Transfer Object (DTO)
 * Sanitizes User data returned across Services and Controllers, ensuring zero exposure of sensitive fields.
 */
export class UserDTO {
  /**
   * @param {Object} user - User model document or object
   */
  constructor(user) {
    this.id = user._id ? user._id.toString() : user.id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  /**
   * Static helper to transform a single document or array of documents into DTO(s).
   * @param {Object|Array} data
   * @returns {UserDTO|UserDTO[]}
   */
  static from(data) {
    if (!data) return null;
    if (Array.isArray(data)) {
      return data.map((item) => new UserDTO(item));
    }
    return new UserDTO(data);
  }
}

export default UserDTO;
