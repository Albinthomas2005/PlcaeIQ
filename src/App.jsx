import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PlacementProvider, usePlacement } from './context/PlacementContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { CompanyDashboard } from './pages/CompanyDashboard';
import { JobsPage } from './pages/JobsPage';
import { ResultsPage } from './pages/ResultsPage';
import { LoginPage } from './pages/LoginPage';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

const ToastNotification = () => {
  const { toast } = usePlacement();
  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-600 text-white shadow-emerald-500/30',
    error: 'bg-rose-600 text-white shadow-rose-500/30',
    warning: 'bg-amber-500 text-white shadow-amber-500/30',
    info: 'bg-indigo-600 text-white shadow-indigo-500/30',
  }[toast.type] || 'bg-slate-900 text-white shadow-slate-900/30';

  const Icon = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }[toast.type] || Info;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-md">
      <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold ${bgStyles}`}>
        <Icon className="w-4 h-4 shrink-0" />
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

// Guard: redirects to /login if user is not logged in with the required role
const ProtectedRoute = ({ children, requiredRole }) => {
  const { authSession } = usePlacement();
  if (!authSession?.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && authSession.role !== requiredRole) {
    // Wrong role — send them to their own dashboard or login
    const roleRedirect = authSession.role === 'student' ? '/student'
      : authSession.role === 'officer' ? '/officer'
      : authSession.role === 'company' ? '/company'
      : '/login';
    return <Navigate to={roleRedirect} replace />;
  }
  return children;
};

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fe] dark:bg-[#0a0c13] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/student" element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/officer" element={
            <ProtectedRoute requiredRole="officer">
              <OfficerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/company" element={
            <ProtectedRoute requiredRole="company">
              <CompanyDashboard />
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ToastNotification />
    </div>
  );
};

function App() {
  return (
    <PlacementProvider>
      <Router>
        <AppLayout />
      </Router>
    </PlacementProvider>
  );
}

export default App;
