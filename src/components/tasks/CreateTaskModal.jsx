// src/components/tasks/CreateTaskModal.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import { Select } from '../ui/Select.jsx';
import { createTask } from '../../redux/slices/taskSlice.js';
import { Plus, X } from 'lucide-react';

export const CreateTaskModal = ({ isOpen, onClose, defaultProjectId, defaultStatus }) => {
  const dispatch = useDispatch();
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const { projects } = useSelector((state) => state.project);
  const { user } = useSelector((state) => state.auth);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState('TODO');
  const [priority, setPriority] = useState('MEDIUM');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [labelInput, setLabelInput] = useState('');
  const [labels, setLabels] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Re-sync modal form state whenever opened
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      const safeProjId =
        typeof defaultProjectId === 'string' && defaultProjectId
          ? defaultProjectId
          : (projects[0]?._id || '');
      const safeSt =
        typeof defaultStatus === 'string' && defaultStatus
          ? defaultStatus
          : 'TODO';
      setProjectId(safeProjId);
      setStatus(safeSt);
      setPriority('MEDIUM');
      setAssigneeId('');
      setDueDate('');
      setLabelInput('');
      setLabels([]);
      setSubtaskInput('');
      setSubtasks([]);
      setError('');
    }
  }, [isOpen, defaultProjectId, defaultStatus, projects]);

  // Safely find and normalize members of current workspace
  const effectiveMembers = useMemo(() => {
    const rawMembers = currentWorkspace?.members || [];
    const list = [];
    const seen = new Set();
    for (const m of rawMembers) {
      if (!m) continue;
      const u = m.user && typeof m.user === 'object' ? m.user : m;
      const id = typeof u === 'object' ? (u._id || u.id) : u;
      if (!id || seen.has(String(id))) continue;
      seen.add(String(id));
      const name =
        typeof u === 'object' ? (u.name || u.email || 'Member') : 'Member';
      list.push({ _id: String(id), name });
    }
    if (list.length === 0 && user?._id) {
      list.push({ _id: String(user._id), name: user.name || 'Current User' });
    }
    return list;
  }, [currentWorkspace, user]);

  const handleAddLabel = () => {
    if (labelInput.trim() && !labels.includes(labelInput.trim())) {
      setLabels([...labels, labelInput.trim()]);
      setLabelInput('');
    }
  };

  const handleRemoveLabel = (lbl) => {
    setLabels(labels.filter((l) => l !== lbl));
  };

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      setSubtasks([...subtasks, { title: subtaskInput.trim(), completed: false }]);
      setSubtaskInput('');
    }
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    if (!projectId) {
      setError('Please select a project');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await dispatch(
        createTask({
          title: title.trim(),
          description: description.trim(),
          project: projectId,
          workspace: currentWorkspace?._id,
          status,
          priority,
          assignee: assigneeId || null,
          dueDate: dueDate || null,
          labels,
          subtasks,
        })
      ).unwrap();

      // Reset form
      setTitle('');
      setDescription('');
      setLabels([]);
      setSubtasks([]);
      onClose();
    } catch (err) {
      setError(err || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-red-50 dark:bg-red-950/30 text-red-600 rounded-xl border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <Input
          label="Task Title"
          placeholder="e.g. Implement user authentication flow"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            options={projects.map((p) => ({ label: p.name, value: p._id }))}
            required
          />

          <Select
            label="Assignee"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            placeholder="Unassigned"
            options={effectiveMembers.map((m) => ({ label: m.name, value: m._id }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { label: 'To Do', value: 'TODO' },
              { label: 'In Progress', value: 'IN_PROGRESS' },
              { label: 'Under Review', value: 'REVIEW' },
              { label: 'Completed', value: 'COMPLETED' },
            ]}
          />

          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={[
              { label: 'Low', value: 'LOW' },
              { label: 'Medium', value: 'MEDIUM' },
              { label: 'High', value: 'HIGH' },
              { label: 'Urgent', value: 'URGENT' },
            ]}
          />

          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <Textarea
          label="Description"
          placeholder="Add context, acceptance criteria, or links..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        {/* Labels */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 uppercase tracking-wider">
            Labels
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add label (e.g. Frontend, Bug, Design)..."
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddLabel();
                }
              }}
              className="flex-1 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-3 py-1.5 text-xs text-stone-900 dark:text-stone-100"
            />
            <Button size="sm" variant="secondary" onClick={handleAddLabel}>
              Add
            </Button>
          </div>
          {labels.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {labels.map((lbl) => (
                <span
                  key={lbl}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                >
                  {lbl}
                  <button
                    type="button"
                    onClick={() => handleRemoveLabel(lbl)}
                    className="hover:text-red-500 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Subtasks */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 uppercase tracking-wider">
            Checklist / Subtasks
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add checklist item..."
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
              className="flex-1 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-3 py-1.5 text-xs text-stone-900 dark:text-stone-100"
            />
            <Button size="sm" variant="secondary" onClick={handleAddSubtask}>
              Add
            </Button>
          </div>
          {subtasks.length > 0 && (
            <div className="space-y-1.5 mt-2">
              {subtasks.map((st, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-800/40 text-xs text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800"
                >
                  <span>{st.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(i)}
                    className="text-stone-400 hover:text-red-500 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};
