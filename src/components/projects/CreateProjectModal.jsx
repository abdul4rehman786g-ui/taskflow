// src/components/projects/CreateProjectModal.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import { Select } from '../ui/Select.jsx';
import { createProject } from '../../redux/slices/projectSlice.js';

const PROJECT_COLORS = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#06b6d4', // cyan
];

export const CreateProjectModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { currentWorkspace } = useSelector((state) => state.workspace);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PROJECT_COLORS[0]);
  const [status, setStatus] = useState('ACTIVE');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    if (!currentWorkspace?._id) {
      setError('Please select an active workspace first');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await dispatch(
        createProject({
          name: name.trim(),
          description: description.trim(),
          workspace: currentWorkspace._id,
          color,
          status,
          startDate: startDate || null,
          dueDate: dueDate || null,
        })
      ).unwrap();

      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-red-50 dark:bg-red-950/30 text-red-600 rounded-xl border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <Input
          label="Project Name"
          placeholder="e.g. Mobile App Redesign (v3.0)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Textarea
          label="Description"
          placeholder="Provide goals, scope, and key deliverables..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Input
            label="Target Deadline"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <Select
          label="Initial Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Planning', value: 'PLANNING' },
            { label: 'On Hold', value: 'ON_HOLD' },
          ]}
        />

        {/* Color Picker */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wider">
            Color Identifier
          </label>
          <div className="flex items-center gap-2.5">
            {PROJECT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                  color === c ? 'scale-115 ring-2 ring-stone-900 dark:ring-white ring-offset-2 dark:ring-offset-stone-900' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};
