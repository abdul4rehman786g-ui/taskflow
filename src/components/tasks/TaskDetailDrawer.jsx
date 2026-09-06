// src/components/tasks/TaskDetailDrawer.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  X,
  CheckCircle2,
  Circle,
  Calendar,
  User,
  Tag,
  MessageSquare,
  History,
  Trash2,
  Send,
  Plus,
  Clock,
  FolderKanban,
  Flag,
} from 'lucide-react';
import {
  closeTaskDrawer,
  fetchTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  toggleSubtask,
  addTaskComment,
  setComments,
} from '../../redux/slices/taskSlice.js';
import { taskService } from '../../services/taskService.js';
import { TASK_STATUSES, TASK_PRIORITIES } from '../../utils/constants.js';
import { formatDate, formatRelativeTime } from '../../utils/formatDate.js';
import { Avatar } from '../ui/Avatar.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.jsx';

export const TaskDetailDrawer = () => {
  const dispatch = useDispatch();
  const { isDrawerOpen, activeTaskId, currentTask, comments } = useSelector(
    (state) => state.task
  );
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const { user } = useSelector((state) => state.auth);

  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [activeTab, setActiveTab] = useState('comments'); // 'comments' | 'activity'
  const [taskActivity, setTaskActivity] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  // Load task and comments
  useEffect(() => {
    if (activeTaskId && isDrawerOpen) {
      dispatch(fetchTaskById(activeTaskId));
      taskService
        .getComments(activeTaskId)
        .then((res) => {
          if (res.success) {
            dispatch(setComments(res.data));
          }
        })
        .catch((err) => console.error(err));

      // Fetch task activity
      taskService
        .getTasks({ _id: activeTaskId })
        .then(() => {})
        .catch(() => {});
    }
  }, [activeTaskId, isDrawerOpen, dispatch]);

  useEffect(() => {
    if (currentTask) {
      setTitleInput(currentTask.title);
      setDescriptionInput(currentTask.description || '');
    }
  }, [currentTask]);

  if (!isDrawerOpen || !currentTask) return null;

  const handleStatusChange = (newStatus) => {
    dispatch(updateTaskStatus({ id: currentTask._id, status: newStatus }));
  };

  const handlePriorityChange = (newPriority) => {
    dispatch(updateTask({ id: currentTask._id, data: { priority: newPriority } }));
  };

  const handleSaveTitle = () => {
    if (titleInput.trim() && titleInput !== currentTask.title) {
      dispatch(updateTask({ id: currentTask._id, data: { title: titleInput.trim() } }));
    }
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    dispatch(updateTask({ id: currentTask._id, data: { description: descriptionInput.trim() } }));
    setIsEditingDesc(false);
  };

  const handleToggleSubtask = (subtaskId, completed) => {
    dispatch(
      toggleSubtask({
        taskId: currentTask._id,
        subtaskId,
        completed: !completed,
      })
    );
  };

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      const updatedSubtasks = [
        ...(currentTask.subtasks || []),
        { title: subtaskInput.trim(), completed: false },
      ];
      dispatch(
        updateTask({
          id: currentTask._id,
          data: { subtasks: updatedSubtasks },
        })
      );
      setSubtaskInput('');
      setIsAddingSubtask(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setIsSubmittingComment(true);
      await dispatch(
        addTaskComment({
          taskId: currentTask._id,
          content: commentText.trim(),
        })
      ).unwrap();
      setCommentText('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteTask = async () => {
    await dispatch(deleteTask(currentTask._id));
    setIsDeleteDialogOpen(false);
  };

  const completedSubtasks =
    currentTask.subtasks?.filter((s) => s.completed)?.length || 0;
  const totalSubtasks = currentTask.subtasks?.length || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => dispatch(closeTaskDrawer())}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-16">
        <div className="w-screen max-w-xl sm:max-w-2xl bg-white dark:bg-stone-900 shadow-2xl border-l border-stone-200 dark:border-stone-800 flex flex-col h-full overflow-hidden">
          {/* Drawer Header */}
          <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4 shrink-0 bg-stone-50/50 dark:bg-stone-900/50">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {/* Status Selector */}
              <select
                value={currentTask.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                  TASK_STATUSES[currentTask.status]?.badgeClass || 'bg-stone-100'
                }`}
              >
                {Object.values(TASK_STATUSES).map((st) => (
                  <option key={st.key} value={st.key}>
                    {st.label}
                  </option>
                ))}
              </select>

              {/* Priority Selector */}
              <select
                value={currentTask.priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                  TASK_PRIORITIES[currentTask.priority]?.badgeClass || 'bg-stone-100'
                }`}
              >
                {Object.values(TASK_PRIORITIES).map((pr) => (
                  <option key={pr.key} value={pr.key}>
                    {pr.label} Priority
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => dispatch(closeTaskDrawer())}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Title Section */}
            <div>
              {isEditingTitle ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                    className="w-full text-lg font-bold bg-stone-50 dark:bg-stone-800 p-2 rounded-xl border border-emerald-500 text-stone-900 dark:text-stone-100 focus:outline-none"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleSaveTitle}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setIsEditingTitle(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <h2
                  onClick={() => setIsEditingTitle(true)}
                  className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800/60 p-1.5 -ml-1.5 rounded-xl cursor-text transition-colors"
                >
                  {currentTask.title}
                </h2>
              )}
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-950/40 border border-stone-200/80 dark:border-stone-800/80 text-xs">
              {/* Project */}
              <div className="flex items-center gap-2.5">
                <FolderKanban className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="text-stone-400 font-medium">Project:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                  {currentTask.project?.name || 'Project'}
                </span>
              </div>

              {/* Assignee */}
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="text-stone-400 font-medium">Assignee:</span>
                {currentTask.assignee ? (
                  <div className="flex items-center gap-1.5 truncate">
                    <Avatar
                      name={currentTask.assignee.name}
                      src={currentTask.assignee.avatar}
                      size="xs"
                    />
                    <span className="font-medium text-stone-800 dark:text-stone-200 truncate">
                      {currentTask.assignee.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-stone-400 italic">Unassigned</span>
                )}
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="text-stone-400 font-medium">Due Date:</span>
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {currentTask.dueDate ? formatDate(currentTask.dueDate) : 'No deadline'}
                </span>
              </div>

              {/* Created */}
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="text-stone-400 font-medium">Created:</span>
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {formatRelativeTime(currentTask.createdAt)}
                </span>
              </div>
            </div>

            {/* Labels */}
            {currentTask.labels && currentTask.labels.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Labels</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentTask.labels.map((lbl) => (
                    <span
                      key={lbl}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                    >
                      {lbl}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Description
                </h4>
                {!isEditingDesc && (
                  <button
                    type="button"
                    onClick={() => setIsEditingDesc(true)}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditingDesc ? (
                <div className="space-y-2">
                  <textarea
                    rows={4}
                    value={descriptionInput}
                    onChange={(e) => setDescriptionInput(e.target.value)}
                    className="w-full text-sm rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 p-3 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleSaveDescription}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setIsEditingDesc(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingDesc(true)}
                  className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-sm text-stone-700 dark:text-stone-300 min-h-[70px] whitespace-pre-wrap cursor-text hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
                >
                  {currentTask.description || (
                    <span className="text-stone-400 italic">
                      Click to add task description or acceptance criteria...
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Subtasks Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    Checklist
                  </h4>
                  {totalSubtasks > 0 && (
                    <span className="text-xs font-medium text-stone-500">
                      ({completedSubtasks}/{totalSubtasks})
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingSubtask(true)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add item</span>
                </button>
              </div>

              {/* Subtask list */}
              <div className="space-y-1.5">
                {currentTask.subtasks?.map((st) => (
                  <div
                    key={st._id}
                    onClick={() => handleToggleSubtask(st._id, st.completed)}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer transition-colors group"
                  >
                    {st.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-stone-300 dark:text-stone-600 group-hover:text-emerald-500 shrink-0" />
                    )}
                    <span
                      className={`text-xs flex-1 transition-all ${
                        st.completed
                          ? 'line-through text-stone-400 dark:text-stone-500'
                          : 'text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      {st.title}
                    </span>
                  </div>
                ))}

                {isAddingSubtask && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Checklist item title..."
                      value={subtaskInput}
                      onChange={(e) => setSubtaskInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                      className="flex-1 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 px-3 py-1.5 text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
                      autoFocus
                    />
                    <Button size="sm" onClick={handleAddSubtask}>
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setIsAddingSubtask(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Comments & Activity Tabs */}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('comments')}
                  className={`text-xs font-semibold pb-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'comments'
                      ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Comments ({comments.length})</span>
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-xs text-stone-400 italic py-3 text-center">
                    No comments yet. Start the discussion below.
                  </p>
                ) : (
                  comments.map((c) => (
                    <div
                      key={c._id}
                      className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800/80"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Avatar
                            name={c.author?.name || 'User'}
                            src={c.author?.avatar}
                            size="xs"
                          />
                          <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                            {c.author?.name || 'Teammate'}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400">
                          {formatRelativeTime(c.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 dark:text-stone-300 whitespace-pre-wrap pl-7">
                        {c.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Drawer Footer: Add Comment Form */}
          <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shrink-0">
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <Avatar name={user?.name || 'Me'} src={user?.avatar} size="xs" />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment or update..."
                className="flex-1 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 px-3 py-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Button
                type="submit"
                size="sm"
                icon={Send}
                disabled={!commentText.trim() || isSubmittingComment}
                isLoading={isSubmittingComment}
              >
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task and all its comments?"
      />
    </div>
  );
};
