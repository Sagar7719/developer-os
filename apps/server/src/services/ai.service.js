import geminiProvider from '../utils/gemini.provider.js';
import PromptTemplateEngine from '../utils/promptTemplate.engine.js';
import aiLogRepository from '../repositories/aiLog.repository.js';
import logger from '../config/logger.js';

export class AIService {
  /**
   * Generates a synchronous AI response, logs audit trail, and returns execution payload.
   * @param {Object} options
   * @param {string} options.userId
   * @param {string} options.promptType
   * @param {string} options.input
   * @param {Object} [options.context]
   * @param {number} [options.temperature]
   * @param {number} [options.maxTokens]
   * @returns {Promise<Object>}
   */
  async generateCompletion({ userId, promptType, input, context = {}, temperature, maxTokens }) {
    const { systemInstruction, contents } = PromptTemplateEngine.buildPrompt(promptType, input, context);

    let result = null;
    let status = 'SUCCESS';
    let errorMessage = null;

    try {
      result = await geminiProvider.generateContent({
        contents,
        systemInstruction,
        temperature,
        maxOutputTokens: maxTokens,
      });

      return {
        text: result.text,
        promptType,
        model: result.model,
        usage: result.usage,
        latencyMs: result.latencyMs,
      };
    } catch (err) {
      status = 'FAILED';
      errorMessage = err.message;
      throw err;
    } finally {
      // Asynchronously audit log execution without blocking caller
      try {
        await aiLogRepository.createLog({
          user: userId,
          promptType,
          model: result?.model || 'gemini-2.0-flash',
          promptTokens: result?.usage?.promptTokens || 0,
          completionTokens: result?.usage?.completionTokens || 0,
          totalTokens: result?.usage?.totalTokens || 0,
          latencyMs: result?.latencyMs || 0,
          status,
          errorMessage,
        });
      } catch (logErr) {
        logger.error(`[AIService] Failed to create audit log: ${logErr.message}`);
      }
    }
  }

  /**
   * Streams AI text generation chunk by chunk, invoking onChunk callback.
   * @param {Object} options
   * @param {string} options.userId
   * @param {string} options.promptType
   * @param {string} options.input
   * @param {Object} [options.context]
   * @param {number} [options.temperature]
   * @param {number} [options.maxTokens]
   * @param {Function} onChunk - (chunkText: string) => void
   * @returns {Promise<Object>}
   */
  async generateStream({ userId, promptType, input, context = {}, temperature, maxTokens }, onChunk) {
    const { systemInstruction, contents } = PromptTemplateEngine.buildPrompt(promptType, input, context);

    let result = null;
    let status = 'SUCCESS';
    let errorMessage = null;

    try {
      result = await geminiProvider.generateStreamContent(
        {
          contents,
          systemInstruction,
          temperature,
          maxOutputTokens: maxTokens,
        },
        onChunk
      );

      return {
        fullText: result.fullText,
        promptType,
        model: result.model,
        usage: result.usage,
        latencyMs: result.latencyMs,
      };
    } catch (err) {
      status = 'FAILED';
      errorMessage = err.message;
      throw err;
    } finally {
      try {
        await aiLogRepository.createLog({
          user: userId,
          promptType,
          model: result?.model || 'gemini-2.0-flash',
          promptTokens: result?.usage?.promptTokens || 0,
          completionTokens: result?.usage?.completionTokens || 0,
          totalTokens: result?.usage?.totalTokens || 0,
          latencyMs: result?.latencyMs || 0,
          status,
          errorMessage,
        });
      } catch (logErr) {
        logger.error(`[AIService] Failed to create stream audit log: ${logErr.message}`);
      }
    }
  }

  /**
   * Retrieves paginated AI audit logs for admin review.
   * @param {Object} pagination
   * @returns {Promise<Object>}
   */
  async getLogs(pagination) {
    return aiLogRepository.getLogsPaginated(pagination);
  }

  /**
   * Aggregates usage statistics.
   * @returns {Promise<Array>}
   */
  async getStats() {
    return aiLogRepository.getUsageStats();
  }
}

export const aiService = new AIService();
export default aiService;
