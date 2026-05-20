import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardLayout } from './pages/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { CompanyPage } from './pages/CompanyPage';
import { ComparePage } from './pages/ComparePage';
import { LoginPage } from './pages/LoginPage';
import { PricingPage } from './pages/PricingPage';
import { PaymentPage } from './pages/PaymentPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CaseStudiesPage } from './pages/CaseStudiesPage';
import { SavedPage } from './pages/SavedPage';
import { ContactPage } from './pages/ContactPage';

const ProtectedRoute = ({ children, requirePro = false }) => {
  const { user, isPro, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Syncing StartupIntel Session...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requirePro && !isPro) {
    return <Navigate to="/pricing" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Standalone pages (no sidebar) */}
          <Route path="/login" element={<LoginPage />} />

          {/* App shell with sidebar - Guest accessible */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="company/:slug" element={<CompanyPage />} />
            <Route path="compare" element={<ComparePage />} />
            <Route path="compare/:slug1/:slug2" element={<ComparePage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="analytics" element={<ProtectedRoute requirePro={true}><AnalyticsPage /></ProtectedRoute>} />
            <Route path="case-studies" element={<CaseStudiesPage />} />
            <Route path="saved" element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
