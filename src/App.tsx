import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { UrgentDeadlinesBanner } from './components/UrgentDeadlinesBanner';

const DiscoverPage = React.lazy(() =>
  import('./pages/DiscoverPage').then((m) => ({ default: m.DiscoverPage }))
);
const ScholarshipDetailPage = React.lazy(() =>
  import('./pages/ScholarshipDetailPage').then((m) => ({ default: m.ScholarshipDetailPage }))
);
const ProfilePage = React.lazy(() =>
  import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const TrackerPage = React.lazy(() =>
  import('./pages/TrackerPage').then((m) => ({ default: m.TrackerPage }))
);
const DashboardPage = React.lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const ComparePage = React.lazy(() =>
  import('./pages/ComparePage').then((m) => ({ default: m.ComparePage }))
);
const NotFoundPage = React.lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

function RouteSkeletonFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-surface-2 rounded-[2px]" />
      <div className="h-4 w-96 bg-surface-2 rounded-[2px]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="h-64 bg-surface-2 rounded-[2px]" />
        <div className="h-64 bg-surface-2 rounded-[2px]" />
        <div className="h-64 bg-surface-2 rounded-[2px]" />
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const pageVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : -8 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        className="flex-1"
      >
        <Suspense fallback={<RouteSkeletonFallback />}>
          <Routes location={location}>
            <Route path="/" element={<DiscoverPage />} />
            <Route path="/scholarship/:id" element={<ScholarshipDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/tracker" element={<TrackerPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-bg text-text font-sans selection:bg-primary selection:text-primary-contrast transition-colors">
              <Navbar />
              <UrgentDeadlinesBanner />
              <AnimatedRoutes />
              <Footer />
            </div>
          </BrowserRouter>
        </ToastProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
