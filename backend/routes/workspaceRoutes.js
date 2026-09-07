// backend/routes/workspaceRoutes.js
import express from 'express';
import {
  getWorkspaces,
  createWorkspace,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addWorkspaceMember,
  updateMemberRole,
  removeWorkspaceMember,
} from '../controllers/workspaceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getWorkspaces).post(createWorkspace);
router.route('/:id').get(getWorkspaceById).put(updateWorkspace).delete(deleteWorkspace);
router.route('/:id/members').post(addWorkspaceMember);
router.route('/:workspaceId/members/:memberId').patch(updateMemberRole).delete(removeWorkspaceMember);

export default router;
