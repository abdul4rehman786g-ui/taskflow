// backend/controllers/authController.js
import { User } from '../models/User.js';
import { Workspace } from '../models/Workspace.js';
import { generateToken } from '../utils/generateToken.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getFirebaseAdmin } from '../config/firebaseAdmin.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: name, email, and password',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    });
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email address already exists',
    });
  }

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
  });

  if (user) {
    // Automatically create a default workspace for the new user
    const defaultWorkspace = await Workspace.create({
      name: req.body.workspaceName?.trim() || `${user.name.split(' ')[0]}'s Workspace`,
      description: 'Primary team workspace for tasks, projects, and goals.',
      owner: user._id,
      members: [
        {
          user: user._id,
          role: 'OWNER',
          joinedAt: new Date(),
        },
      ],
    });

    const populatedWorkspace = await Workspace.findById(defaultWorkspace._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    user.workspaces.push(defaultWorkspace._id);
    await user.save();

    const token = generateToken(res, user._id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        workspaces: [populatedWorkspace || defaultWorkspace],
        defaultWorkspaceId: defaultWorkspace._id,
        token,
      },
    });
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid user registration data provided',
    });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password',
    });
  }

  const user = await User.findOne({ email: email.toLowerCase() })
    .select('+password')
    .populate({
      path: 'workspaces',
      populate: [
        { path: 'owner', select: 'name email avatar' },
        { path: 'members.user', select: 'name email avatar' },
      ],
    });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        workspaces: user.workspaces,
        token,
      },
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password credentials',
    });
  }
});

// @desc    Authenticate / register a user via Firebase Google Sign-In
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      success: false,
      message: 'Google ID token is required',
    });
  }

  let decoded;
  try {
    const admin = getFirebaseAdmin();
    decoded = await admin.auth().verifyIdToken(idToken);
  } catch (error) {
    console.error('❌ Google token verify failed:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired Google sign-in token',
    });
  }

  const { uid, email, name, picture } = decoded;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Google account has no email address associated with it',
    });
  }

  let user = await User.findOne({ $or: [{ googleId: uid }, { email: email.toLowerCase() }] }).populate({
    path: 'workspaces',
    populate: [
      { path: 'owner', select: 'name email avatar' },
      { path: 'members.user', select: 'name email avatar' },
    ],
  });

  let defaultWorkspace = null;

  if (!user) {
    user = await User.create({
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      avatar: picture || '',
      authProvider: 'google',
      googleId: uid,
    });

    defaultWorkspace = await Workspace.create({
      name: `${user.name.split(' ')[0]}'s Workspace`,
      description: 'Primary team workspace for tasks, projects, and goals.',
      owner: user._id,
      members: [
        {
          user: user._id,
          role: 'OWNER',
          joinedAt: new Date(),
        },
      ],
    });

    user.workspaces.push(defaultWorkspace._id);
    await user.save();
    await user.populate({
      path: 'workspaces',
      populate: [
        { path: 'owner', select: 'name email avatar' },
        { path: 'members.user', select: 'name email avatar' },
      ],
    });
  } else if (!user.googleId) {
    // Existing local account signing in with Google for the first time — link it
    user.googleId = uid;
    if (!user.avatar && picture) user.avatar = picture;
    await user.save();
  }

  const token = generateToken(res, user._id);

  return res.status(200).json({
    success: true,
    message: 'Signed in with Google successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      workspaces: user.workspaces,
      token,
    },
  });
});

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json({
    success: true,
    message: 'User successfully logged out',
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'workspaces',
    populate: {
      path: 'members.user',
      select: 'name email avatar',
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      workspaces: user.workspaces,
    },
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  if (req.body.name) user.name = req.body.name;
  if (req.body.avatar !== undefined) user.avatar = req.body.avatar;

  const updatedUser = await user.save();

  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
    },
  });
});
