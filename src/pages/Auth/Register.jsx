// src/pages/Auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, googleLogin, clearError } from '../../redux/slices/authSlice.js';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { GoogleButton } from '../../components/ui/GoogleButton.jsx';
import { auth, googleProvider } from '../../config/firebase.js';
import { signInWithPopup } from 'firebase/auth';
import { Mail, Lock, User, Building, CheckCircle2 } from 'lucide-react';

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    try {
      await dispatch(
        register({
          name,
          email,
          password,
          workspaceName: workspaceName || `${name}'s Team`,
        })
      ).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
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
            Create your TaskFlow Account
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Get your engineering or product workspace set up in seconds
          </p>
        </div>

        {/* Register Card */}
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
              label="Full Name"
              type="text"
              icon={User}
              placeholder="Elena Rostova"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Work Email"
              type="email"
              icon={Mail}
              placeholder="elena@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password (min 6 characters)"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            <Input
              label="Primary Workspace Name"
              type="text"
              icon={Building}
              placeholder="Acme Core Product"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isLoading}
              size="lg"
            >
              Get Started Now
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

          <GoogleButton onClick={handleGoogleSignIn} isLoading={isGoogleLoading} label="Sign up with Google" />

          {/* Login Link */}
          <div className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
