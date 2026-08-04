import React, { useState } from 'react';
import { FiX, FiPlay, FiSquare, FiCopy, FiCheck, FiCpu, FiZap, FiRefreshCw } from 'react-icons/fi';
import { useAIStream } from '../../hooks/useAIStream.js';

const PROMPT_TEMPLATES = [
  {
    id: 'GENERATE_PROJECT_DESC',
    label: 'Project Overview',
    placeholder: 'Describe the core features, challenges solved, or performance outcomes of this project...',
  },
  {
    id: 'OPTIMIZE_SEO',
    label: 'SEO Metadata',
    placeholder: 'Enter page topic, technology highlights, or target keywords to optimize SEO meta title and description...',
  },
  {
    id: 'SUGGEST_CONTACT_REPLY',
    label: 'Contact Reply',
    placeholder: 'Paste the contact inquiry message here to draft a polite, professional engineering response...',
  },
  {
    id: 'SUMMARIZE_BLOG_POST',
    label: 'Article Summary',
    placeholder: 'Paste blog post raw draft or bullet points to generate an executive summary and takeaways...',
  },
  {
    id: 'FREEFORM_ASSISTANT',
    label: 'Freeform AI Prompt',
    placeholder: 'Ask Sagar.dev AI Assistant anything regarding code architecture, refactoring, or documentation...',
  },
];

export function AIAssistantDrawer({ isOpen, onClose }) {
  const [selectedType, setSelectedType] = useState('GENERATE_PROJECT_DESC');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const { text, isStreaming, error, metadata, startStream, stopStream, resetStream } = useAIStream();

  if (!isOpen) return null;

  const currentTemplate = PROMPT_TEMPLATES.find((t) => t.id === selectedType) || PROMPT_TEMPLATES[0];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    try {
      await startStream({
        promptType: selectedType,
        input: input.trim(),
      });
    } catch (err) {
      console.error('AI Stream Error:', err);
    }
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    resetStream();
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end transition-opacity animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0f172a] border-l border-slate-800 text-slate-100 flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-[#1e293b]/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <FiZap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                AI Subagent Assistant <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30 text-[10px] font-mono text-purple-300">Gemini 2.0</span>
              </h3>
              <p className="text-xs text-slate-400">Real-time SSE intelligent generation for Sagar.dev CMS</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Prompt Type Selector Tabs */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2">Select Generation Mode</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROMPT_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setSelectedType(tmpl.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    selectedType === tmpl.id
                      ? 'bg-purple-600/20 border-purple-500/40 text-purple-300 font-semibold shadow-sm'
                      : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Input */}
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">Prompt Context & Input</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentTemplate.placeholder}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500/50 resize-none font-sans"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleClear}
                disabled={isStreaming}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 transition-colors disabled:opacity-50"
              >
                Reset
              </button>

              {isStreaming ? (
                <button
                  type="button"
                  onClick={stopStream}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-red-600/20 text-red-300 border border-red-500/40 hover:bg-red-600/30 transition-all"
                >
                  <FiSquare className="w-4 h-4 fill-current" />
                  Stop Stream
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-purple-600 text-white hover:bg-purple-500 border border-purple-500/50 shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlay className="w-3.5 h-3.5 fill-current" />
                  Generate Response
                </button>
              )}
            </div>
          </form>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/50 text-red-300 text-xs flex items-center gap-3">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Real-time Streaming Output Display Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <span>AI Output Stream</span>
                {isStreaming && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-purple-400 font-semibold animate-pulse">
                    <FiRefreshCw className="w-3 h-3 animate-spin" /> Streaming...
                  </span>
                )}
              </label>

              {text && (
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800/60 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                >
                  {copied ? <FiCheck className="w-3.5 h-3.5 text-emerald-400" /> : <FiCopy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Result'}</span>
                </button>
              )}
            </div>

            <div className="min-h-[200px] max-h-[360px] overflow-y-auto p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {text || <span className="text-slate-600 italic">Response stream will appear here in real-time...</span>}
            </div>

            {/* Performance Stats */}
            {metadata && (
              <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-500 border-t border-slate-800/60">
                <span>Model: <strong className="text-slate-400">{metadata.model || 'gemini-2.0-flash'}</strong></span>
                <span>Latency: <strong className="text-purple-400">{metadata.latencyMs}ms</strong></span>
                {metadata.usage && (
                  <span>Tokens: <strong className="text-cyan-400">{metadata.usage.totalTokens}</strong> ({metadata.usage.promptTokens} in / {metadata.usage.completionTokens} out)</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistantDrawer;
