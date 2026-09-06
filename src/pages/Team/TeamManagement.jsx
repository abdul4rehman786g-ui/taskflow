// src/pages/Team/TeamManagement.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  Mail,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { workspaceService } from '../../services/workspaceService.js';
import { fetchWorkspaceById, fetchWorkspaces } from '../../redux/slices/workspaceSlice.js';
import { Button } from '../../components/ui/Button.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Select } from '../../components/ui/Select.jsx';
import { Avatar } from '../../components/ui/Avatar.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';

export const TeamManagement = () => {
  const dispatch = useDispatch();
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const { user } = useSelector((state) => state.auth);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [memberToRemove, setMemberToRemove] = useState(null);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');
      await workspaceService.inviteMember(
        currentWorkspace._id,
        inviteEmail.trim(),
        inviteRole
      );
      dispatch(fetchWorkspaceById(currentWorkspace._id));
      setSuccess(`Invited ${inviteEmail} successfully!`);
      setInviteEmail('');
      setTimeout(() => setIsInviteModalOpen(false), 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to invite');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    try {
      await workspaceService.removeMember(
        currentWorkspace._id,
        memberToRemove.user?._id || memberToRemove.user
      );
      dispatch(fetchWorkspaceById(currentWorkspace._id));
      setMemberToRemove(null);
    } catch (err) {
      console.error(err);
    }
  };

  const members = currentWorkspace?.members || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            <span>Team & Workspace Access</span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage contributors, access control permissions, and team member invitations
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsInviteModalOpen(true)}
          icon={UserPlus}
        >
          Invite Teammate
        </Button>
      </div>

      {/* Workspace Summary Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {currentWorkspace?.name}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {currentWorkspace?.description || 'Active organization workspace'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-stone-500">
          <div>
            <span className="font-bold text-stone-800 dark:text-stone-200">
              {members.length}
            </span>{' '}
            Active Members
          </div>
          <div>
            <span className="font-bold text-stone-800 dark:text-stone-200">
              {currentWorkspace?.projects?.length || 0}
            </span>{' '}
            Projects
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-900/80 border-b border-stone-200 dark:border-stone-800 text-stone-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {members.map((m, idx) => {
                const memberUser = m.user || {};
                const isMe = memberUser._id === user?._id;

                return (
                  <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          name={memberUser.name || 'Member'}
                          src={memberUser.avatar}
                          size="sm"
                        />
                        <div>
                          <p className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                            {memberUser.name || 'Invited User'}
                            {isMe && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-stone-500">
                                You
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-stone-500">
                      {memberUser.email || '—'}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                        <Shield className="w-3 h-3 text-emerald-500" />
                        <span>{m.role}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {!isMe && m.role !== 'OWNER' && (
                        <button
                          type="button"
                          onClick={() => setMemberToRemove(m)}
                          className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                          title="Remove member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Teammate Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Teammate to Workspace"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleInvite} className="space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-50 dark:bg-red-950/30 text-red-600 rounded-xl border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>{success}</span>
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="colleague@taskflow.dev"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />

          <Select
            label="Workspace Role"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            options={[
              { label: 'Admin (Manage tasks, projects, members)', value: 'ADMIN' },
              { label: 'Member (Create & edit assigned tasks)', value: 'MEMBER' },
              { label: 'Viewer (Read-only access)', value: 'VIEWER' },
            ]}
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
            <Button
              variant="secondary"
              onClick={() => setIsInviteModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm remove dialog */}
      <ConfirmDialog
        isOpen={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleRemoveMember}
        title="Remove Team Member"
        message={`Are you sure you want to revoke access for this team member?`}
      />
    </div>
  );
};
