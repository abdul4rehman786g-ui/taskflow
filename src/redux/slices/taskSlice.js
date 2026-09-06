// src/redux/slices/taskSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '../../services/taskService.js';

export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async (params, thunkAPI) => {
    try {
      return await taskService.getTasks(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'task/fetchTaskById',
  async (id, thunkAPI) => {
    try {
      return await taskService.getTaskById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch task');
    }
  }
);

export const createTask = createAsyncThunk(
  'task/createTask',
  async (data, thunkAPI) => {
    try {
      return await taskService.createTask(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'task/updateTask',
  async ({ id, data }, thunkAPI) => {
    try {
      return await taskService.updateTask(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'task/updateTaskStatus',
  async ({ id, status, order }, thunkAPI) => {
    try {
      return await taskService.updateStatus(id, status, order);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to update task status');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async (id, thunkAPI) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to delete task');
    }
  }
);

export const toggleSubtask = createAsyncThunk(
  'task/toggleSubtask',
  async ({ taskId, subtaskId, completed }, thunkAPI) => {
    try {
      return await taskService.toggleSubtask(taskId, subtaskId, completed);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to update subtask');
    }
  }
);

export const addTaskComment = createAsyncThunk(
  'task/addTaskComment',
  async ({ taskId, content }, thunkAPI) => {
    try {
      return await taskService.addComment(taskId, content);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to add comment');
    }
  }
);

const initialState = {
  tasks: [],
  currentTask: null,
  activeTaskId: null,
  isDrawerOpen: false,
  comments: [],
  isLoading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    openTaskDrawer: (state, action) => {
      state.activeTaskId = action.payload;
      state.isDrawerOpen = true;
    },
    closeTaskDrawer: (state) => {
      state.isDrawerOpen = false;
      state.activeTaskId = null;
      state.currentTask = null;
      state.comments = [];
    },
    setComments: (state, action) => {
      state.comments = action.payload;
    },
    // Safe optimistic status change for drag and drop
    optimisticStatusChange: (state, action) => {
      const { taskId, status } = action.payload;
      const task = state.tasks.find((t) => t._id === taskId);
      if (task) {
        task.status = status;
      }
      if (state.currentTask?._id === taskId) {
        state.currentTask.status = status;
      }
    },
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.data;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Task By ID
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.currentTask = action.payload.data;
      })
      // Create Task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload.data);
      })
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload.data._id);
        if (index !== -1) {
          state.tasks[index] = action.payload.data;
        }
        if (state.currentTask?._id === action.payload.data._id) {
          state.currentTask = action.payload.data;
        }
      })
      // Update Task Status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload.data._id);
        if (index !== -1) {
          state.tasks[index] = action.payload.data;
        }
        if (state.currentTask?._id === action.payload.data._id) {
          state.currentTask.status = action.payload.data.status;
        }
      })
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
        if (state.activeTaskId === action.payload) {
          state.isDrawerOpen = false;
          state.activeTaskId = null;
          state.currentTask = null;
        }
      })
      // Toggle Subtask
      .addCase(toggleSubtask.fulfilled, (state, action) => {
        const updated = action.payload.data;
        if (state.currentTask?._id === updated._id) {
          state.currentTask.subtasks = updated.subtasks;
        }
        const task = state.tasks.find((t) => t._id === updated._id);
        if (task) {
          task.subtasks = updated.subtasks;
        }
      })
      // Add Comment
      .addCase(addTaskComment.fulfilled, (state, action) => {
        state.comments.push(action.payload.data);
      });
  },
});

export const {
  openTaskDrawer,
  closeTaskDrawer,
  setComments,
  optimisticStatusChange,
  clearTaskError,
} = taskSlice.actions;

export default taskSlice.reducer;
