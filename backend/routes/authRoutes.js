// backend/routes/authRoutes.js
import express from 'express';
import {
  registerUser,
  loginUser,
  googleAuth,
  logoutUser,
  getMe,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { seedDemoData } from '../utils/seedData.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Demo seed endpoint
router.post(
  '/seed',
  protect,
  asyncHandler(async (req, res) => {
    const result = await seedDemoData(req.user);
    res.status(200).json({
      success: true,
      message: 'Demo workspace, projects, tasks, and activities seeded successfully into MongoDB!',
      data: result,
    });
  })
);

export default router;
