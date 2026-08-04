export type AIPromptType =
  | 'GENERATE_PROJECT_DESC'
  | 'SUMMARIZE_BLOG_POST'
  | 'OPTIMIZE_SEO'
  | 'SUGGEST_CONTACT_REPLY'
  | 'FREEFORM_ASSISTANT';

export interface AICompletionOptions {
  promptType: AIPromptType;
  input: string;
  context?: Record<string, any>;
  temperature?: number;
  maxTokens?: number;
}

export interface AICompletionResponseData {
  text: string;
  promptType: AIPromptType;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
}

export interface AIStreamChunk {
  chunk: string;
  done: boolean;
}

export interface AILogDTO {
  id: string;
  userId: string;
  promptType: AIPromptType;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  status: 'SUCCESS' | 'FAILED';
  errorMessage?: string;
  createdAt: string;
}
