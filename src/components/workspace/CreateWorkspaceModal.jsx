// src/components/workspace/CreateWorkspaceModal.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import { createWorkspace } from '../../redux/slices/workspaceSlice.js';

export const CreateWorkspaceModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Workspace name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await dispatch(
        createWorkspace({
          name: name.trim(),
          description: description.trim(),
        })
      ).unwrap();

      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err || 'Failed to create workspace');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Workspace" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-red-50 dark:bg-red-950/30 text-red-600 rounded-xl border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <Input
          label="Workspace Name"
          placeholder="e.g. Acme Product Org"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Textarea
          label="Description (Optional)"
          placeholder="What is the mission or focus of this workspace?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create Workspace
          </Button>
        </div>
      </form>
    </Modal>
  );
};
