// src/components/ui/ConfirmDialog.jsx
import React from 'react';
import { Modal } from './Modal.jsx';
import { Button } from './Button.jsx';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isDestructive
              ? 'bg-red-100 dark:bg-red-950/60 text-red-600'
              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-semibold text-stone-900 dark:text-stone-100 mb-1">
            {title}
          </h4>
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
            {message}
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              variant={isDestructive ? 'danger' : 'primary'}
              size="sm"
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
