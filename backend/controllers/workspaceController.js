// backend/controllers/workspaceController.js
import { Workspace } from '../models/Workspace.js';
import { User } from '../models/User.js';
import { Activity } from '../models/Activity.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get all workspaces for logged-in user
// @route   GET /api/workspaces
// @access  Private
export const getWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await Workspace.find({
    $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
  })
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: workspaces,
  });
});

// @desc    Create a new workspace
// @route   POST /api/workspaces
// @access  Private
export const createWorkspace = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Workspace name is required',
    });
  }

  const workspace = await Workspace.create({
    name,
    description: description || '',
    owner: req.user._id,
    members: [
      {
        user: req.user._id,
        role: 'OWNER',
        joinedAt: new Date(),
      },
    ],
  });

  // Add workspace to user's workspace list
  await User.findByIdAndUpdate(req.user._id, {
    $push: { workspaces: workspace._id },
  });

  // Record activity
  await Activity.create({
    workspace: workspace._id,
    user: req.user._id,
    action: 'CREATED_WORKSPACE',
    metadata: { workspaceName: workspace.name },
  });

  const populatedWorkspace = await Workspace.findById(workspace._id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');

  return res.status(201).json({
    success: true,
    message: 'Workspace created successfully',
    data: populatedWorkspace,
  });
});

// @desc    Get workspace by ID
// @route   GET /api/workspaces/:id
// @access  Private
export const getWorkspaceById = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .populate({
      path: 'projects',
      populate: {
        path: 'owner members',
        select: 'name email avatar',
      },
    });

  if (!workspace) {
    return res.status(404).json({
      success: false,
      message: 'Workspace not found',
    });
  }

  // Check if current user is member or owner
  const isOwner = workspace.owner._id.toString() === req.user._id.toString();
  const isMember = workspace.members.some(
    (m) => m.user && m.user._id.toString() === req.user._id.toString()
  );

  if (!isOwner && !isMember) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to this workspace',
    });
  }

  return res.status(200).json({
    success: true,
    data: workspace,
  });
});

// @desc    Update workspace
// @route   PUT /api/workspaces/:id
// @access  Private (Owner/Admin)
export const updateWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);

  if (!workspace) {
    return res.status(404).json({
      success: false,
      message: 'Workspace not found',
    });
  }

  const isOwner = workspace.owner.toString() === req.user._id.toString();
  const member = workspace.members.find(
    (m) => m.user.toString() === req.user._id.toString()
  );
  const isAdmin = member && (member.role === 'ADMIN' || member.role === 'OWNER');

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Only workspace owners and administrators can update workspace settings',
    });
  }

  if (req.body.name) workspace.name = req.body.name;
  if (req.body.description !== undefined) workspace.description = req.body.description;

  const updatedWorkspace = await workspace.save();
  const populated = await Workspace.findById(updatedWorkspace._id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');

  return res.status(200).json({
    success: true,
    message: 'Workspace updated successfully',
    data: populated,
  });
});

// @desc    Delete workspace
// @route   DELETE /api/workspaces/:id
// @access  Private (Owner only)
export const deleteWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);

  if (!workspace) {
    return res.status(404).json({
      success: false,
      message: 'Workspace not found',
    });
  }

  if (workspace.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Only the workspace owner can delete this workspace',
    });
  }

  await workspace.deleteOne();

  // Remove workspace reference from users
  await User.updateMany(
    { workspaces: req.params.id },
    { $pull: { workspaces: req.params.id } }
  );

  return res.status(200).json({
    success: true,
    message: 'Workspace deleted successfully',
  });
});

