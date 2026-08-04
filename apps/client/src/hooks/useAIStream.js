import { useState, useRef, useCallback } from 'react';
import aiApi from '../api/ai.api';

export function useAIStream() {
  const [text, setText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const abortControllerRef = useRef(null);

  const startStream = useCallback(async (payload) => {
    setText('');
    setError(null);
    setMetadata(null);
    setIsStreaming(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const result = await aiApi.generateStream(
        payload,
        (chunk) => {
          setText((prev) => prev + chunk);
        },
        controller.signal
      );

      setMetadata(result.metadata);
      return result.text;
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('[useAIStream] Stream aborted by user.');
      } else {
        setError(err.message || 'Streaming failed');
      }
      throw err;
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  }, []);

  const resetStream = useCallback(() => {
    stopStream();
    setText('');
    setError(null);
    setMetadata(null);
    setIsStreaming(false);
  }, [stopStream]);

  return {
    text,
    isStreaming,
    error,
    metadata,
    startStream,
    stopStream,
    resetStream,
  };
}

export default useAIStream;
