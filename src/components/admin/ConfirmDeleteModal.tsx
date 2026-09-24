import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  itemName,
  message = 'Are you sure you really want to delete this item? This action will permanently remove it from the tournament records.',
  confirmButtonText = 'Yes, Delete',
  cancelButtonText = 'No, Cancel'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-rose-50 border-b border-rose-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">{title}</h3>
              <p className="text-[11px] text-rose-700 font-medium">Permanent Action Warning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {itemName && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-0.5">
                Target Item
              </span>
              <strong className="text-slate-900 font-bold">{itemName}</strong>
            </div>
          )}

          <p className="text-xs text-slate-600 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions (Yes or No) */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-lg transition cursor-pointer"
          >
            {cancelButtonText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmButtonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
