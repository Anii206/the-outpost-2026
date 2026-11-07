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
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { savedIds, trackerItems, profile } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const trackerCount = Object.keys(trackerItems).length;

  const navLinks = [
    { to: '/', label: 'Discover', icon: Compass },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tracker', label: 'Tracker', icon: KanbanSquare, badge: trackerCount > 0 ? trackerCount : undefined },
    { to: '/profile', label: 'My Profile', icon: User, subtitle: profile.level },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#133E2B] rounded-xl p-1"
            aria-label="Grantly Home"
          >
            <div className="w-11 h-11 rounded-xl bg-[#133E2B] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-[#133E2B]">
                GRANTLY
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500 -mt-1">
                Scholarships
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-[#133E2B] text-white shadow-sm'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-300' : 'text-stone-500'}`} />
                  <span>{link.label}</span>
                  {link.badge !== undefined && (
                    <span 
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        active 
                          ? 'bg-emerald-800 text-emerald-100' 
                          : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Action / Saved bookmark pill */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/tracker"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-200 bg-white/80 hover:bg-white text-stone-800 text-sm font-medium shadow-xs transition-all hover:border-stone-300"
              title="Saved Scholarships"
              aria-label={`Saved scholarships (${savedIds.length})`}
            >
              <Bookmark className={`w-4 h-4 ${savedIds.length > 0 ? 'text-amber-600 fill-amber-500' : 'text-stone-400'}`} />
              <span className="text-xs font-semibold text-stone-700">Saved</span>
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-stone-100 text-[11px] font-bold text-stone-800">
                {savedIds.length}
              </span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#133E2B] flex items-center justify-center text-xs font-bold">
                {profile.name?.trim() ? profile.name.charAt(0) : 'P'}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-stone-800 leading-none">{profile.name?.trim() ? profile.name.split(' ')[0] : 'Profile'}</p>
                <p className="text-[10px] text-emerald-800 font-medium leading-tight">{profile.isOnboarded ? 'Match Active' : 'Set Up'}</p>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 focus:outline-none focus:ring-2 focus:ring-[#133E2B]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium ${
                  active ? 'bg-[#133E2B] text-white' : 'text-stone-800 hover:bg-stone-200/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    active ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-800'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-stone-800 font-medium"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#133E2B] flex items-center justify-center font-bold">
                {profile.name?.trim() ? profile.name.charAt(0) : 'P'}
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900">{profile.name?.trim() || 'My Profile'}</p>
                <p className="text-xs text-stone-500">{profile.isOnboarded ? `${profile.level} • ${profile.course}` : 'Set up your student profile'}</p>
              </div>
            </Link>
            <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900">
              Saved ({savedIds.length})
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
