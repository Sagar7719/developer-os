import apiClient, { getAccessToken } from './client.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const aiApi = {
  /**
   * Synchronous AI text completion
   */
  async generateCompletion(payload) {
    const response = await apiClient.post('/ai/generate', payload);
    return response.data;
  },

  /**
   * Real-time Server-Sent Events (SSE) AI stream reader
   * @param {Object} payload - { promptType, input, context, temperature, maxTokens }
   * @param {Function} onChunk - Callback receiving streamed text chunk string: (chunk: string) => void
   * @param {AbortSignal} [signal] - Optional AbortController signal
   * @returns {Promise<Object>} Final stats object
   */
  async generateStream(payload, onChunk, signal) {
    const token = getAccessToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/ai/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      credentials: 'include',
      signal,
    });

    if (!response.ok) {
      let errorMsg = `Streaming failed with status ${response.status}`;
      try {
        const errJson = await response.json();
        errorMsg = errJson.message || errorMsg;
      } catch {
        // ignore parse error
      }
      throw new Error(errorMsg);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let fullText = '';
    let finalMetadata = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || ''; // Keep incomplete trailing fragment in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6);
          try {
            const data = JSON.parse(jsonStr);
            if (data.error) {
              throw new Error(data.error);
            }
            if (data.chunk) {
              fullText += data.chunk;
              if (typeof onChunk === 'function') {
                onChunk(data.chunk);
              }
            }
            if (data.done) {
              finalMetadata = data;
            }
          } catch (err) {
            console.error('[aiApi.generateStream] SSE parse error:', err);
          }
        }
      }
    }

    return {
      text: fullText,
      metadata: finalMetadata,
    };
  },

  /**
   * Retrieves paginated AI audit log history.
   */
  async getLogs(params = {}) {
    const response = await apiClient.get('/ai/logs', { params });
    return response.data;
  },

  /**
   * Aggregates token usage and call stats.
   */
  async getStats() {
    const response = await apiClient.get('/ai/stats');
    return response.data;
  },
};

export default aiApi;
