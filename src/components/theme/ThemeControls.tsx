'use client';

import { useState } from 'react';
import { Moon, Palette, Sun, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/src/contexts/ThemeContext';

const colorFields = [
  ['primary', 'Primary Color'],
  ['secondary', 'Secondary Color'],
  ['accent', 'Accent Color'],
  ['background', 'Background Color'],
  ['text', 'Text Color'],
] as const;

export default function ThemeControls() {
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const { theme, setTheme, customColors, updateCustomColors, resetCustomColors } = useTheme();

  const selectTheme = (nextTheme: typeof theme) => {
    setTheme(nextTheme);
    setThemeDropdownOpen(false);
    if (nextTheme !== 'multi-color') setCustomizerOpen(false);
  };

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setThemeDropdownOpen((open) => !open)}
          className="theme-control rounded-lg p-2 transition-colors"
          aria-label="Choose theme"
          aria-expanded={themeDropdownOpen}
        >
          {theme === 'light' ? (
            <Sun className="h-5 w-5" />
          ) : theme === 'dark' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Palette className="h-5 w-5" />
          )}
        </button>

        {themeDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="theme-panel absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border shadow-xl"
          >
            <button
              type="button"
              onClick={() => selectTheme('light')}
              className={`theme-menu-item ${theme === 'light' ? 'is-active' : ''}`}
            >
              <Sun className="h-4 w-4" /> Light Mode
            </button>
            <button
              type="button"
              onClick={() => selectTheme('dark')}
              className={`theme-menu-item ${theme === 'dark' ? 'is-active' : ''}`}
            >
              <Moon className="h-4 w-4" /> Dark Mode
            </button>
            <button
              type="button"
              onClick={() => selectTheme('multi-color')}
              className={`theme-menu-item ${theme === 'multi-color' ? 'is-active' : ''}`}
            >
              <Palette className="h-4 w-4" /> Multi-Color
            </button>
            {theme === 'multi-color' && (
              <button
                type="button"
                onClick={() => {
                  setCustomizerOpen((open) => !open);
                  setThemeDropdownOpen(false);
                }}
                className="theme-menu-item border-t"
              >
                <Palette className="h-4 w-4" /> Customize Colors
              </button>
            )}
          </motion.div>
        )}
      </div>

      {customizerOpen && theme === 'multi-color' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="theme-panel fixed right-4 top-20 z-50 w-80 rounded-2xl border p-6 shadow-2xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Customize Colors</h3>
            <button
              type="button"
              onClick={() => setCustomizerOpen(false)}
              className="theme-control rounded-lg p-1"
              aria-label="Close color customizer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-5">
            {colorFields.map(([field, label]) => (
              <div key={field}>
                <label htmlFor={`theme-${field}`} className="theme-label mb-2 block text-sm font-medium">
                  {label}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    aria-label={`${label} picker`}
                    type="color"
                    value={customColors[field]}
                    onChange={(event) => updateCustomColors({ [field]: event.target.value })}
                    className="h-10 w-12 cursor-pointer rounded-lg border-0"
                  />
                  <input
                    id={`theme-${field}`}
                    type="text"
                    value={customColors[field]}
                    onChange={(event) => updateCustomColors({ [field]: event.target.value })}
                    className="theme-input flex-1 rounded-lg border px-3 py-2 text-sm"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={resetCustomColors}
              className="theme-control mt-4 w-full rounded-xl px-4 py-3 text-sm font-medium"
            >
              Reset to Defaults
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
