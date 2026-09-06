// src/App.jsx
import React, { useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useOutletContext,
} from 'react-router-dom';
import { store } from './redux/store.js';
import { getMe } from './redux/slices/authSlice.js';
import { fetchWorkspaces } from './redux/slices/workspaceSlice.js';
import { fetchNotifications } from './redux/slices/notificationSlice.js';
import { AppLayout } from './components/layout/AppLayout.jsx';
import { Login } from './pages/Auth/Login.jsx';
import { Register } from './pages/Auth/Register.jsx';
import { Dashboard } from './pages/Dashboard/Dashboard.jsx';
import { MyTasks } from './pages/Tasks/MyTasks.jsx';
import { ProjectsList } from './pages/Projects/ProjectsList.jsx';
import { ProjectDetail } from './pages/Projects/ProjectDetail.jsx';
import { CalendarView } from './pages/Calendar/CalendarView.jsx';
import { TeamManagement } from './pages/Team/TeamManagement.jsx';
import { NotificationsPage } from './pages/Notifications/NotificationsPage.jsx';
import { Settings } from './pages/Settings/Settings.jsx';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex flex-col items-center justify-center text-stone-900 dark:text-white transition-colors">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Connecting to TaskFlow...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex flex-col items-center justify-center text-stone-900 dark:text-white transition-colors">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Loading session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Route wrapper adapters that receive `onOpenCreateTask` from `AppLayout` outlet
const DashboardWrapper = () => {
  const { onOpenCreateTask } = useOutletContext();
  return <Dashboard onOpenCreateTask={onOpenCreateTask} />;
};

const MyTasksWrapper = () => {
  const { onOpenCreateTask } = useOutletContext();
  return <MyTasks onOpenCreateTask={onOpenCreateTask} />;
};

const ProjectsListWrapper = () => {
  const { onOpenCreateProject } = useOutletContext();
  return <ProjectsList onOpenCreateProject={onOpenCreateProject} />;
};

const ProjectDetailWrapper = () => {
  const { onOpenCreateTask } = useOutletContext();
  return <ProjectDetail onOpenCreateTask={onOpenCreateTask} />;
};

const CalendarViewWrapper = () => {
  const { onOpenCreateTask } = useOutletContext();
  return <CalendarView onOpenCreateTask={onOpenCreateTask} />;
};

function AppContent() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Sync theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initial session check
  useEffect(() => {
    dispatch(getMe())
      .unwrap()
      .then(() => {
        dispatch(fetchWorkspaces());
        dispatch(fetchNotifications());
      })
      .catch(() => {
        // Not logged in or invalid token
      });
  }, [dispatch]);

  // Fetch workspaces & notifications if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWorkspaces());
      dispatch(fetchNotifications());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Application Workspace */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardWrapper />} />
          <Route path="tasks" element={<MyTasksWrapper />} />
          <Route path="projects" element={<ProjectsListWrapper />} />
          <Route path="projects/:id" element={<ProjectDetailWrapper />} />
          <Route path="calendar" element={<CalendarViewWrapper />} />
          <Route path="team" element={<TeamManagement />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
