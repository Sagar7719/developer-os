import { contactService } from '../services/contact.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';

/**
 * ContactController — Layer 2: Parses HTTP requests and serializes contact response envelopes.
 */
export class ContactController {
  /**
   * POST /api/v1/contact
   */
  createContact = asyncHandler(async (req, res) => {
    const contact = await contactService.createContact(req.body);

    return res.status(HttpStatus.CREATED).json(
      ApiResponse.success({
        statusCode: HttpStatus.CREATED,
        message: ResponseMessages.CREATED_SUCCESS,
        data: { contact },
      })
    );
  });

  /**
   * GET /api/v1/contact
   */
  getContacts = asyncHandler(async (req, res) => {
    const { status, search } = req.query;
    const contacts = await contactService.getContacts({ status, search });

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.SUCCESS,
        data: { contacts },
      })
    );
  });

  /**
   * GET /api/v1/contact/:id
   */
  getContactById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const contact = await contactService.getContactById(id);

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.SUCCESS,
        data: { contact },
      })
    );
  });

  /**
   * PATCH /api/v1/contact/:id/status
   */
  updateStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const contact = await contactService.updateStatus(id, status);

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.UPDATED_SUCCESS,
        data: { contact },
      })
    );
  });

  /**
   * DELETE /api/v1/contact/:id
   */
  deleteContact = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await contactService.deleteContact(id);

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.DELETED_SUCCESS,
      })
    );
  });
}

export const contactController = new ContactController();
export default contactController;
