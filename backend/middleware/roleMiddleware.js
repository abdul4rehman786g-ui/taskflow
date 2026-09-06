// backend/middleware/roleMiddleware.js
import { Workspace } from '../models/Workspace.js';

// Verifies user is a member of the workspace
export const requireWorkspaceMember = async (req, res, next) => {
  try {
    const workspaceId = req.params.workspaceId || req.params.id || req.body.workspace || req.query.workspace;

    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: 'Workspace identifier is required',
      });
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
    }

    const isOwner = workspace.owner.toString() === req.user._id.toString();
    const memberRecord = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!isOwner && !memberRecord) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this workspace',
      });
    }

    req.workspace = workspace;
    req.userWorkspaceRole = isOwner ? 'OWNER' : memberRecord.role;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Workspace authorization error: ' + error.message,
    });
  }
};

// Verifies user has one of the allowed roles
export const requireRole = (allowedRoles = ['OWNER', 'ADMIN']) => {
  return (req, res, next) => {
    if (!req.userWorkspaceRole) {
      return res.status(403).json({
        success: false,
        message: 'Workspace role verification missing',
      });
    }

    if (!allowedRoles.includes(req.userWorkspaceRole)) {
      return res.status(403).json({
        success: false,
        message: `Action restricted. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.userWorkspaceRole}`,
      });
    }

    next();
  };
};
