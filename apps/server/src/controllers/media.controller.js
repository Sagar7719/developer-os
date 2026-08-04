import { mediaService } from '../services/media.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';

/**
 * MediaController — Layer 2: HTTP request handling and response formatting for Media endpoints.
 */
export class MediaController {
  /**
   * POST /api/v1/media/upload
   * Handles single file upload to Cloudinary storage and metadata creation.
   */
  uploadMedia = asyncHandler(async (req, res) => {
    const file = req.file;
    const folder = req.body.folder;
    const userId = req.user ? req.user.userId : null;

    const media = await mediaService.uploadMediaFile({
      file,
      folder,
      userId,
    });

    return res.status(HttpStatus.CREATED).json(
      ApiResponse.success({
        statusCode: HttpStatus.CREATED,
        message: 'Media asset uploaded successfully.',
        data: { media },
      })
    );
  });

  /**
   * GET /api/v1/media
   * Retrieves paginated list of media assets.
   */
  getAllMedia = asyncHandler(async (req, res) => {
    const { folder, page, limit } = req.query;
    const result = await mediaService.getAllMedia({ folder, page, limit });

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.SUCCESS,
        data: result,
      })
    );
  });

  /**
   * GET /api/v1/media/:id
   * Retrieves single media asset by ID.
   */
  getMediaById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const media = await mediaService.getMediaById(id);

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.SUCCESS,
        data: { media },
      })
    );
  });

  /**
   * DELETE /api/v1/media/:id
   * Destroys media asset from Cloudinary storage and soft-deletes database record.
   */
  deleteMedia = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user ? req.user.userId : null;
    const result = await mediaService.deleteMediaAsset(id, userId);

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.DELETED_SUCCESS,
        data: result,
      })
    );
  });
}

export const mediaController = new MediaController();
export default mediaController;
