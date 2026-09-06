// src/redux/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('taskflow_theme');
    if (saved === 'dark' || saved === 'light') return saved;
  }
  return 'light';
};

const initialTheme = getInitialTheme();
if (typeof document !== 'undefined') {
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

const initialState = {
  theme: initialTheme,
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  isCommandPaletteOpen: false,
  activeFilters: {
    status: '',
    priority: '',
    assignee: '',
    search: '',
    project: '',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('taskflow_theme', state.theme);
        if (state.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('taskflow_theme', action.payload);
        if (action.payload === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.isSidebarCollapsed = action.payload;
    },
    setMobileSidebarOpen: (state, action) => {
      state.isMobileSidebarOpen = action.payload;
    },
    setCommandPaletteOpen: (state, action) => {
      state.isCommandPaletteOpen = action.payload;
    },
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.activeFilters[key] = value;
    },
    resetFilters: (state) => {
      state.activeFilters = {
        status: '',
        priority: '',
        assignee: '',
        search: '',
        project: '',
      };
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarCollapsed,
  setMobileSidebarOpen,
  setCommandPaletteOpen,
  setFilter,
  resetFilters,
} = uiSlice.actions;

export default uiSlice.reducer;
