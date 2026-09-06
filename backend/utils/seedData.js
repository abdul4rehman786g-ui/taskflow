// backend/utils/seedData.js
import { User } from '../models/User.js';
import { Workspace } from '../models/Workspace.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { Comment } from '../models/Comment.js';
import { Activity } from '../models/Activity.js';
import { Notification } from '../models/Notification.js';

export const seedDemoData = async (user) => {
  // Check if user already has demo data in their primary workspace
  let workspace = await Workspace.findOne({ owner: user._id });

  if (!workspace) {
    workspace = await Workspace.create({
      name: `${user.name.split(' ')[0]}'s Workspace`,
      description: 'Primary team workspace for tasks, projects, and sprint goals.',
      owner: user._id,
      members: [
        {
          user: user._id,
          role: 'OWNER',
          joinedAt: new Date(),
        },
      ],
    });

    await User.findByIdAndUpdate(user._id, {
      $addToSet: { workspaces: workspace._id },
    });
  }

  // Create demo teammates if they don't exist
  const teammatesData = [
    {
      name: 'Sarah Chen',
      email: 'sarah@taskflow.dev',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      name: 'Marcus Vance',
      email: 'marcus.vance@taskflow.internal',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      name: 'Elena Rostova',
      email: 'elena.rostova@taskflow.internal',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  ];

  const teammateUsers = [];
  for (const t of teammatesData) {
    let teammate = await User.findOne({ email: t.email });
    if (!teammate) {
      teammate = await User.create(t);
    }
    teammateUsers.push(teammate);

    // Add to workspace members if not present
    const isMember = workspace.members.some(
      (m) => m.user.toString() === teammate._id.toString()
    );
    if (!isMember) {
      workspace.members.push({
        user: teammate._id,
        role: 'MEMBER',
        joinedAt: new Date(),
      });
      await teammate.updateOne({ $addToSet: { workspaces: workspace._id } });
    }
  }

  await workspace.save();

  // Create demo projects if not existing
  const existingProjects = await Project.find({ workspace: workspace._id });
  let project1, project2, project3;

  if (existingProjects.length === 0) {
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);

    const nextTwoWeeks = new Date();
    nextTwoWeeks.setDate(nextTwoWeeks.getDate() + 14);

    project1 = await Project.create({
      name: 'Mobile App Redesign (v3.0)',
      description: 'Complete visual and architectural overhaul of the mobile native experience.',
      workspace: workspace._id,
      owner: user._id,
      members: [user._id, teammateUsers[0]._id, teammateUsers[1]._id],
      status: 'ACTIVE',
      color: '#10b981', // emerald
      icon: 'smartphone',
      startDate: new Date(),
      dueDate: nextMonth,
    });

    project2 = await Project.create({
      name: 'Core API Optimization',
      description: 'Micro-caching, MongoDB indexing, and GraphQL/REST response latency tuning.',
      workspace: workspace._id,
      owner: user._id,
      members: [user._id, teammateUsers[1]._id],
      status: 'ACTIVE',
      color: '#3b82f6', // blue
      icon: 'server',
      startDate: new Date(),
      dueDate: nextTwoWeeks,
    });

    project3 = await Project.create({
      name: 'Brand & Marketing Strategy',
      description: 'Q3 product hunt launch, developer documentation portal, and community roadmap.',
      workspace: workspace._id,
      owner: user._id,
      members: [user._id, teammateUsers[2]._id],
      status: 'PLANNING',
      color: '#8b5cf6', // purple
      icon: 'sparkles',
      startDate: new Date(),
      dueDate: nextMonth,
    });

    workspace.projects.push(project1._id, project2._id, project3._id);
    await workspace.save();

    // Create realistic tasks across statuses
    const sampleTasks = [
      {
        title: 'Design tokenized design system in Figma',
        description: 'Define semantic color ramps, typographic scales, card radiuses, and elevation tokens matching SaaS guidelines.',
        project: project1._id,
        workspace: workspace._id,
        creator: user._id,
        assignee: teammateUsers[0]._id,
        status: 'COMPLETED',
        priority: 'HIGH',
        labels: ['Design', 'UI/UX'],
        dueDate: new Date(Date.now() - 2 * 86400000),
        subtasks: [
          { title: 'Color tokens palette', completed: true },
          { title: 'Typography system', completed: true },
          { title: 'Icon set export', completed: true },
        ],
      },
      {
        title: 'Build interactive Kanban board with drag-and-drop',
        description: 'Provide columns for Todo, In Progress, Review, and Completed with smooth animations and optimistic state updates.',
        project: project1._id,
        workspace: workspace._id,
        creator: user._id,
        assignee: user._id,
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        labels: ['Frontend', 'React', 'Feature'],
        dueDate: new Date(Date.now() + 3 * 86400000),
        subtasks: [
          { title: 'Layout columns', completed: true },
          { title: 'Task card component', completed: true },
          { title: 'Backend status sync', completed: false },
        ],
      },
      {
        title: 'Implement JWT authentication with HTTP-only cookies',
        description: 'Secure token issuance, cookie parser setup, authorization middleware, and protected API routes.',
        project: project1._id,
        workspace: workspace._id,
        creator: user._id,
        assignee: user._id,
        status: 'COMPLETED',
        priority: 'HIGH',
        labels: ['Backend', 'Security', 'Auth'],
        dueDate: new Date(Date.now() - 1 * 86400000),
        subtasks: [
          { title: 'Bcrypt hashing', completed: true },
          { title: 'HTTP-only cookie setup', completed: true },
        ],
      },
      {
        title: 'Code review for Task detail drawer component',
        description: 'Verify keyboard navigation, accessibility, responsive drawer transition, and comment submissions.',
        project: project1._id,
        workspace: workspace._id,
        creator: teammateUsers[0]._id,
        assignee: teammateUsers[1]._id,
        status: 'REVIEW',
        priority: 'MEDIUM',
        labels: ['Review', 'QA'],
        dueDate: new Date(Date.now() + 2 * 86400000),
        subtasks: [
          { title: 'Accessibility check', completed: true },
          { title: 'Mobile viewport testing', completed: false },
        ],
      },
      {
        title: 'Configure MongoDB compound indexes for task queries',
        description: 'Index { project: 1, status: 1 } and { workspace: 1, assignee: 1 } to keep query times below 15ms under high load.',
        project: project2._id,
        workspace: workspace._id,
        creator: user._id,
        assignee: teammateUsers[1]._id,
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        labels: ['Database', 'Performance'],
        dueDate: new Date(Date.now() + 4 * 86400000),
        subtasks: [
          { title: 'Query explain plans', completed: true },
          { title: 'Atlas index creation', completed: false },
        ],
      },
      {
        title: 'Prepare hackathon slide deck and live demo script',
        description: 'Highlight key architectural accomplishments: MERN stack, strict JWT cookies, clean Redux state, and pristine UI craft.',
        project: project3._id,
        workspace: workspace._id,
        creator: user._id,
        assignee: user._id,
        status: 'TODO',
        priority: 'MEDIUM',
        labels: ['Presentation', 'Launch'],
        dueDate: new Date(Date.now() + 6 * 86400000),
        subtasks: [
          { title: 'Outline talking points', completed: false },
          { title: 'Record backup video', completed: false },
        ],
      },
    ];

    const createdTasks = await Task.insertMany(sampleTasks);

    // Create sample comments on task 2
    const task2 = createdTasks[1];
    await Comment.create([
      {
        task: task2._id,
        author: teammateUsers[0]._id,
        content: 'I uploaded the SVG assets and icons. The drag elevation looks very smooth!',
      },
      {
        task: task2._id,
        author: user._id,
        content: 'Awesome! Connecting the status PATCH endpoint right now.',
      },
    ]);

    // Create sample activity logs
    await Activity.create([
      {
        workspace: workspace._id,
        project: project1._id,
        task: task2._id,
        user: user._id,
        action: 'STATUS_CHANGED',
        metadata: {
          taskTitle: task2.title,
          oldStatus: 'TODO',
          newStatus: 'IN_PROGRESS',
        },
      },
      {
        workspace: workspace._id,
        project: project1._id,
        user: teammateUsers[0]._id,
        action: 'COMPLETED_TASK',
        metadata: {
          taskTitle: 'Design tokenized design system in Figma',
        },
      },
      {
        workspace: workspace._id,
        project: project2._id,
        user: teammateUsers[1]._id,
        action: 'CREATED_PROJECT',
        metadata: {
          projectName: 'Core API Optimization',
        },
      },
    ]);

    // Create sample notifications
    await Notification.create([
      {
        recipient: user._id,
        type: 'TASK_ASSIGNED',
        title: 'Task Assigned to You',
        message: `Sarah Chen assigned you to "Build interactive Kanban board with drag-and-drop"`,
        relatedTask: task2._id,
        relatedProject: project1._id,
      },
      {
        recipient: user._id,
        type: 'COMMENT_ADDED',
        title: 'New Comment on Task',
        message: `Sarah Chen commented on "Build interactive Kanban board"`,
        relatedTask: task2._id,
        relatedProject: project1._id,
      },
    ]);
  }

  return { workspace, projectCount: existingProjects.length || 3 };
};

export const initDefaultDemoUsers = async () => {
  try {
    let alex = await User.findOne({ email: 'alex@taskflow.dev' });
    if (!alex) {
      alex = await User.create({
        name: 'Alex Morgan',
        email: 'alex@taskflow.dev',
        password: 'password123',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        role: 'admin',
      });
      await seedDemoData(alex);
      console.log('✅ Demo user alex@taskflow.dev initialized with workspaces and tasks');
    }

    let sarah = await User.findOne({ email: 'sarah@taskflow.dev' });
    if (!sarah) {
      sarah = await User.create({
        name: 'Sarah Chen',
        email: 'sarah@taskflow.dev',
        password: 'password123',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        role: 'member',
      });
      console.log('✅ Demo user sarah@taskflow.dev initialized');
    }
  } catch (err) {
    console.warn('⚠️ Error initializing default demo users:', err.message);
  }
};
