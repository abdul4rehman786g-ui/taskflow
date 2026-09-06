// src/redux/slices/notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '../../services/notificationService.js';

export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (_, thunkAPI) => {
    try {
      return await notificationService.getNotifications();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notification/markNotificationRead',
  async (id, thunkAPI) => {
    try {
      await notificationService.markAsRead(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to mark as read');
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  'notification/markAllNotificationsRead',
  async (_, thunkAPI) => {
    try {
      await notificationService.markAllAsRead();
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to mark all as read');
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.data.notifications;
        state.unreadCount = action.payload.data.unreadCount;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const item = state.notifications.find((n) => n._id === action.payload);
        if (item && !item.isRead) {
          item.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.isRead = true;
        });
        state.unreadCount = 0;
      });
  },
});

export default notificationSlice.reducer;
