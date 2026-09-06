// src/components/layout/CommandPalette.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search,
  CheckSquare,
  FolderKanban,
  User,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { setCommandPaletteOpen } from '../../redux/slices/uiSlice.js';
import { openTaskDrawer } from '../../redux/slices/taskSlice.js';
import api from '../../services/api.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { Avatar } from '../ui/Avatar.jsx';

export const CommandPalette = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isCommandPaletteOpen } = useSelector((state) => state.ui);
  const { currentWorkspace } = useSelector((state) => state.workspace);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ tasks: [], projects: [], people: [] });
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 250);

  const inputRef = useRef(null);

  // Listen for global shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch(setCommandPaletteOpen(!isCommandPaletteOpen));
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        dispatch(setCommandPaletteOpen(false));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, isCommandPaletteOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setResults({ tasks: [], projects: [], people: [] });
    }
  }, [isCommandPaletteOpen]);

  // Execute real search on backend
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults({ tasks: [], projects: [], people: [] });
        return;
      }
      try {
        setIsLoading(true);
        const res = await api.get('/search', {
          params: {
            q: debouncedQuery,
            workspace: currentWorkspace?._id,
          },
        });
        if (res.data?.success) {
          setResults(res.data.data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isCommandPaletteOpen) {
      fetchResults();
    }
  }, [debouncedQuery, isCommandPaletteOpen, currentWorkspace]);

  if (!isCommandPaletteOpen) return null;

  const handleSelectTask = (taskId) => {
    dispatch(setCommandPaletteOpen(false));
    dispatch(openTaskDrawer(taskId));
  };

  const handleSelectProject = (projectId) => {
    dispatch(setCommandPaletteOpen(false));
    navigate(`/projects/${projectId}`);
  };

  const hasResults =
    results.tasks.length > 0 || results.projects.length > 0 || results.people.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => dispatch(setCommandPaletteOpen(false))}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden z-10">
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3 border-b border-stone-200 dark:border-stone-800">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tasks, projects, people..."
            className="w-full bg-transparent px-3 py-1 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => dispatch(setCommandPaletteOpen(false))}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-3">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-stone-400 animate-pulse">
              Searching TaskFlow workspace...
            </div>
          ) : !query ? (
            <div className="py-10 text-center">
              <Sparkles className="w-6 h-6 text-emerald-500 mx-auto mb-2 opacity-80" />
              <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Quick Navigation & Search
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                Start typing to search tasks, project milestones, or teammates.
              </p>
            </div>
          ) : !hasResults ? (
            <div className="py-12 text-center text-xs text-stone-400">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-4">
              {/* Projects */}
              {results.projects.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Projects
                  </div>
                  <div className="mt-1 space-y-1">
                    {results.projects.map((proj) => (
                      <button
                        key={proj._id}
                        type="button"
                        onClick={() => handleSelectProject(proj._id)}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-xs group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: proj.color || '#10b981' }}
                          />
                          <span className="font-medium text-stone-900 dark:text-stone-100 truncate">
                            {proj.name}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {results.tasks.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Tasks
                  </div>
                  <div className="mt-1 space-y-1">
                    {results.tasks.map((t) => (
                      <button
                        key={t._id}
                        type="button"
                        onClick={() => handleSelectTask(t._id)}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-xs group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <div className="truncate">
                            <span className="font-medium text-stone-900 dark:text-stone-100">
                              {t.title}
                            </span>
                            {t.project && (
                              <span className="ml-2 text-[10px] text-stone-400">
                                in {t.project.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 font-mono">
                          {t.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* People */}
              {results.people.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    People
                  </div>
                  <div className="mt-1 space-y-1">
                    {results.people.map((p) => (
                      <div
                        key={p._id}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-xs"
                      >
                        <Avatar name={p.name} src={p.avatar} size="xs" />
                        <div>
                          <p className="font-medium text-stone-900 dark:text-stone-100">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-stone-400">{p.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex items-center justify-between text-[11px] text-stone-400">
          <span>
            Press <kbd className="px-1 py-0.5 rounded bg-stone-200 dark:bg-stone-800 font-mono text-[10px]">ESC</kbd> to close
          </span>
          <span>TaskFlow Command Palette</span>
        </div>
      </div>
    </div>
  );
};
