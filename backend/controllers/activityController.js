// backend/controllers/activityController.js
import { Activity } from '../models/Activity.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get activity for a project or workspace
// @route   GET /api/activity or /api/projects/:projectId/activity
// @access  Private
export const getActivity = asyncHandler(async (req, res) => {
  const { projectId, workspaceId } = req.params;
  const { workspace, limit = 50 } = req.query;

  const query = {};

  if (projectId) {
    query.project = projectId;
  }
  if (workspaceId || workspace) {
    query.workspace = workspaceId || workspace;
  }

  const activities = await Activity.find(query)
    .populate('user', 'name email avatar')
    .populate('project', 'name color')
    .populate('task', 'title status priority')
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  return res.status(200).json({
    success: true,
    data: activities,
  });
});
