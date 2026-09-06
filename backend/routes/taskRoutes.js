// backend/routes/taskRoutes.js
import express from 'express';
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  toggleSubtask,
} from '../controllers/taskController.js';
import {
  getTaskComments,
  addComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);
router.patch('/:id/status', updateTaskStatus);
router.patch('/:id/subtasks/:subtaskId', toggleSubtask);

// Task comments
router.route('/:taskId/comments').get(getTaskComments).post(addComment);

export default router;
