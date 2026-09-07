// @desc    Remove member from workspace
// @route   DELETE /api/workspaces/:workspaceId/members/:memberId
// @access  Private (Owner/Admin)
export const removeWorkspaceMember = asyncHandler(async (req, res) => {
  const { workspaceId, memberId } = req.params;

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    return res.status(404).json({
      success: false,
      message: 'Workspace not found',
    });
  }

  const isOwner = workspace.owner.toString() === req.user._id.toString();
  const requester = workspace.members.find(
    (m) => m.user.toString() === req.user._id.toString()
  );
  const isAdmin = requester && (requester.role === 'ADMIN' || requester.role === 'OWNER');

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Only workspace owners and administrators can remove members',
    });
  }

  const memberToRemove = workspace.members.find(
    (m) => m.user.toString() === memberId || m._id.toString() === memberId
  );

  if (!memberToRemove) {
    return res.status(404).json({
      success: false,
      message: 'Member not found in this workspace',
    });
  }

  if (memberToRemove.user.toString() === workspace.owner.toString()) {
    return res.status(400).json({
      success: false,
      message: 'The workspace owner cannot be removed',
    });
  }

  workspace.members = workspace.members.filter(
    (m) => m.user.toString() !== memberToRemove.user.toString()
  );
  await workspace.save();

  await User.findByIdAndUpdate(memberToRemove.user, {
    $pull: { workspaces: workspace._id },
  });

  await Activity.create({
    workspace: workspace._id,
    user: req.user._id,
    action: 'REMOVED_MEMBER',
    metadata: { removedUserId: memberToRemove.user },
  });

  const updatedWorkspace = await Workspace.findById(workspace._id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');

  return res.status(200).json({
    success: true,
    message: 'Member removed successfully',
    data: updatedWorkspace,
  });
});
