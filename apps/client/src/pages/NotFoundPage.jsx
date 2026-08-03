import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageMetadata } from '../components/PageMetadata.jsx';
import { FiAlertCircle, FiHome, FiArrowLeft } from 'react-icons/fi';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <PageMetadata title="Page Not Found" noindex={true} />
      <div className="max-w-md w-full bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
          <FiAlertCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Error 404</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Developer OS</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            404 Page Not Found
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            The requested page or route does not exist or has been relocated within the platform ecosystem.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-all shadow-lg shadow-purple-600/25"
          >
            <FiHome className="w-3.5 h-3.5" />
            <span>Back Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
