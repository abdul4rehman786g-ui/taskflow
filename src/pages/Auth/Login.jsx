// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, googleLogin, clearError } from '../../redux/slices/authSlice.js';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { GoogleButton } from '../../components/ui/GoogleButton.jsx';
import { auth, googleProvider } from '../../config/firebase.js';
import { signInWithPopup } from 'firebase/auth';
import { Mail, Lock, Sparkles, CheckCircle2, Shield } from 'lucide-react';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      await dispatch(login({ email, password })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await dispatch(googleLogin(idToken)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Google sign-in error:', err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    try {
      await dispatch(login({ email: demoEmail, password: demoPassword })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Quick login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center p-4 sm:p-6 transition-colors">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white ring-1 ring-stone-200 shadow-xl shadow-emerald-500/20 mb-3 overflow-hidden">
            <img src="/logo-mark.png" alt="TaskFlow" className="w-full h-full object-contain p-1" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white tracking-tight">
            Welcome to TaskFlow
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Production-grade SaaS project management for agile teams
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-stone-800/80 backdrop-blur-xl border border-stone-200 dark:border-stone-700/80 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 text-red-600 dark:text-red-300 text-xs flex items-center justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => dispatch(clearError())}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              icon={Mail}
              placeholder="alex@taskflow.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isLoading}
              size="lg"
            >
              Sign In to Workspace
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-stone-200 dark:bg-stone-700" />
            <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">
              or
            </span>
            <div className="h-px flex-1 bg-stone-200 dark:bg-stone-700" />
          </div>

          <GoogleButton onClick={handleGoogleSignIn} isLoading={isGoogleLoading} />

          {/* Quick Demo Logins for reviewers / evaluators */}
          <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-700/60">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>One-Click Demo Credentials</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('alex@taskflow.dev', 'password123')}
                className="p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-700/50 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-600/50 text-left transition-colors cursor-pointer group"
              >
                <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  Alex Morgan
                </p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400">Team Lead (Admin)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('sarah@taskflow.dev', 'password123')}
                className="p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-700/50 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-600/50 text-left transition-colors cursor-pointer group"
              >
                <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  Sarah Chen
                </p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400">Senior Engineer</p>
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
