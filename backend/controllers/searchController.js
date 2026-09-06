// backend/controllers/searchController.js
import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { Workspace } from '../models/Workspace.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Global search across tasks, projects, and people
// @route   GET /api/search
// @access  Private
export const globalSearch = asyncHandler(async (req, res) => {
  const { q, workspace } = req.query;

  if (!q || !q.trim()) {
    return res.status(200).json({
      success: true,
      data: {
        tasks: [],
        projects: [],
        people: [],
      },
    });
  }

  const queryRegex = new RegExp(q.trim(), 'i');

  // Find workspace tasks
  const taskQuery = {
    $or: [{ title: queryRegex }, { description: queryRegex }, { labels: queryRegex }],
  };
  if (workspace) taskQuery.workspace = workspace;

  const tasks = await Task.find(taskQuery)
    .populate('project', 'name color')
    .populate('assignee', 'name email avatar')
    .limit(10);

  // Find workspace projects
  const projectQuery = {
    $or: [{ name: queryRegex }, { description: queryRegex }],
  };
  if (workspace) projectQuery.workspace = workspace;

  const projects = await Project.find(projectQuery).limit(8);

  // Find people in workspace
  let people = [];
  if (workspace) {
    const ws = await Workspace.findById(workspace).populate('members.user', 'name email avatar');
    if (ws) {
      people = ws.members
        .map((m) => m.user)
        .filter((u) => u && (u.name.match(queryRegex) || u.email.match(queryRegex)));
    }
  } else {
    people = await User.find({
      $or: [{ name: queryRegex }, { email: queryRegex }],
    })
      .select('name email avatar')
      .limit(8);
  }

  return res.status(200).json({
    success: true,
    data: {
      tasks,
      projects,
      people,
    },
  });
});
