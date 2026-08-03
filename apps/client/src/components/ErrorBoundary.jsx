import React from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Unhandled React Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <FiAlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono">
                System Runtime Error
              </span>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Something Went Wrong
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected application rendering exception occurred. You can retry the action or return to the homepage.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-red-300 text-left overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-all shadow-lg shadow-purple-600/25"
              >
                <FiRefreshCw className="w-3.5 h-3.5" />
                <span>Retry Action</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
              >
                <FiHome className="w-3.5 h-3.5 text-cyan-400" />
                <span>Go Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
