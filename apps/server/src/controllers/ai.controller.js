import aiService from '../services/ai.service.js';
import ApiResponse from '../utils/apiResponse.js';
import { HttpStatus } from '../constants/httpStatus.js';

export class AIController {
  /**
   * Synchronous AI text completion handler.
   * POST /api/v1/ai/generate
   */
  async generateCompletion(req, res, next) {
    try {
      const userId = req.user.id;
      const { promptType, input, context, temperature, maxTokens } = req.body;

      const data = await aiService.generateCompletion({
        userId,
        promptType,
        input,
        context,
        temperature,
        maxTokens,
      });

      return res.status(HttpStatus.OK).json(
        ApiResponse.success({
          statusCode: HttpStatus.OK,
          message: 'AI content generated successfully',
          data,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Real-time Server-Sent Events (SSE) AI stream handler.
   * POST /api/v1/ai/stream
   */
  async generateStream(req, res, next) {
    try {
      const userId = req.user.id;
      const { promptType, input, context, temperature, maxTokens } = req.body;

      // Establish SSE Headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no'); // Disable proxy buffering if behind Nginx
      res.flushHeaders?.();

      const result = await aiService.generateStream(
        {
          userId,
          promptType,
          input,
          context,
          temperature,
          maxTokens,
        },
        (chunkText) => {
          // Write chunk event payload to client stream
          res.write(`data: ${JSON.stringify({ chunk: chunkText, done: false })}\n\n`);
        }
      );

      // Write stream completion payload and close
      res.write(
        `data: ${JSON.stringify({
          chunk: '',
          done: true,
          model: result.model,
          usage: result.usage,
          latencyMs: result.latencyMs,
        })}\n\n`
      );
      res.end();
    } catch (error) {
      // If headers were already sent in SSE mode, write error frame
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: error.message, done: true })}\n\n`);
        res.end();
      } else {
        next(error);
      }
    }
  }

  /**
   * GET /api/v1/ai/logs
   * Retrieves paginated AI audit logs.
   */
  async getLogs(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '10', 10);
      const promptType = req.query.promptType || null;

      const data = await aiService.getLogs({
        page,
        limit,
        promptType,
      });

      return res.status(HttpStatus.OK).json(
        ApiResponse.success({
          statusCode: HttpStatus.OK,
          message: 'AI logs retrieved successfully',
          data,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/ai/stats
   * Aggregates AI token usage statistics.
   */
  async getStats(req, res, next) {
    try {
      const data = await aiService.getStats();

      return res.status(HttpStatus.OK).json(
        ApiResponse.success({
          statusCode: HttpStatus.OK,
          message: 'AI stats retrieved successfully',
          data,
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export const aiController = new AIController();
export default aiController;
