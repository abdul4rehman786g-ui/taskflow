// src/hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { login, register, logout, getMe } from '../redux/slices/authSlice.js';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: (credentials) => dispatch(login(credentials)),
    register: (data) => dispatch(register(data)),
    logout: () => dispatch(logout()),
    checkAuth: () => dispatch(getMe()),
  };
};
