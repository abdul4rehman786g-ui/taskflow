// backend/routes/activityRoutes.js
import express from 'express';
import { getActivity } from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getActivity);
router.get('/workspace/:workspaceId', getActivity);

export default router;
