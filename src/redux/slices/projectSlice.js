// src/redux/slices/projectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from '../../services/projectService.js';

export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (params, thunkAPI) => {
    try {
      return await projectService.getProjects(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch projects');
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'project/fetchProjectById',
  async (id, thunkAPI) => {
    try {
      return await projectService.getProjectById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch project');
    }
  }
);

export const createProject = createAsyncThunk(
  'project/createProject',
  async (data, thunkAPI) => {
    try {
      return await projectService.createProject(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'project/updateProject',
  async ({ id, data }, thunkAPI) => {
    try {
      return await projectService.updateProject(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'project/deleteProject',
  async (id, thunkAPI) => {
    try {
      await projectService.deleteProject(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to delete project');
    }
  }
);

const initialState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    clearProjectError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload.data;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Project By ID
      .addCase(fetchProjectById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload.data;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Project
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload.data);
      })
      // Update Project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex((p) => p._id === action.payload.data._id);
        if (index !== -1) {
          state.projects[index] = action.payload.data;
        }
        if (state.currentProject?._id === action.payload.data._id) {
          state.currentProject = { ...state.currentProject, ...action.payload.data };
        }
      })
      // Delete Project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p._id !== action.payload);
        if (state.currentProject?._id === action.payload) {
          state.currentProject = null;
        }
      });
  },
});

export const { clearCurrentProject, clearProjectError } = projectSlice.actions;
export default projectSlice.reducer;
