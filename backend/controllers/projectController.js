// backend/controllers/projectController.js
import { Project } from '../models/Project.js';
import { Workspace } from '../models/Workspace.js';
import { Task } from '../models/Task.js';
import { Activity } from '../models/Activity.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get all projects for a workspace
// @route   GET /api/projects
// @access  Private
export const getProjects = asyncHandler(async (req, res) => {
  const { workspace, status } = req.query;

  const query = {};
  if (workspace) {
    query.workspace = workspace;
  } else {
    // Return all projects from user's workspaces
    const userWorkspaces = await Workspace.find({
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
    }).select('_id');
    query.workspace = { $in: userWorkspaces.map((w) => w._id) };
  }

  if (status) {
    query.status = status.toUpperCase();
  }

  const projects = await Project.find(query)
    .populate('owner', 'name email avatar')
    .populate('members', 'name email avatar')
    .sort({ updatedAt: -1 });

  // Enrich with task counts (total, completed)
  const enrichedProjects = await Promise.all(
    projects.map(async (project) => {
      const totalTasks = await Task.countDocuments({ project: project._id });
      const completedTasks = await Task.countDocuments({
        project: project._id,
        status: 'COMPLETED',
      });
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        ...project.toObject(),
        totalTasks,
        completedTasks,
        progress,
      };
    })
  );

  return res.status(200).json({
    success: true,
    data: enrichedProjects,
  });
});

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = asyncHandler(async (req, res) => {
  const { name, description, workspace, color, icon, startDate, dueDate, members } = req.body;

  if (!name || !workspace) {
    return res.status(400).json({
      success: false,
      message: 'Project name and workspace ID are required',
    });
  }

  // Ensure workspace exists
  const workspaceDoc = await Workspace.findById(workspace);
  if (!workspaceDoc) {
    return res.status(404).json({
      success: false,
      message: 'Associated workspace does not exist',
    });
  }

  const initialMembers = Array.isArray(members) && members.length > 0 ? members : [req.user._id];

  const project = await Project.create({
    name,
    description: description || '',
    workspace,
    owner: req.user._id,
    members: initialMembers,
    color: color || '#10b981',
    icon: icon || 'folder',
    startDate: startDate || null,
    dueDate: dueDate || null,
  });

  // Add project to workspace.projects
  await Workspace.findByIdAndUpdate(workspace, {
    $push: { projects: project._id },
  });

  // Log activity
  await Activity.create({
    workspace,
    project: project._id,
    user: req.user._id,
    action: 'CREATED_PROJECT',
    metadata: { projectName: project.name },
  });

  const populated = await Project.findById(project._id)
    .populate('owner', 'name email avatar')
    .populate('members', 'name email avatar');

  return res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: {
      ...populated.toObject(),
      totalTasks: 0,
      completedTasks: 0,
      progress: 0,
    },
  });
});

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email avatar')
    .populate('members', 'name email avatar')
    .populate('workspace', 'name owner members');

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  const totalTasks = await Task.countDocuments({ project: project._id });
  const completedTasks = await Task.countDocuments({
    project: project._id,
    status: 'COMPLETED',
  });
  const inProgressTasks = await Task.countDocuments({
    project: project._id,
    status: 'IN_PROGRESS',
  });
  const todoTasks = await Task.countDocuments({
    project: project._id,
    status: 'TODO',
  });
  const reviewTasks = await Task.countDocuments({
    project: project._id,
    status: 'REVIEW',
  });

  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return res.status(200).json({
    success: true,
    data: {
      ...project.toObject(),
      stats: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        todo: todoTasks,
        review: reviewTasks,
        progress,
      },
    },
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  const allowedUpdates = ['name', 'description', 'status', 'color', 'icon', 'startDate', 'dueDate', 'members'];
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      project[field] = req.body[field];
    }
  });

  const updatedProject = await project.save();

  await Activity.create({
    workspace: project.workspace,
    project: project._id,
    user: req.user._id,
    action: 'UPDATED_PROJECT',
    metadata: { projectName: project.name },
  });

  const populated = await Project.findById(updatedProject._id)
    .populate('owner', 'name email avatar')
    .populate('members', 'name email avatar');

  return res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    data: populated,
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  // Delete all tasks under this project
  await Task.deleteMany({ project: project._id });

  // Remove project from workspace
  await Workspace.findByIdAndUpdate(project.workspace, {
    $pull: { projects: project._id },
  });

  await project.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Project and its tasks deleted successfully',
  });
});
