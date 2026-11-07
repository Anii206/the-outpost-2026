import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookmarkSimple } from '@phosphor-icons/react/dist/csr/BookmarkSimple';
import { Kanban } from '@phosphor-icons/react/dist/csr/Kanban';
import { SquaresFour } from '@phosphor-icons/react/dist/csr/SquaresFour';
import { User } from '@phosphor-icons/react/dist/csr/User';
import { List } from '@phosphor-icons/react/dist/csr/List';
import { X } from '@phosphor-icons/react/dist/csr/X';
import { Compass } from '@phosphor-icons/react/dist/csr/Compass';
import { Moon } from '@phosphor-icons/react/dist/csr/Moon';
import { Sun } from '@phosphor-icons/react/dist/csr/Sun';
import { ArrowsLeftRight } from '@phosphor-icons/react/dist/csr/ArrowsLeftRight';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/csr/MagnifyingGlass';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const CommandPalette = React.lazy(() =>
  import('./CommandPalette').then((m) => ({ default: m.CommandPalette }))
);

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { savedIds, trackerItems, profile, compareIds } = useApp();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const trackerCount = Object.keys(trackerItems).length;

  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const navLinks = [
    { to: '/', label: 'Discover', icon: Compass },
    { to: '/dashboard', label: 'Dashboard', icon: SquaresFour },
    { to: '/tracker', label: 'Tracker', icon: Kanban, badge: trackerCount > 0 ? trackerCount : undefined },
    { to: '/compare', label: 'Compare', icon: ArrowsLeftRight, badge: compareIds.length > 0 ? compareIds.length : undefined },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 bg-primary text-primary-contrast px-3 py-1.5 rounded-[2px] font-sans text-xs uppercase tracking-wider font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>

      {/* Global Command Palette (Ctrl+K) */}
      {commandPaletteOpen && (
        <React.Suspense fallback={null}>
          <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
        </React.Suspense>
      )}

      <header className="bg-bg text-text transition-colors">
        {/* Top Newspaper Masthead Strip */}
        <div className="border-b border-border bg-surface/50 text-xs py-1.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden text-muted text-[11px] font-mono tracking-tight">
              <span className="font-semibold text-text uppercase shrink-0 truncate max-w-[180px] sm:max-w-none">{todayFormatted}</span>
              <span className="hidden sm:inline text-border">/</span>
              <span className="hidden sm:inline truncate">An independent scholarship gazette</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Command Palette Trigger */}
              <button
                type="button"
                onClick={() => setCommandPaletteOpen(true)}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-[2px] border border-border bg-surface hover:bg-surface-2 text-muted hover:text-text text-[11px] transition-colors focus-visible:outline-none"
                aria-label="Open command palette (Ctrl+K)"
              >
                <MagnifyingGlass size={13} className="text-muted" />
                <span className="font-sans">Search Gazette</span>
                <kbd className="font-mono text-[9px] px-1 py-0.5 rounded-[2px] bg-surface-2 border border-border">Ctrl+K</kbd>
              </button>

              {/* Theme Switcher */}
              <button
                type="button"
                onClick={toggleDarkMode}
                className="flex items-center gap-1.5 px-2 py-1 rounded-[2px] border border-border bg-surface hover:bg-surface-2 text-text text-[11px] transition-colors focus-visible:outline-none"
                aria-label={isDarkMode ? 'Switch to light broadsheet' : 'Switch to night edition'}
              >
                {isDarkMode ? (
                  <>
                    <Sun size={13} className="text-accent" />
                    <span className="hidden md:inline font-mono">Day</span>
                  </>
                ) : (
                  <>
                    <Moon size={13} className="text-muted" />
                    <span className="hidden md:inline font-mono">Night</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Newspaper Center Masthead Wordmark */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 md:py-5">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex flex-col group focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-[2px]"
              aria-label="Grantly Home"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-text leading-none group-hover:text-primary transition-colors">
                  THE GRANTLY GAZETTE
                </span>
                <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-accent" />
              </div>
              <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-muted mt-0.5 sm:mt-1 font-semibold">
                An independent scholarship gazette • Est. 2026
              </p>
            </Link>

            {/* Quick Status Pill (Saved & Profile) */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/tracker"
                className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] border border-border bg-surface hover:bg-surface-2 text-text text-xs transition-colors"
                aria-label={`Saved scholarships (${savedIds.length})`}
              >
                <BookmarkSimple size={15} className={savedIds.length > 0 ? 'text-accent fill-accent' : 'text-muted'} />
                <span className="font-medium">Docket</span>
                <span className="font-mono text-[11px] font-bold px-1.5 py-0.2 rounded-[2px] bg-surface-2 border border-border">
                  {savedIds.length}
                </span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-[2px] border border-border bg-surface hover:bg-surface-2 transition-colors"
                aria-label="Student profile status"
              >
                <div className="w-5 h-5 rounded-[2px] bg-primary text-primary-contrast flex items-center justify-center text-[10px] font-bold font-mono">
                  {profile.isOnboarded && profile.name?.trim() ? profile.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold leading-none text-text">
                    {profile.isOnboarded && profile.name?.trim() ? profile.name.split(' ')[0] : 'Profile'}
                  </p>
                  <p className="text-[10px] text-muted font-medium mt-0.5">
                    {profile.isOnboarded ? 'Dossier Set' : 'Create profile'}
                  </p>
                </div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setCommandPaletteOpen(true)}
                className="p-2 border border-border rounded-[2px] text-muted hover:text-text"
                aria-label="Search"
              >
                <MagnifyingGlass size={18} />
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 border border-border rounded-[2px] text-text hover:bg-surface-2 focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <List size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Double Rule Masthead Navigation Bar */}
        <div className="border-y-2 border-double border-border-strong bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="hidden lg:flex items-center justify-between text-xs tracking-wider uppercase font-semibold font-sans" aria-label="Main Navigation">
              <div className="flex items-center">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-2 px-4 py-3.5 border-r border-border transition-colors min-h-[44px] relative ${
                        active
                          ? 'text-primary bg-surface-2 font-bold'
                          : 'text-text hover:bg-surface-2/60'
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon size={15} className={active ? 'text-primary' : 'text-muted'} />
                      <span>{link.label}</span>
                      {link.badge !== undefined && (
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-[2px] bg-primary text-primary-contrast font-bold">
                          {link.badge}
                        </span>
                      )}
                      {active && (
                        <motion.span
                          layoutId="activeNavUnderline"
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                          className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary z-10"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 text-[11px] text-muted normal-case font-mono py-2">
                <span>Free & Open Access for Indian Scholars</span>
              </div>
            </nav>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-border bg-surface px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-[2px] text-sm font-medium min-h-[44px] ${
                    active ? 'bg-primary text-primary-contrast' : 'text-text hover:bg-surface-2'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== undefined && (
                    <span className={`font-mono text-xs px-2 py-0.5 rounded-[2px] ${
                      active ? 'bg-primary-contrast/20 text-primary-contrast' : 'bg-surface-2 text-text border border-border'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </header>
    </>
  );
};
