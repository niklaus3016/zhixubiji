import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  // Extra options (e.g. for Book deletion)
  extraOptionLabel?: string;
  onExtraOptionConfirm?: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = '确定',
  cancelLabel = '取消',
  isDanger = false,
  onConfirm,
  onCancel,
  extraOptionLabel,
  onExtraOptionConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="m-auto bg-slate-900/95 text-slate-100 backdrop-blur-2xl rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-white/15">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 text-white font-semibold text-lg">
            {isDanger && (
              <div className="p-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            <h3>{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-3 text-slate-300 text-sm leading-relaxed">{message}</p>

        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-white/10 hover:bg-white/15 rounded-xl transition"
          >
            {cancelLabel}
          </button>

          {extraOptionLabel && onExtraOptionConfirm && (
            <button
              type="button"
              onClick={onExtraOptionConfirm}
              className="px-4 py-2 text-sm font-medium text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl transition"
            >
              {extraOptionLabel}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition ${
              isDanger
                ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
