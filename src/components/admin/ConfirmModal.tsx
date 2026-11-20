'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-5 text-left animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-2xl flex items-center justify-center ${
              isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'
            }`}
          >
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-text-primary tracking-tight leading-none">{title}</h3>
            <span className="text-xs text-text-muted mt-1 block">Please confirm this action</span>
          </div>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
          >
            {cancelLabel}
          </button>
          <Button
            variant={isDestructive ? 'primary' : 'gradient'}
            size="sm"
            isLoading={isLoading}
            onClick={onConfirm}
            className={isDestructive ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
