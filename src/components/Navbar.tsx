import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  Bookmark, 
  KanbanSquare, 
  LayoutDashboard, 
  User, 
  Menu, 
  X,
  Compass,
  Moon,
  Sun,
  Columns
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { savedIds, trackerItems, profile, compareIds } = useApp();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const trackerCount = Object.keys(trackerItems).length;

  const navLinks = [
    { to: '/', label: 'Discover', icon: Compass },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tracker', label: 'Tracker', icon: KanbanSquare, badge: trackerCount > 0 ? trackerCount : undefined },
    { to: '/compare', label: 'Compare', icon: Columns, badge: compareIds.length > 0 ? compareIds.length : undefined },
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
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-primary text-primary-contrast px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md border-b border-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo & Brand */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary rounded-xl p-1"
              aria-label="Grantly Home"
            >
              <div className="w-11 h-11 rounded-xl bg-primary text-primary-contrast flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight text-primary">
                  GRANTLY
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted -mt-1">
                  Scholarships
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 min-h-[44px] ${
                      active
                        ? 'bg-primary text-primary-contrast shadow-xs'
                        : 'text-text hover:bg-surface-2'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-primary-contrast' : 'text-muted'}`} />
                    <span>{link.label}</span>
                    {link.badge !== undefined && (
                      <span 
                        className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                          active 
                            ? 'bg-primary-contrast/20 text-primary-contrast' 
                            : 'bg-surface-2 text-text border border-border'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions: Dark Mode toggle + Saved Pill + Profile button */}
            <div className="hidden md:flex items-center gap-2.5">
              
              {/* Dark Mode Toggle Button */}
              <button
                type="button"
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-xl border border-border bg-surface hover:bg-surface-2 text-text flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-accent" />
                ) : (
                  <Moon className="w-4 h-4 text-muted" />
                )}
              </button>

              {/* Saved items bookmark pill */}
              <Link
                to="/tracker"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-surface hover:bg-surface-2 text-text text-xs font-semibold shadow-2xs transition-all min-h-[44px]"
                title="Saved Scholarships"
                aria-label={`Saved scholarships (${savedIds.length})`}
              >
                <Bookmark className={`w-4 h-4 ${savedIds.length > 0 ? 'text-accent fill-accent' : 'text-muted'}`} />
                <span>Saved</span>
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-surface-2 text-[11px] font-bold border border-border">
                  {savedIds.length}
                </span>
              </Link>

              {/* Profile pill */}
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full border border-border bg-surface hover:bg-surface-2 transition-colors min-h-[44px]"
                aria-label="View or edit student profile"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20">
                  {profile.name?.trim() ? profile.name.charAt(0) : 'P'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-text leading-none">
                    {profile.name?.trim() ? profile.name.split(' ')[0] : 'Profile'}
                  </p>
                  <p className="text-[10px] text-primary font-medium leading-tight">
                    {profile.isOnboarded ? 'Match Active' : 'Set Up'}
                  </p>
                </div>
              </Link>

            </div>

            {/* Mobile Actions: Dark Mode toggle + Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="p-2 rounded-xl border border-border text-text"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-muted" />}
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl text-text hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-bg px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold min-h-[44px] ${
                    active 
                      ? 'bg-primary text-primary-contrast' 
                      : 'text-text hover:bg-surface-2'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== undefined && (
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      active ? 'bg-primary-contrast/20 text-primary-contrast' : 'bg-surface-2 text-text border border-border'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 text-text font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                  {profile.name?.trim() ? profile.name.charAt(0) : 'P'}
                </div>
                <div>
                  <p className="text-xs font-bold text-text">{profile.name?.trim() || 'My Profile'}</p>
                  <p className="text-[10px] text-muted">
                    {profile.isOnboarded ? `${profile.level} • ${profile.course}` : 'Set up your student profile'}
                  </p>
                </div>
              </Link>
              <div className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                Saved ({savedIds.length})
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
