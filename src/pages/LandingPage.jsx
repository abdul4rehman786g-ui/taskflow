// src/pages/Landing/LandingPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Layers,
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  CheckSquare,
  Columns3,
  Zap,
  Search,
  Sun,
  Moon,
  Sparkles,
  Shield,
  Clock,
  Check,
  MoreHorizontal,
  Lock,
  Share2,
  BarChart3,
  Mic,
  X,
  ChevronRight,
  Terminal,
  Activity,
  Users
} from 'lucide-react';
import { toggleTheme } from '../redux/slices/uiSlice.js';
import { login } from '../redux/slices/authSlice.js';

export function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [activePreviewTab, setActivePreviewTab] = useState('kanban');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoLoadingUser, setDemoLoadingUser] = useState(null);

  // Quick Demo Login Handler
  const handleQuickDemoLogin = async (email, password) => {
    setDemoLoadingUser(email);
    try {
      await dispatch(login({ email, password })).unwrap();
      setIsDemoModalOpen(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Quick login failed:', err);
    } finally {
      setDemoLoadingUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#def2e6] via-[#ebf7f1] to-[#d8efe3] dark:from-[#05140d] dark:via-[#091e14] dark:to-[#040e08] text-stone-900 dark:text-stone-100 transition-colors selection:bg-emerald-500/20 selection:text-emerald-900 dark:selection:text-emerald-200 relative overflow-x-hidden">
      {/* =========================================================
          ATTRACTIVE AMBIENT BACKGROUND GLOW & GEOMETRIC MESH
          ========================================================= */}
      {/* Top Primary Vibrant Aurora Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[650px] bg-gradient-to-b from-emerald-400/35 via-teal-300/25 to-transparent dark:from-emerald-500/20 dark:via-teal-800/20 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating Accent Radial Orbs */}
      <div className="fixed top-1/4 -left-48 w-96 h-96 bg-emerald-300/30 dark:bg-emerald-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 -right-48 w-96 h-96 bg-teal-300/30 dark:bg-teal-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-1/3 w-[600px] h-[400px] bg-emerald-200/40 dark:bg-emerald-900/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Subtle Geometric Engineering Grid Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#b7dcce_1px,transparent_1px),linear-gradient(to_bottom,#b7dcce_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#13281e_1px,transparent_1px),linear-gradient(to_bottom,#13281e_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10 opacity-75 dark:opacity-40" />

      {/* =========================================================
          NAVIGATION BAR
          ========================================================= */}
      <header className="sticky top-0 z-40 bg-[#def2e6]/80 dark:bg-[#05140d]/80 backdrop-blur-md border-b border-emerald-300/50 dark:border-emerald-900/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#006b2c] dark:bg-emerald-500 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-bold text-base tracking-tight text-stone-900 dark:text-white">
              TaskFlow
            </span>
          </Link>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-stone-600 dark:text-stone-400">
            <a href="#features" className="hover:text-stone-900 dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#preview" className="hover:text-stone-900 dark:hover:text-white transition-colors">
              Interface
            </a>
            <a href="#pricing" className="hover:text-stone-900 dark:hover:text-white transition-colors">
              Pricing
            </a>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-[#006b2c] dark:text-emerald-300 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006b2c] dark:bg-emerald-400 animate-pulse"></span>
              <span>24/7 AI Voice Support</span>
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(toggleTheme())}
              aria-label="Toggle dark mode"
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-850 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-850 border border-stone-200 dark:border-stone-800 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#006b2c] dark:text-emerald-400" />
              <span>Demo</span>
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <span>Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* =========================================================
            HERO SECTION: CLEAN, MINIMAL & STRIKING
            ========================================================= */}
        <section className="relative pt-16 sm:pt-20 pb-16 lg:pb-24 overflow-hidden">
          {/* Subtle warm/emerald backdrop gradient */}
          <div className="absolute top-0 inset-x-0 h-[480px] bg-gradient-to-b from-emerald-50/60 via-stone-50/30 to-transparent dark:from-emerald-950/20 dark:via-stone-950/40 dark:to-transparent pointer-events-none -z-10" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            {/* Subtle Announcement Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs text-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006b2c] dark:bg-emerald-400"></span>
              </span>
              <span className="font-medium text-stone-700 dark:text-stone-300">
                24/7 AI Voice Support Agent
              </span>
              <span className="text-stone-300 dark:text-stone-600">•</span>
              <span className="text-[#006b2c] dark:text-emerald-400 font-semibold">
                Always Online
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-950 dark:text-white leading-[1.12]">
              Work moves faster when <br className="hidden sm:inline" />
              <span className="text-[#006b2c] dark:text-emerald-400">everything is in sync.</span>
            </h1>

            {/* Subheading */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
              A calm, high-velocity project management platform built for modern engineering and product teams. Plan sprints, track Kanban velocity, and get 24/7 AI voice support whenever you need it.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white font-semibold text-sm shadow-md shadow-emerald-900/10 active:scale-[0.99] transition-all"
              >
                <span>Start for free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => setIsDemoModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-stone-200/90 dark:border-stone-800 font-semibold text-sm hover:bg-stone-50 dark:hover:bg-stone-850 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#006b2c] dark:text-emerald-400" />
                <span>Try Instant Demo</span>
              </button>
            </div>

            {/* Trust Microcopy */}
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-5 text-xs text-stone-500 dark:text-stone-400 pt-2 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006b2c] dark:text-emerald-400" />
                <span>Free forever tier</span>
              </div>
              <span className="opacity-30">•</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006b2c] dark:text-emerald-400" />
                <span>24/7 AI Voice Support</span>
              </div>
              <span className="opacity-30">•</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006b2c] dark:text-emerald-400" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>

          {/* =========================================================
              HERO APP SHOWCASE: REAL PRODUCT WINDOW WITH GORGEOUS GRADIENT PEDESTAL & COLORED CANVAS
              ========================================================= */}
          <div id="preview" className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 relative">
            {/* Atmospheric Outer Halo Glow */}
            <div className="absolute inset-x-4 top-14 bottom-2 bg-gradient-to-r from-emerald-500/35 via-teal-400/35 to-emerald-600/35 rounded-3xl blur-3xl opacity-80 dark:opacity-40 -z-10 pointer-events-none" />

            {/* Glowing Gradient Border Pedestal Frame */}
            <div className="p-2 sm:p-3.5 rounded-3xl bg-gradient-to-b from-emerald-400/40 via-teal-400/25 to-emerald-600/40 dark:from-emerald-500/30 dark:via-teal-600/20 dark:to-emerald-950/40 border-2 border-emerald-300/80 dark:border-emerald-500/40 shadow-2xl shadow-emerald-950/20 dark:shadow-black/80 backdrop-blur-md">
              <div className="rounded-2xl border border-emerald-200/90 dark:border-emerald-800/60 bg-white/95 dark:bg-[#0c1812] shadow-xl overflow-hidden backdrop-blur-md">
                {/* Window Chrome */}
                <div className="px-4 py-3 bg-gradient-to-r from-[#dff2e7] via-[#ebf7f0] to-[#dff2e7] dark:from-[#0d2319] dark:via-[#132c1e] dark:to-[#0d2319] border-b border-emerald-200/90 dark:border-emerald-800/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-xs"></span>
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-xs"></span>
                    <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-xs"></span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/80 dark:bg-stone-900/80 border border-emerald-200/70 dark:border-emerald-800/50 text-stone-700 dark:text-stone-300 font-mono text-[11px] shadow-xs">
                    <Lock className="w-3 h-3 text-[#006b2c] dark:text-emerald-400" />
                    <span>app.taskflow.dev/sprint-34</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white dark:bg-emerald-500 dark:text-stone-950 text-[10px] font-bold shadow-xs">
                      <Mic className="w-3 h-3 animate-pulse" />
                      <span>24/7 Voice Support Active</span>
                    </div>
                  </div>
                </div>

                {/* View Switcher Tabs inside Preview */}
                <div className="px-6 pt-3.5 pb-2.5 bg-gradient-to-r from-[#eef9f3] via-white/80 to-[#eef9f3] dark:from-[#0b1b13] dark:via-[#0e2117] dark:to-[#0b1b13] border-b border-emerald-200/60 dark:border-emerald-900/50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1 bg-emerald-100/70 dark:bg-stone-900/90 p-1 rounded-xl text-xs font-semibold border border-emerald-200/50 dark:border-emerald-800/40">
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab('kanban')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activePreviewTab === 'kanban'
                          ? 'bg-white dark:bg-emerald-950/80 text-[#006b2c] dark:text-emerald-300 shadow-xs font-bold'
                          : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
                      }`}
                    >
                      Kanban Board
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab('metrics')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activePreviewTab === 'metrics'
                          ? 'bg-white dark:bg-emerald-950/80 text-[#006b2c] dark:text-emerald-300 shadow-xs font-bold'
                          : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
                      }`}
                    >
                      Sprint Metrics
                    </button>
                  </div>

                  <div className="hidden sm:flex items-center gap-3 text-xs text-stone-600 dark:text-stone-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-[#006b2c] dark:text-emerald-400" />
                      <span>6 active contributors</span>
                    </span>
                  </div>
                </div>

                {/* Preview Canvas Body: Rich Tinted Colored Workspace Background */}
                <div className="p-4 sm:p-6 bg-gradient-to-br from-[#e4f5ec] via-[#ecf8f1] to-[#def0e6] dark:from-[#081710] dark:via-[#0c1f15] dark:to-[#07130d]">
                  {activePreviewTab === 'kanban' ? (
                    /* Clean Kanban Preview Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* To Do */}
                      <div className="rounded-xl bg-white/95 dark:bg-[#11231a]/95 border border-emerald-200/80 dark:border-emerald-800/60 p-3.5 space-y-3 shadow-sm">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                            <span>To Do</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">2</span>
                        </div>

                        <div className="p-3 rounded-lg bg-[#f6fbf8] dark:bg-[#162c20] border border-emerald-100 dark:border-emerald-800/50 space-y-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold">Architecture</span>
                          <p className="font-semibold text-xs text-stone-900 dark:text-stone-100">Design token hierarchy & palette sync</p>
                          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                            <span>Sprint 34</span>
                            <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[9px] flex items-center justify-center">AM</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-[#f6fbf8] dark:bg-[#162c20] border border-emerald-100 dark:border-emerald-800/50 space-y-2">
                          <span className="px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-semibold">Docs</span>
                          <p className="font-semibold text-xs text-stone-900 dark:text-stone-100">User onboarding flow checklist</p>
                          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                            <span>Sprint 34</span>
                            <span className="w-5 h-5 rounded-full bg-stone-600 text-white font-bold text-[9px] flex items-center justify-center">KL</span>
                          </div>
                        </div>
                      </div>

                      {/* In Progress */}
                      <div className="rounded-xl bg-white/95 dark:bg-[#11231a]/95 border-2 border-emerald-500/60 dark:border-emerald-500/50 p-3.5 space-y-3 shadow-md">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-[#006b2c] dark:text-emerald-400 uppercase tracking-wider text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-[#006b2c] dark:bg-emerald-400"></span>
                            <span>In Progress</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">2</span>
                        </div>

                        <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/70 space-y-2">
                          <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 text-[10px] font-bold">P0 High</span>
                          <p className="font-semibold text-xs text-stone-900 dark:text-stone-100">Live webhook synchronization</p>
                          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                            <span className="text-[#006b2c] dark:text-emerald-400 font-medium">Due tomorrow</span>
                            <span className="w-5 h-5 rounded-full bg-[#006b2c] text-white font-bold text-[9px] flex items-center justify-center">SC</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-[#f6fbf8] dark:bg-[#162c20] border border-emerald-100 dark:border-emerald-800/50 space-y-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold">Frontend</span>
                          <p className="font-semibold text-xs text-stone-900 dark:text-stone-100">Command palette keybinding speed</p>
                          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                            <span>Due Friday</span>
                            <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[9px] flex items-center justify-center">AM</span>
                          </div>
                        </div>
                      </div>

                      {/* In Review */}
                      <div className="rounded-xl bg-white/95 dark:bg-[#11231a]/95 border border-emerald-200/80 dark:border-emerald-800/60 p-3.5 space-y-3 shadow-sm">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                            <span>In Review</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-[10px] font-bold text-teal-800 dark:text-teal-300">1</span>
                        </div>

                        <div className="p-3 rounded-lg bg-[#f6fbf8] dark:bg-[#162c20] border border-emerald-100 dark:border-emerald-800/50 space-y-2">
                          <span className="px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-semibold">Security</span>
                          <p className="font-semibold text-xs text-stone-900 dark:text-stone-100">RBAC role permission rules</p>
                          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                            <span className="text-teal-600 dark:text-teal-400">PR #491 pending</span>
                            <span className="w-5 h-5 rounded-full bg-teal-700 text-white font-bold text-[9px] flex items-center justify-center">ML</span>
                          </div>
                        </div>
                      </div>

                      {/* Completed */}
                      <div className="rounded-xl bg-white/95 dark:bg-[#11231a]/95 border border-emerald-200/80 dark:border-emerald-800/60 p-3.5 space-y-3 shadow-sm">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-stone-500 uppercase tracking-wider text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-[#27c93f]"></span>
                            <span>Completed</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">8</span>
                        </div>

                        <div className="p-3 rounded-lg bg-[#f6fbf8] dark:bg-[#162c20] border border-emerald-100 dark:border-emerald-800/50 space-y-1.5 opacity-80">
                          <p className="font-semibold text-xs text-stone-500 line-through">Database query optimization</p>
                          <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                            <span className="text-[#006b2c] dark:text-emerald-400 font-semibold">Merged</span>
                            <span>Alex Morgan</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-[#f6fbf8] dark:bg-[#162c20] border border-emerald-100 dark:border-emerald-800/50 space-y-1.5 opacity-80">
                          <p className="font-semibold text-xs text-stone-500 line-through">Sprint 33 retrospective notes</p>
                          <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                            <span className="text-[#006b2c] dark:text-emerald-400 font-semibold">Archived</span>
                            <span>Sarah Chen</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Sprint Metrics Preview */
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-white/95 dark:bg-[#11231a]/95 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1.5 shadow-sm">
                        <span className="text-xs text-stone-500 font-medium">Sprint 34 Completion</span>
                        <p className="text-2xl font-bold text-stone-900 dark:text-white">84%</p>
                        <div className="w-full h-1.5 rounded-full bg-emerald-100 dark:bg-stone-800 overflow-hidden mt-2">
                          <div className="h-full bg-[#006b2c] dark:bg-emerald-400 rounded-full" style={{ width: '84%' }}></div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white/95 dark:bg-[#11231a]/95 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1.5 shadow-sm">
                        <span className="text-xs text-stone-500 font-medium">Team Velocity</span>
                        <p className="text-2xl font-bold text-stone-900 dark:text-white">42 pts</p>
                        <p className="text-xs text-[#006b2c] dark:text-emerald-400 font-medium">+8% over sprint target</p>
                      </div>

                      <div className="p-4 rounded-xl bg-white/95 dark:bg-[#11231a]/95 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1.5 shadow-sm">
                        <span className="text-xs text-stone-500 font-medium">AI Voice Support</span>
                        <p className="text-2xl font-bold text-[#006b2c] dark:text-emerald-400">24/7 Live</p>
                        <p className="text-xs text-stone-500">Zero wait time for team troubleshooting</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            CORE CAPABILITIES / FEATURES (CLEAN BENTO GRID)
            ========================================================= */}
        <section id="features" className="py-20 border-t border-stone-200/70 dark:border-emerald-950/80 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-[#006b2c] dark:text-emerald-400 uppercase tracking-widest">
                Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-950 dark:text-white tracking-tight">
                Crafted for clarity. Engineered for speed.
              </h2>
              <p className="text-base text-stone-600 dark:text-stone-400">
                Essential project execution tools without bloated configurations or distracting clutter.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-[#111815]/80 backdrop-blur-xs border border-stone-200/80 dark:border-emerald-950/70 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/5 transition-all space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-[#006b2c] dark:text-emerald-400 flex items-center justify-center">
                  <Columns3 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-stone-900 dark:text-white">Kanban Velocity Boards</h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Smooth drag-and-drop boards across customizable stages: To Do, In Progress, Review, and Completed.
                </p>
              </div>

              {/* Feature 2: 24/7 AI Voice Agent */}
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-[#111815]/80 backdrop-blur-xs border border-emerald-500/40 dark:border-emerald-500/30 hover:border-emerald-500 transition-all space-y-3 shadow-xs relative">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#006b2c] dark:text-emerald-400 flex items-center justify-center">
                  <Mic className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-stone-900 dark:text-white">24/7 AI Voice Support</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#006b2c] dark:text-emerald-300 text-[10px] font-bold">24H</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Instant spoken answers for sprint setup, task assignments, role changes, and workflow blockers around the clock.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-[#111815]/80 backdrop-blur-xs border border-stone-200/80 dark:border-emerald-950/70 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/5 transition-all space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-stone-900 dark:text-white">Milestone & Project Sync</h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Organize team initiatives with clear owners, sprint deadlines, and progress bars that update in real time.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-[#111815]/80 backdrop-blur-xs border border-stone-200/80 dark:border-emerald-950/70 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/5 transition-all space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-stone-900 dark:text-white">Role-Based Access (RBAC)</h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Secure governance. Grant admin rights to Alex Morgan or scoped execution permissions to team engineers.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-[#111815]/80 backdrop-blur-xs border border-stone-200/80 dark:border-emerald-950/70 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/5 transition-all space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-stone-900 dark:text-white">Command Palette (⌘K)</h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Lightning-fast navigation. Jump between tasks, active sprints, tags, and team members right from your keyboard.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-[#111815]/80 backdrop-blur-xs border border-stone-200/80 dark:border-emerald-950/70 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/5 transition-all space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-stone-900 dark:text-white">Live Activity & Audit Logs</h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Full visibility on who changed what, completed checklist items, and modified status tags with timestamped logs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            TRANSPARENT PRICING
            ========================================================= */}
        <section id="pricing" className="py-20 bg-gradient-to-b from-emerald-50/25 via-stone-50/50 to-transparent dark:from-emerald-950/20 dark:via-[#0c120f]/60 dark:to-transparent border-t border-stone-200/70 dark:border-emerald-950/80 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-xs font-bold text-[#006b2c] dark:text-emerald-400 uppercase tracking-widest">
                Pricing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-950 dark:text-white tracking-tight">
                Simple, predictable plans.
              </h2>
              <p className="text-base text-stone-600 dark:text-stone-400">
                24/7 AI Voice Support included in every workspace tier.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Starter Tier */}
              <div className="p-8 rounded-2xl bg-white/90 dark:bg-[#111815]/90 backdrop-blur-xs border border-stone-200/80 dark:border-emerald-950/70 shadow-xs flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white">Starter</h3>
                  <p className="text-xs sm:text-sm text-stone-500">For small squads and independent builders.</p>
                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-4xl font-extrabold text-stone-900 dark:text-white">$0</span>
                    <span className="text-xs text-stone-500">/ month</span>
                  </div>

                  <ul className="space-y-3 pt-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#006b2c]" />
                      <span>Unlimited tasks & Kanban boards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#006b2c]" />
                      <span>Up to 3 active projects</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#006b2c]" />
                      <span className="font-semibold text-emerald-800 dark:text-emerald-300">24/7 AI Voice Support (Standard)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#006b2c]" />
                      <span>7-day activity history</span>
                    </li>
                  </ul>
                </div>

                <Link
                  to="/register"
                  className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-white font-semibold text-xs transition-colors"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Pro Tier */}
              <div className="p-8 rounded-2xl bg-white/95 dark:bg-[#111815]/95 backdrop-blur-xs border-2 border-[#006b2c] shadow-lg shadow-emerald-950/10 relative flex flex-col justify-between space-y-6">
                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#006b2c] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  Popular
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white">Pro Team</h3>
                  <p className="text-xs sm:text-sm text-stone-500">For fast-shipping teams and agile companies.</p>
                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-4xl font-extrabold text-stone-900 dark:text-white">$12</span>
                    <span className="text-xs text-stone-500">/ user / month</span>
                  </div>

                  <ul className="space-y-3 pt-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#006b2c]" />
                      <span className="font-semibold">Unlimited projects & workspaces</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#006b2c]" />
                      <span className="font-semibold text-[#006b2c] dark:text-emerald-400">24/7 Priority AI Voice Agent workflows</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#006b2c]" />
                      <span>Custom RBAC roles & permissions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#006b2c]" />
                      <span>Unlimited audit logs & activity history</span>
                    </li>
                  </ul>
                </div>

                <Link
                  to="/register"
                  className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#006b2c] hover:bg-[#00873a] text-white font-semibold text-xs shadow-sm transition-all"
                >
                  Start 14-Day Free Trial
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            CLEAN FINAL CALL TO ACTION
            ========================================================= */}
        <section className="py-20 bg-gradient-to-br from-[#005a25] via-[#006b2c] to-[#01471d] text-white relative overflow-hidden shadow-xl">
          {/* Subtle Ambient Glow inside CTA */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to bring velocity to your squad?
            </h2>
            <p className="text-base text-emerald-100 max-w-lg mx-auto">
              Set up your workspace in 2 minutes. Backed by 24/7 AI Voice Support anytime you need answers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white text-[#006b2c] font-bold text-sm shadow-lg hover:bg-emerald-50 transition-colors"
              >
                Start for Free
              </Link>
              <button
                type="button"
                onClick={() => setIsDemoModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold text-sm border border-emerald-600 transition-colors cursor-pointer"
              >
                Explore Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================
          MINIMAL FOOTER
          ========================================================= */}
      <footer className="py-12 border-t border-stone-200/80 dark:border-emerald-950/80 bg-[#f7faf8] dark:bg-[#0c120f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#006b2c] text-white flex items-center justify-center text-[10px]">
              <Layers className="w-3 h-3" />
            </div>
            <span className="font-bold text-stone-800 dark:text-stone-200">TaskFlow</span>
            <span>•</span>
            <span>24/7 AI Voice Support Enabled</span>
          </div>

          <p>© 2026 TaskFlow. Clean, high-velocity project management.</p>
        </div>
      </footer>

      {/* =========================================================
          DEMO ACCOUNTS MODAL (Alex & Sarah 1-Click Login)
          ========================================================= */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 border border-stone-200 dark:border-stone-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#006b2c] dark:text-emerald-400" />
                <h3 className="font-bold text-base text-stone-900 dark:text-white">
                  Instant Demo Accounts
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDemoModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400">
              Select a preconfigured demo account to test role permissions and live Kanban boards immediately:
            </p>

            <div className="space-y-3">
              {/* Alex Morgan Admin */}
              <button
                type="button"
                disabled={demoLoadingUser !== null}
                onClick={() => handleQuickDemoLogin('alex@taskflow.dev', 'password123')}
                className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-stone-50 dark:bg-stone-850 text-left transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    AM
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-stone-900 dark:text-white">Alex Morgan</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">Admin Lead</span>
                    </div>
                    <span className="text-[11px] text-stone-500">alex@taskflow.dev • Full Workspace Ownership</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#006b2c] dark:text-emerald-400" />
              </button>

              {/* Sarah Chen Engineer */}
              <button
                type="button"
                disabled={demoLoadingUser !== null}
                onClick={() => handleQuickDemoLogin('sarah@taskflow.dev', 'password123')}
                className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-teal-500 dark:hover:border-teal-500 bg-stone-50 dark:bg-stone-850 text-left transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    SC
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-stone-900 dark:text-white">Sarah Chen</span>
                      <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 text-[10px] font-bold">Engineer</span>
                    </div>
                    <span className="text-[11px] text-stone-500">sarah@taskflow.dev • Kanban Execution</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
