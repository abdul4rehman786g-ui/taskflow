// src/services/taskService.js
import api from './api.js';

export const taskService = {
  getTasks: async (params = {}) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  updateTask: async (id, data) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  updateStatus: async (id, status, order) => {
    const response = await api.patch(`/tasks/${id}/status`, { status, order });
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  toggleSubtask: async (taskId, subtaskId, completed) => {
    const response = await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`, { completed });
    return response.data;
  },

  // Comments
  getComments: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data;
  },

  addComment: async (taskId, content) => {
    const response = await api.post(`/tasks/${taskId}/comments`, { content });
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },
};
