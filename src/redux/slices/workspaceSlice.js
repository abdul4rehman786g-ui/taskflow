// src/redux/slices/workspaceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workspaceService } from '../../services/workspaceService.js';

export const fetchWorkspaces = createAsyncThunk(
  'workspace/fetchWorkspaces',
  async (_, thunkAPI) => {
    try {
      return await workspaceService.getWorkspaces();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch workspaces');
    }
  }
);

export const fetchWorkspaceById = createAsyncThunk(
  'workspace/fetchWorkspaceById',
  async (id, thunkAPI) => {
    try {
      return await workspaceService.getWorkspaceById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch workspace');
    }
  }
);

export const createWorkspace = createAsyncThunk(
  'workspace/createWorkspace',
  async (data, thunkAPI) => {
    try {
      return await workspaceService.createWorkspace(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to create workspace');
    }
  }
);

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload;
    },
    clearWorkspaceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workspaces = action.payload.data;
        if (state.workspaces.length > 0 && !state.currentWorkspace) {
          state.currentWorkspace = state.workspaces[0];
        }
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchWorkspaceById.fulfilled, (state, action) => {
        state.currentWorkspace = action.payload.data;
        const index = state.workspaces.findIndex((w) => w._id === action.payload.data._id);
        if (index !== -1) {
          state.workspaces[index] = action.payload.data;
        }
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.workspaces.unshift(action.payload.data);
        state.currentWorkspace = action.payload.data;
      })
      .addCase('auth/register/fulfilled', (state, action) => {
        if (action.payload.data?.workspaces?.length > 0) {
          state.workspaces = action.payload.data.workspaces;
          state.currentWorkspace = action.payload.data.workspaces[0];
        }
      })
      .addCase('auth/login/fulfilled', (state, action) => {
        if (action.payload.data?.workspaces?.length > 0) {
          state.workspaces = action.payload.data.workspaces;
          state.currentWorkspace = action.payload.data.workspaces[0];
        }
      })
      .addCase('auth/logout/fulfilled', (state) => {
        state.workspaces = [];
        state.currentWorkspace = null;
      });
  },
});

export const { setCurrentWorkspace, clearWorkspaceError } = workspaceSlice.actions;
export default workspaceSlice.reducer;
