import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { Home } from './pages/Home.jsx';
import { ProjectsPage } from './pages/ProjectsPage.jsx';

// Admin CMS Components
import { AdminLogin } from './pages/admin/AdminLogin.jsx';
import { AdminLayout } from './components/admin/AdminLayout.jsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { ProjectAdmin } from './pages/admin/ProjectAdmin.jsx';
import { SkillAdmin } from './pages/admin/SkillAdmin.jsx';
import { ExperienceAdmin } from './pages/admin/ExperienceAdmin.jsx';

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Portfolio Website Routes */}
            <Route
              path="/*"
              element={
                <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/projects" element={<ProjectsPage />} />
                      <Route path="*" element={<Home />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
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
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
