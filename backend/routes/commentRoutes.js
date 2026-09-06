// backend/routes/commentRoutes.js
import express from 'express';
import { updateComment, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/:id').put(updateComment).delete(deleteComment);

export default router;
