import { validationResult } from 'express-validator';
import SettingsService from '../services/settings.service.js';

export class SettingsController {
  /**
   * GET /api/v1/settings
   * Fetch public site settings
   */
  static async getPublicSettings(req, res, next) {
    try {
      const settings = await SettingsService.getPublicSettings();
      res.status(200).json({
        status: 'success',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/settings/admin
   * Fetch full admin settings with system information
   */
  static async getAdminSettings(req, res, next) {
    try {
      const settings = await SettingsService.getAdminSettings();
      res.status(200).json({
        status: 'success',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/settings
   * Update site settings (Admin protected)
   */
  static async updateSettings(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'fail',
          errors: errors.array(),
        });
      }

      const userId = req.user?.id || req.user?._id;
      const updatedSettings = await SettingsService.updateSettings(req.body, userId);

      res.status(200).json({
        status: 'success',
        message: 'Platform settings updated successfully',
        data: updatedSettings,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default SettingsController;
