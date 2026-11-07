import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { UrgentDeadlinesBanner } from './components/UrgentDeadlinesBanner';
import { DiscoverPage } from './pages/DiscoverPage';
import { ScholarshipDetailPage } from './pages/ScholarshipDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { TrackerPage } from './pages/TrackerPage';
import { DashboardPage } from './pages/DashboardPage';
import { ComparePage } from './pages/ComparePage';
import { NotFoundPage } from './pages/NotFoundPage';

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
        <Routes location={location}>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/scholarship/:id" element={<ScholarshipDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
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
