// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService.js';

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    return await authService.register(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    return await authService.login(credentials);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Login failed');
  }
});

export const googleLogin = createAsyncThunk('auth/googleLogin', async (idToken, thunkAPI) => {
  try {
    return await authService.googleAuth(idToken);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Google sign-in failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    return await authService.logout();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Logout failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try {
    return await authService.getMe();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Not authenticated');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, thunkAPI) => {
  try {
    return await authService.updateProfile(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Profile update failed');
  }
});

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // initial check
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
        if (action.payload.data?.token) {
          try {
            localStorage.setItem('taskflow_token', action.payload.data.token);
          } catch {}
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
        if (action.payload.data?.token) {
          try {
            localStorage.setItem('taskflow_token', action.payload.data.token);
          } catch {}
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
        if (action.payload.data?.token) {
          try {
            localStorage.setItem('taskflow_token', action.payload.data.token);
          } catch {}
        }
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        try {
          localStorage.removeItem('taskflow_token');
        } catch {}
      })
      // Get Me (auth check)
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
      })
      .addCase(getMe.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
