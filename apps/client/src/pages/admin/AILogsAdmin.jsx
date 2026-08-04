import React, { useState, useEffect } from 'react';
import { FiCpu, FiActivity, FiClock, FiZap, FiRefreshCw, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import aiApi from '../../api/ai.api.js';

export function AILogsAdmin() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (currentPage = 1) => {
    try {
      setLoading(true);
      setError(null);
      const [logsRes, statsRes] = await Promise.all([
        aiApi.getLogs({ page: currentPage, limit: 10 }),
        aiApi.getStats(),
      ]);

      if (logsRes.success) {
        setLogs(logsRes.data.logs || []);
        setTotalPages(logsRes.data.totalPages || 1);
        setPage(logsRes.data.page || 1);
      }

      if (statsRes.success) {
        setStats(statsRes.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load AI analytics and log data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const totalCalls = stats.reduce((acc, s) => acc + (s.totalCalls || 0), 0);
  const totalTokens = stats.reduce((acc, s) => acc + (s.totalTokens || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FiCpu className="w-6 h-6 text-purple-400" />
            AI Subagent Insights & Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time token usage telemetry, prompt analytics, and 90-day execution audit history.
          </p>
        </div>

        <button
          onClick={() => fetchData(page)}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono border border-slate-700/80 transition-colors disabled:opacity-50"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <FiActivity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400">Total AI Invocations</div>
            <div className="text-xl font-bold text-white mt-0.5">{totalCalls}</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <FiZap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400">Total Tokens Processed</div>
            <div className="text-xl font-bold text-white mt-0.5">{totalTokens.toLocaleString()}</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <FiClock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400">Log Retention Window</div>
            <div className="text-xl font-bold text-emerald-300 mt-0.5">90 Days (TTL)</div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/50 text-red-300 text-xs flex items-center gap-3">
          <FiAlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <h2 className="text-xs font-mono text-slate-300 font-semibold uppercase tracking-wider">
            Execution Audit Logs History
          </h2>
          <span className="text-[11px] font-mono text-slate-500">Page {page} of {totalPages}</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-slate-500 flex items-center justify-center gap-2">
            <FiRefreshCw className="w-4 h-4 animate-spin text-purple-400" />
            Loading AI telemetry records...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-slate-500">
            No AI generation logs recorded yet. Use the AI Subagent Assistant drawer to execute prompts.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950/60 text-slate-400 font-mono text-[11px]">
                <tr>
                  <th className="px-6 py-3">Prompt Type</th>
                  <th className="px-6 py-3">Model</th>
                  <th className="px-6 py-3">Tokens (In / Out)</th>
                  <th className="px-6 py-3">Latency</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-purple-300 font-medium">
                      {log.promptType}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-400 text-[11px]">
                      {log.model}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs">
                      <span className="text-cyan-400 font-semibold">{log.totalTokens}</span>{' '}
                      <span className="text-slate-500 text-[10px]">({log.promptTokens} / {log.completionTokens})</span>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-400">
                      {log.latencyMs}ms
                    </td>
                    <td className="px-6 py-3.5">
                      {log.status === 'SUCCESS' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                          <FiCheckCircle className="w-3 h-3" /> SUCCESS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-mono">
                          <FiAlertTriangle className="w-3 h-3" /> FAILED
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-[11px] text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1 || loading}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 hover:text-white disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs font-mono text-slate-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages || loading}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 hover:text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AILogsAdmin;