// @desc    Add member to workspace
// @route   POST /api/workspaces/:id/members
// @access  Private (Owner/Admin)
export const addWorkspaceMember = asyncHandler(async (req, res) => {
  const { email, role = 'MEMBER' } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Member email address is required',
    });
  }

  const workspace = await Workspace.findById(req.params.id);
  if (!workspace) {
    return res.status(404).json({
      success: false,
      message: 'Workspace not found',
    });
  }

  // Find user by email, or create a demo user entry if registering teammate
  let targetUser = await User.findOne({ email: email.toLowerCase() });
  if (!targetUser) {
    // Automatically create a placeholder user account for the invited teammate
    const namePart = email.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    targetUser = await User.create({
      name: formattedName,
      email: email.toLowerCase(),
      password: 'TemporaryPassword123!',
      role: 'member',
    });
  }

  // Check if user is already a member
  const alreadyMember = workspace.members.some(
    (m) => m.user.toString() === targetUser._id.toString()
  );

  if (alreadyMember) {
    return res.status(400).json({
      success: false,
      message: 'This user is already a member of this workspace',
    });
  }

  workspace.members.push({
    user: targetUser._id,
    role: role.toUpperCase(),
    joinedAt: new Date(),
  });

  await workspace.save();

  if (!targetUser.workspaces.includes(workspace._id)) {
    targetUser.workspaces.push(workspace._id);
    await targetUser.save();
  }

  await Activity.create({
    workspace: workspace._id,
    user: req.user._id,
    action: 'ADDED_MEMBER',
    metadata: {
      memberName: targetUser.name,
      memberEmail: targetUser.email,
      role: role.toUpperCase(),
    },
  });

  const updatedWorkspace = await Workspace.findById(workspace._id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');

  return res.status(200).json({
    success: true,
    message: `${targetUser.name} added to workspace as ${role}`,
    data: updatedWorkspace,
  });
});

// @desc    Update workspace member role
// @route   PATCH /api/workspaces/:workspaceId/members/:memberId
// @access  Private (Owner/Admin)
export const updateMemberRole = asyncHandler(async (req, res) => {
  const { workspaceId, memberId } = req.params;
  const { role } = req.body;

  if (!['ADMIN', 'MEMBER', 'VIEWER'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role specified. Must be ADMIN, MEMBER, or VIEWER',
    });
  }

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    return res.status(404).json({
      success: false,
      message: 'Workspace not found',
    });
  }

  const member = workspace.members.find(
    (m) => m.user.toString() === memberId || m._id.toString() === memberId
  );

  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Member not found in this workspace',
    });
  }

  member.role = role;
  await workspace.save();

  return res.status(200).json({
    success: true,
    message: 'Member role updated successfully',
    data: workspace,
  });
});

// @desc    Remove member from workspace
// @route   DELETE /api/workspaces/:workspaceId/members/:memberId
// @access  Private (Owner/Admin)
export const removeWorkspaceMember = asyncHandler(async (req, res) => {
  const { workspaceId, memberId } = req.params;

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    return res.status(404).json({
      success: false,
      message: 'Workspace not found',
    });
  }

  const isOwner = workspace.owner.toString() === req.user._id.toString();
  const requester = workspace.members.find(
    (m) => m.user.toString() === req.user._id.toString()
  );
  const isAdmin = requester && (requester.role === 'ADMIN' || requester.role === 'OWNER');

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Only workspace owners and administrators can remove members',
    });
  }

  const memberToRemove = workspace.members.find(
    (m) => m.user.toString() === memberId || m._id.toString() === memberId
  );

  if (!memberToRemove) {
    return res.status(404).json({
      success: false,
      message: 'Member not found in this workspace',
    });
  }

  if (memberToRemove.user.toString() === workspace.owner.toString()) {
    return res.status(400).json({
      success: false,
      message: 'The workspace owner cannot be removed',
    });
  }

  workspace.members = workspace.members.filter(
    (m) => m.user.toString() !== memberToRemove.user.toString()
  );
  await workspace.save();

  await User.findByIdAndUpdate(memberToRemove.user, {
    $pull: { workspaces: workspace._id },
  });

  await Activity.create({
    workspace: workspace._id,
    user: req.user._id,
    action: 'REMOVED_MEMBER',
    metadata: { removedUserId: memberToRemove.user },
  });

  const updatedWorkspace = await Workspace.findById(workspace._id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');

  return res.status(200).json({
    success: true,
    message: 'Member removed successfully',
    data: updatedWorkspace,
  });
});
