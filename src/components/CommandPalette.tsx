import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/csr/MagnifyingGlass';
import { Compass } from '@phosphor-icons/react/dist/csr/Compass';
import { Kanban } from '@phosphor-icons/react/dist/csr/Kanban';
import { SquaresFour } from '@phosphor-icons/react/dist/csr/SquaresFour';
import { User } from '@phosphor-icons/react/dist/csr/User';
import { ArrowsLeftRight } from '@phosphor-icons/react/dist/csr/ArrowsLeftRight';
import { Sun } from '@phosphor-icons/react/dist/csr/Sun';
import { Moon } from '@phosphor-icons/react/dist/csr/Moon';
import { ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight';
import { X } from '@phosphor-icons/react/dist/csr/X';
import { GraduationCap } from '@phosphor-icons/react/dist/csr/GraduationCap';
import { SCHOLARSHIPS } from '../data/scholarships';
import { useTheme } from '../context/ThemeContext';

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open: externalOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const { toggleDarkMode, isDarkMode } = useTheme();
  const navigate = useNavigate();

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = React.useCallback(
    (value: boolean) => {
      if (onOpenChange) onOpenChange(value);
      else setInternalOpen(value);
    },
    [onOpenChange]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  const handleSelect = (callback: () => void) => {
    setOpen(false);
    callback();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-[2px]"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Quick Command Palette"
    >
      <div
        className="w-full max-w-xl bg-surface border border-border rounded-[4px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Global Command Palette" className="w-full flex flex-col">
          {/* Header Bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface">
            <MagnifyingGlass size={18} className="text-muted shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Search schemes, institutions, pages (Ctrl+K)..."
              className="w-full bg-transparent text-text text-sm placeholder:text-muted focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 text-muted hover:text-text rounded-[2px] transition-colors"
              aria-label="Close command palette"
            >
              <X size={16} />
            </button>
          </div>

          {/* Results List */}
          <Command.List className="max-h-80 overflow-y-auto p-2 text-sm">
            <Command.Empty className="py-6 text-center text-xs uppercase tracking-wider text-muted font-sans">
              No matching scholarships or commands found.
            </Command.Empty>

            {/* Navigation Group */}
            <Command.Group
              heading="Gazette Navigation"
              className="px-2 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted"
            >
              <Command.Item
                onSelect={() => handleSelect(() => navigate('/'))}
                className="flex items-center justify-between px-3 py-2 rounded-[2px] cursor-pointer hover:bg-surface-2 aria-selected:bg-surface-2 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-text">
                  <Compass size={16} className="text-primary shrink-0" />
                  <span>Discover Scholarships</span>
                </div>
                <span className="text-[10px] uppercase font-mono text-muted">/</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => navigate('/dashboard'))}
                className="flex items-center justify-between px-3 py-2 rounded-[2px] cursor-pointer hover:bg-surface-2 aria-selected:bg-surface-2 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-text">
                  <SquaresFour size={16} className="text-primary shrink-0" />
                  <span>Executive Dashboard</span>
                </div>
                <span className="text-[10px] uppercase font-mono text-muted">/dashboard</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => navigate('/tracker'))}
                className="flex items-center justify-between px-3 py-2 rounded-[2px] cursor-pointer hover:bg-surface-2 aria-selected:bg-surface-2 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-text">
                  <Kanban size={16} className="text-primary shrink-0" />
                  <span>Application Docket (Tracker)</span>
                </div>
                <span className="text-[10px] uppercase font-mono text-muted">/tracker</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => navigate('/profile'))}
                className="flex items-center justify-between px-3 py-2 rounded-[2px] cursor-pointer hover:bg-surface-2 aria-selected:bg-surface-2 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-text">
                  <User size={16} className="text-primary shrink-0" />
                  <span>Student Profile & Eligibility Dossier</span>
                </div>
                <span className="text-[10px] uppercase font-mono text-muted">/profile</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => navigate('/compare'))}
                className="flex items-center justify-between px-3 py-2 rounded-[2px] cursor-pointer hover:bg-surface-2 aria-selected:bg-surface-2 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-text">
                  <ArrowsLeftRight size={16} className="text-primary shrink-0" />
                  <span>Side-by-Side Scheme Comparison</span>
                </div>
                <span className="text-[10px] uppercase font-mono text-muted">/compare</span>
              </Command.Item>
            </Command.Group>

            {/* Quick Actions */}
            <Command.Group
              heading="Actions"
              className="px-2 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-muted border-t border-border mt-2"
            >
              <Command.Item
                onSelect={() => handleSelect(toggleDarkMode)}
                className="flex items-center justify-between px-3 py-2 rounded-[2px] cursor-pointer hover:bg-surface-2 aria-selected:bg-surface-2 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-text">
                  {isDarkMode ? (
                    <Sun size={16} className="text-accent shrink-0" />
                  ) : (
                    <Moon size={16} className="text-primary shrink-0" />
                  )}
                  <span>Switch to {isDarkMode ? 'Broadsheet Light Mode' : 'Night Edition Dark Mode'}</span>
                </div>
                <span className="text-[10px] font-mono text-muted">Theme</span>
              </Command.Item>
            </Command.Group>

            {/* Top Scholarships */}
            <Command.Group
              heading="Gazette Scheme Directory"
              className="px-2 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-muted border-t border-border mt-2"
            >
              {SCHOLARSHIPS.map((scholarship) => (
                <Command.Item
                  key={scholarship.id}
                  value={`${scholarship.name} ${scholarship.provider} ${scholarship.category}`}
                  onSelect={() => handleSelect(() => navigate(`/scholarship/${scholarship.id}`))}
                  className="flex items-center justify-between px-3 py-2 rounded-[2px] cursor-pointer hover:bg-surface-2 aria-selected:bg-surface-2 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <GraduationCap size={16} className="text-muted shrink-0 group-hover:text-primary transition-colors" />
                    <div className="truncate">
                      <p className="text-text font-medium truncate text-xs sm:text-sm">{scholarship.name}</p>
                      <p className="text-[11px] text-muted truncate">{scholarship.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[11px] font-semibold text-primary">{scholarship.amountFormatted}</span>
                    <ArrowRight size={12} className="text-muted group-hover:text-text transition-colors" />
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          {/* Footer Bar */}
          <div className="px-4 py-2 border-t border-border bg-surface-2/60 flex items-center justify-between text-[11px] text-muted font-mono">
            <span>Use ↑↓ to navigate, Enter to select</span>
            <span>ESC to dismiss</span>
          </div>
        </Command>
      </div>
    </div>
  );
};
