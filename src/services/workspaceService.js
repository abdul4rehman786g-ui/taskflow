// src/services/workspaceService.js
import api from './api.js';

export const workspaceService = {
  getWorkspaces: async () => {
    const response = await api.get('/workspaces');
    return response.data;
  },

  getWorkspaceById: async (id) => {
    const response = await api.get(`/workspaces/${id}`);
    return response.data;
  },

  createWorkspace: async (data) => {
    const response = await api.post('/workspaces', data);
    return response.data;
  },

  updateWorkspace: async (id, data) => {
    const response = await api.put(`/workspaces/${id}`, data);
    return response.data;
  },

  deleteWorkspace: async (id) => {
    const response = await api.delete(`/workspaces/${id}`);
    return response.data;
  },

  addMember: async (workspaceId, memberData) => {
    const response = await api.post(`/workspaces/${workspaceId}/members`, memberData);
    return response.data;
  },

  inviteMember: async (workspaceId, email, role) => {
    const response = await api.post(`/workspaces/${workspaceId}/members`, { email, role });
    return response.data;
  },

  removeMember: async (workspaceId, memberId) => {
    const response = await api.delete(`/workspaces/${workspaceId}/members/${memberId}`);
    return response.data;
  },

  updateMemberRole: async (workspaceId, memberId, role) => {
    const response = await api.patch(`/workspaces/${workspaceId}/members/${memberId}`, { role });
    return response.data;
  },
};
