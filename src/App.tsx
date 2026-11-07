import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DiscoverPage } from './pages/DiscoverPage';
import { ScholarshipDetailPage } from './pages/ScholarshipDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { TrackerPage } from './pages/TrackerPage';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 font-sans selection:bg-[#133E2B] selection:text-white">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<DiscoverPage />} />
              <Route path="/scholarship/:id" element={<ScholarshipDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/tracker" element={<TrackerPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
