import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchContactMessages,
  updateContactStatus,
  deleteContact,
} from '../../api/contact.api.js';
import { ConfirmDeleteModal } from '../../components/admin/ConfirmDeleteModal.jsx';
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from '../../components/States.jsx';
import {
  FiMail,
  FiSearch,
  FiEye,
  FiCheckCircle,
  FiTrash2,
  FiX,
  FiUser,
  FiCalendar,
  FiTag,
  FiClock,
} from 'react-icons/fi';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function ContactAdmin() {
  const queryClient = useQueryClient();

  const [activeStatus, setActiveStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    data: messages,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['contacts', { status: activeStatus === 'all' ? undefined : activeStatus, search: searchQuery }],
    queryFn: () =>
      fetchContactMessages({
        status: activeStatus === 'all' ? undefined : activeStatus,
        search: searchQuery.trim() || undefined,
      }),
  });

  const statusMutation = useMutation({
    mutationFn: updateContactStatus,
    onSuccess: (updatedContact) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      if (selectedMessage && selectedMessage.id === updatedContact.id) {
        setSelectedMessage(updatedContact);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setDeleteTarget(null);
      if (selectedMessage && selectedMessage.id === deleteTarget?.id) {
        setSelectedMessage(null);
      }
    },
  });

  const handleOpenMessage = (msg) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      statusMutation.mutate({ id: msg.id, status: 'read' });
    }
  };

  const handleMarkAsReplied = (msg, e) => {
    if (e) e.stopPropagation();
    statusMutation.mutate({ id: msg.id, status: 'replied' });
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'unread':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Unread
          </span>
        );
      case 'read':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
            Read
          </span>
        );
      case 'replied':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
            Replied
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
            <FiMail className="w-3.5 h-3.5" />
            Contact Submissions
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Messages CMS Inbox
          </h1>
        </div>
      </div>

      {/* Toolbar: Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#1e293b]/60 p-1 rounded-xl border border-slate-800">
          {['all', 'unread', 'read', 'replied'].map((statusTab) => (
            <button
              key={statusTab}
              onClick={() => setActiveStatus(statusTab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                activeStatus === statusTab
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {statusTab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <FiSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, subject or message..."
            className="w-full bg-[#1e293b]/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && <LoadingSpinner text="Loading inbox messages..." />}

      {/* Error */}
      {isError && (
        <ErrorMessage
          title="Failed to load inbox messages"
          message={error?.message}
          onRetry={refetch}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && (!messages || messages.length === 0) && (
        <EmptyState
          title="No messages found"
          message="No contact form inquiries match the selected status filter or search criteria."
        />
      )}

      {/* Messages Table */}
      {!isLoading && !isError && messages && messages.length > 0 && (
        <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Sender</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4">Received Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60 text-xs">
                {messages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
                        {msg.name}
                      </div>
                      <div className="text-[10px] font-mono text-cyan-400">
                        {msg.email}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate">
                      <span className="text-slate-200 font-medium">{msg.subject}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(msg.status)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {formatDate(msg.createdAt)}
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenMessage(msg)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Read Message"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                        </button>

                        {msg.status !== 'replied' && (
                          <button
                            onClick={(e) => handleMarkAsReplied(msg, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/20 transition-colors"
                            title="Mark as Replied"
                          >
                            <FiCheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(msg);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                          title="Delete Message"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#1e293b] p-6 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-mono">
                  <FiMail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Inquiry Details</h3>
                  <div className="text-[10px] font-mono text-slate-400">
                    ID: {selectedMessage.id}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Sender Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                  <FiUser className="w-3.5 h-3.5 text-purple-400" />
                  <span>Sender Name:</span>
                </div>
                <div className="font-semibold text-slate-100 pl-5">
                  {selectedMessage.name}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                  <FiMail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Email Address:</span>
                </div>
                <div className="font-semibold text-cyan-400 pl-5">
                  <a href={`mailto:${selectedMessage.email}`} className="hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                  <FiCalendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Received On:</span>
                </div>
                <div className="font-mono text-slate-300 pl-5">
                  {formatDate(selectedMessage.createdAt)}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                  <FiClock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Status:</span>
                </div>
                <div className="pl-5">{getStatusBadge(selectedMessage.status)}</div>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 uppercase tracking-wider">
                <FiTag className="w-3.5 h-3.5 text-purple-400" />
                <span>Subject</span>
              </div>
              <h4 className="text-sm font-bold text-white bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                {selectedMessage.subject}
              </h4>
            </div>

            {/* Message Body */}
            <div className="space-y-1">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Message Body
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto font-sans">
                {selectedMessage.message}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                {selectedMessage.status !== 'replied' && (
                  <button
                    onClick={() => handleMarkAsReplied(selectedMessage)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 text-xs font-medium transition-colors"
                  >
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    <span>Mark as Replied</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-800/80 text-xs font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title={`Delete message from "${deleteTarget?.name}"?`}
        message="This action will soft-delete the message from the CMS inbox."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}

export default ContactAdmin;
