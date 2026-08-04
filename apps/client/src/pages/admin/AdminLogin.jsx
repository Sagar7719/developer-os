import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { PageMetadata } from '../../components/PageMetadata.jsx';
import { FiLock, FiMail, FiShield, FiAlertCircle } from 'react-icons/fi';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get('expired') === 'true' || queryParams.get('expired') === '1';

  const [errorMsg, setErrorMsg] = useState(
    isExpired ? 'Session expired. Please sign in again.' : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Invalid credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <PageMetadata title="Admin CMS Portal" noindex={true} />
      <div className="w-full max-w-md bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl shadow-purple-500/5">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
            <FiShield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin CMS Portal</h1>
          <p className="text-xs text-slate-400 font-mono">Developer OS Identity Authorization</p>
        </div>

        {errorMsg && (
          <div className="bg-red-950/40 border border-red-900/60 rounded-xl p-3.5 flex items-center gap-3 text-xs text-red-200">
            <FiAlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Email Address</label>
            <div className="relative">
              <FiMail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sagar.dev"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/80 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Password</label>
            <div className="relative">
              <FiLock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/80 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-all shadow-lg shadow-purple-600/25 disabled:opacity-50 mt-2"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In to Admin CMS'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
