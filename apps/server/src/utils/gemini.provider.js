import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env.config.js';
import logger from '../config/logger.js';
import ApiError from './apiError.js';
import { HttpStatus } from '../constants/httpStatus.js';

export class GeminiProvider {
  constructor() {
    this.apiKey = config.geminiApiKey;
    this.defaultModel = config.geminiModel || 'gemini-2.0-flash';
    this.client = null;
    this.initClient();
  }

  initClient() {
    if (this.apiKey) {
      try {
        this.client = new GoogleGenAI({ apiKey: this.apiKey });
      } catch (err) {
        logger.error(`[GeminiProvider] Initialization error: ${err.message}`);
      }
    }
  }

  getClient() {
    if (!this.client) {
      if (!config.geminiApiKey) {
        throw new ApiError(
          HttpStatus.SERVICE_UNAVAILABLE,
          'Google Gemini API Key is missing. Configure GEMINI_API_KEY in server environment settings.'
        );
      }
      this.client = new GoogleGenAI({ apiKey: config.geminiApiKey });
    }
    return this.client;
  }

  /**
   * Synchronously generates text content from Google Gemini.
   * @param {Object} options
   * @param {string} options.contents
   * @param {string} [options.systemInstruction]
   * @param {string} [options.model]
   * @param {number} [options.temperature=0.7]
   * @param {number} [options.maxTokens=1000]
   * @returns {Promise<{ text: string, usage: { promptTokens: number, completionTokens: number, totalTokens: number } }>}
   */
  async generateContent({
    contents,
    systemInstruction,
    model = this.defaultModel,
    temperature = 0.7,
    maxOutputTokens = 1000,
  }) {
    const ai = this.getClient();
    const startTime = Date.now();

    try {
      const genConfig = {
        temperature,
        maxOutputTokens,
      };

      if (systemInstruction) {
        genConfig.systemInstruction = systemInstruction;
      }

      const response = await ai.models.generateContent({
        model,
        contents,
        config: genConfig,
      });

      const text = response.text || '';

      const usageMetadata = response.usageMetadata || {};
      const promptTokens = usageMetadata.promptTokenCount || Math.ceil((contents?.length || 0) / 4);
      const completionTokens = usageMetadata.candidatesTokenCount || Math.ceil(text.length / 4);
      const totalTokens = usageMetadata.totalTokenCount || (promptTokens + completionTokens);

      return {
        text,
        model,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens,
        },
        latencyMs: Date.now() - startTime,
      };
    } catch (error) {
      logger.error(`[GeminiProvider.generateContent] Error: ${error.message}`, { error });
      throw new ApiError(
        HttpStatus.BAD_GATEWAY,
        `Gemini AI Service Exception: ${error.message}`
      );
    }
  }

  /**
   * Streams text content from Google Gemini chunk by chunk.
   * @param {Object} options
   * @param {Function} onChunk - Callback receiving text chunks: (chunk: string) => void
   * @returns {Promise<{ fullText: string, usage: { promptTokens: number, completionTokens: number, totalTokens: number }, latencyMs: number }>}
   */
  async generateStreamContent(
    {
      contents,
      systemInstruction,
      model = this.defaultModel,
      temperature = 0.7,
      maxOutputTokens = 1000,
    },
    onChunk
  ) {
    const ai = this.getClient();
    const startTime = Date.now();
    let fullText = '';

    try {
      const genConfig = {
        temperature,
        maxOutputTokens,
      };

      if (systemInstruction) {
        genConfig.systemInstruction = systemInstruction;
      }

      const responseStream = await ai.models.generateContentStream({
        model,
        contents,
        config: genConfig,
      });

      for await (const chunk of responseStream) {
        const text = chunk.text || '';
        if (text) {
          fullText += text;
          if (typeof onChunk === 'function') {
            onChunk(text);
          }
        }
      }

      const promptTokens = Math.ceil((contents?.length || 0) / 4);
      const completionTokens = Math.ceil(fullText.length / 4);
      const totalTokens = promptTokens + completionTokens;

      return {
        fullText,
        model,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens,
        },
        latencyMs: Date.now() - startTime,
      };
    } catch (error) {
      logger.error(`[GeminiProvider.generateStreamContent] Error: ${error.message}`, { error });
      throw new ApiError(
        HttpStatus.BAD_GATEWAY,
        `Gemini AI Stream Exception: ${error.message}`
      );
    }
  }
}

export const geminiProvider = new GeminiProvider();
export default geminiProvider;
