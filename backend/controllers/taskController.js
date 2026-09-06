// backend/controllers/taskController.js
import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { Comment } from '../models/Comment.js';
import { Activity } from '../models/Activity.js';
import { Notification } from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get all tasks with filtering, search, sorting
// @route   GET /api/tasks
// @access  Private
export const getTasks = asyncHandler(async (req, res) => {
  const { workspace, project, status, priority, assignee, search, dueSoon, myTasks } = req.query;

  const filter = {};

  if (workspace) filter.workspace = workspace;
  if (project) filter.project = project;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignee) filter.assignee = assignee;

  if (myTasks === 'true') {
    filter.assignee = req.user._id;
  }

  if (dueSoon === 'true') {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    filter.dueDate = { $gte: new Date(), $lte: nextWeek };
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { labels: { $regex: search, $options: 'i' } },
    ];
  }

  const tasks = await Task.find(filter)
    .populate('assignee', 'name email avatar')
    .populate('creator', 'name email avatar')
    .populate('project', 'name color icon')
    .sort({ order: 1, createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: tasks,
  });
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    project,
    workspace,
    assignee,
    status = 'TODO',
    priority = 'MEDIUM',
    labels = [],
    dueDate,
    subtasks = [],
  } = req.body;

  if (!title || !project || !workspace) {
    return res.status(400).json({
      success: false,
      message: 'Task title, project, and workspace are required',
    });
  }

  const projectDoc = await Project.findById(project);
  if (!projectDoc) {
    return res.status(404).json({
      success: false,
      message: 'Associated project not found',
    });
  }

  const task = await Task.create({
    title,
    description: description || '',
    project,
    workspace,
    creator: req.user._id,
    assignee: assignee || null,
    status,
    priority,
    labels,
    dueDate: dueDate || null,
    subtasks,
  });

  // Log activity
  await Activity.create({
    workspace,
    project,
    task: task._id,
    user: req.user._id,
    action: 'CREATED_TASK',
    metadata: {
      taskTitle: task.title,
      status: task.status,
      projectName: projectDoc.name,
    },
  });

  // Notify assignee if someone else assigned them
  if (assignee && assignee.toString() !== req.user._id.toString()) {
    await Notification.create({
      recipient: assignee,
      type: 'TASK_ASSIGNED',
      title: 'New Task Assigned',
      message: `${req.user.name} assigned you to "${task.title}" in ${projectDoc.name}`,
      relatedTask: task._id,
      relatedProject: project,
    });
  }

  const populated = await Task.findById(task._id)
    .populate('assignee', 'name email avatar')
    .populate('creator', 'name email avatar')
    .populate('project', 'name color icon');

  return res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: populated,
  });
});

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignee', 'name email avatar')
    .populate('creator', 'name email avatar')
    .populate('project', 'name color icon workspace')
    .populate('workspace', 'name');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  return res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  const previousAssignee = task.assignee?.toString();
  const previousStatus = task.status;

  const allowedUpdates = [
    'title',
    'description',
    'status',
    'priority',
    'assignee',
    'labels',
    'dueDate',
    'subtasks',
    'order',
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  });

  const updatedTask = await task.save();

  // Log status change if status changed
  if (req.body.status && req.body.status !== previousStatus) {
    await Activity.create({
      workspace: task.workspace,
      project: task.project,
      task: task._id,
      user: req.user._id,
      action: 'STATUS_CHANGED',
      metadata: {
        taskTitle: task.title,
        oldStatus: previousStatus,
        newStatus: task.status,
      },
    });
  } else {
    await Activity.create({
      workspace: task.workspace,
      project: task.project,
      task: task._id,
      user: req.user._id,
      action: 'UPDATED_TASK',
      metadata: { taskTitle: task.title },
    });
  }

  // If newly assigned to someone else
  if (
    task.assignee &&
    task.assignee.toString() !== previousAssignee &&
    task.assignee.toString() !== req.user._id.toString()
  ) {
    await Notification.create({
      recipient: task.assignee,
      type: 'TASK_ASSIGNED',
      title: 'Task Assigned to You',
      message: `${req.user.name} assigned you to task "${task.title}"`,
      relatedTask: task._id,
      relatedProject: task.project,
    });
  }

  const populated = await Task.findById(updatedTask._id)
    .populate('assignee', 'name email avatar')
    .populate('creator', 'name email avatar')
    .populate('project', 'name color icon');

  return res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: populated,
  });
});

// @desc    Quick status change (Kanban move)
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status, order } = req.body;

  if (!['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status provided',
    });
  }

  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  const oldStatus = task.status;
  task.status = status;
  if (order !== undefined) task.order = order;

  await task.save();

  // Log activity
  await Activity.create({
    workspace: task.workspace,
    project: task.project,
    task: task._id,
    user: req.user._id,
    action: status === 'COMPLETED' ? 'COMPLETED_TASK' : 'STATUS_CHANGED',
    metadata: {
      taskTitle: task.title,
      oldStatus,
      newStatus: status,
    },
  });

  const populated = await Task.findById(task._id)
    .populate('assignee', 'name email avatar')
    .populate('creator', 'name email avatar')
    .populate('project', 'name color icon');

  return res.status(200).json({
    success: true,
    message: `Task moved to ${status}`,
    data: populated,
  });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Delete comments related to this task
  await Comment.deleteMany({ task: task._id });

  // Delete activities related to this task
  await Activity.deleteMany({ task: task._id });

  await task.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Task and comments deleted successfully',
  });
});

// @desc    Toggle or update subtask
// @route   PATCH /api/tasks/:id/subtasks/:subtaskId
// @access  Private
export const toggleSubtask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  const subtask = task.subtasks.id(req.params.subtaskId);
  if (!subtask) {
    return res.status(404).json({
      success: false,
      message: 'Subtask not found',
    });
  }

  if (req.body.completed !== undefined) {
    subtask.completed = req.body.completed;
  }
  if (req.body.title) {
    subtask.title = req.body.title;
  }

  await task.save();

  return res.status(200).json({
    success: true,
    message: 'Subtask updated',
    data: task,
  });
});
