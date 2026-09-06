// src/services/activityService.js
import api from './api.js';

export const activityService = {
  getActivity: async (params = {}) => {
    const response = await api.get('/activity', { params });
    return response.data;
  },

  getWorkspaceActivity: async (workspaceId) => {
    const response = await api.get(`/activity/workspace/${workspaceId}`);
    return response.data;
  },
};
