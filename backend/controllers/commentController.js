// backend/controllers/commentController.js
import { Comment } from '../models/Comment.js';
import { Task } from '../models/Task.js';
import { Activity } from '../models/Activity.js';
import { Notification } from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get comments for a task
// @route   GET /api/tasks/:taskId/comments
// @access  Private
export const getTaskComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ task: req.params.taskId })
    .populate('author', 'name email avatar')
    .sort({ createdAt: 1 });

  return res.status(200).json({
    success: true,
    data: comments,
  });
});

// @desc    Add comment to a task
// @route   POST /api/tasks/:taskId/comments
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { taskId } = req.params;

  if (!content || !content.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Comment content cannot be empty',
    });
  }

  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  const comment = await Comment.create({
    task: taskId,
    author: req.user._id,
    content: content.trim(),
  });

  // Record activity
  await Activity.create({
    workspace: task.workspace,
    project: task.project,
    task: task._id,
    user: req.user._id,
    action: 'ADDED_COMMENT',
    metadata: {
      taskTitle: task.title,
      commentSnippet: content.slice(0, 80),
    },
  });

  // Notify assignee if not the author
  if (task.assignee && task.assignee.toString() !== req.user._id.toString()) {
    await Notification.create({
      recipient: task.assignee,
      type: 'COMMENT_ADDED',
      title: 'New Comment on Task',
      message: `${req.user.name} commented on "${task.title}"`,
      relatedTask: task._id,
      relatedProject: task.project,
    });
  }

  const populated = await Comment.findById(comment._id).populate(
    'author',
    'name email avatar'
  );

  return res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    data: populated,
  });
});

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found',
    });
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'You can only edit your own comments',
    });
  }

  comment.content = content.trim();
  await comment.save();

  const populated = await Comment.findById(comment._id).populate(
    'author',
    'name email avatar'
  );

  return res.status(200).json({
    success: true,
    message: 'Comment updated successfully',
    data: populated,
  });
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found',
    });
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'You can only delete your own comments',
    });
  }

  await comment.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Comment deleted successfully',
  });
});
