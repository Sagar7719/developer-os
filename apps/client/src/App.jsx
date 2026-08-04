import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { ScrollToTop } from './components/ScrollToTop.jsx';
import { PageFallback } from './components/PageFallback.jsx';
import { MaintenanceGuard } from './components/MaintenanceGuard.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';

// Eagerly loaded core public page
import { Home } from './pages/Home.jsx';

// Lazy-loaded secondary pages & Admin CMS modules
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const ProjectAdmin = lazy(() => import('./pages/admin/ProjectAdmin.jsx'));
const SkillAdmin = lazy(() => import('./pages/admin/SkillAdmin.jsx'));
const ExperienceAdmin = lazy(() => import('./pages/admin/ExperienceAdmin.jsx'));
const ContactAdmin = lazy(() => import('./pages/admin/ContactAdmin.jsx'));
const SettingsAdmin = lazy(() => import('./pages/admin/SettingsAdmin.jsx'));
const AILogsAdmin = lazy(() => import('./pages/admin/AILogsAdmin.jsx'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <Suspense fallback={<PageFallback />}>
              <Routes>
                {/* Public Portfolio Website Routes */}
                <Route
                  path="/*"
                  element={
                    <MaintenanceGuard>
                      <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
                        <Navbar />
                        <main className="flex-1">
                          <Suspense fallback={<PageFallback />}>
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/projects" element={<ProjectsPage />} />
                              <Route path="/contact" element={<ContactPage />} />
                              <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                          </Suspense>
                        </main>
                        <Footer />
                      </div>
                    </MaintenanceGuard>
                  }
                />

                {/* Admin CMS Authentication Route */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected Admin CMS Dashboard Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="projects" element={<ProjectAdmin />} />
                  <Route path="skills" element={<SkillAdmin />} />
                  <Route path="experience" element={<ExperienceAdmin />} />
                  <Route path="messages" element={<ContactAdmin />} />
                  <Route path="settings" element={<SettingsAdmin />} />
                  <Route path="ai-logs" element={<AILogsAdmin />} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
