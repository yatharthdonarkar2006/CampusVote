import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import VotingPage from './pages/VotingPage';
import BoothLocatorPage from './pages/BoothLocatorPage';
import ProfilePage from './pages/ProfilePage';
import VotingHistoryPage from './pages/VotingHistoryPage';
import CandidateProfilesPage from './pages/CandidateProfilesPage';
import ElectionCalendarPage from './pages/ElectionCalendarPage';
import CandidateRegistrationPage from './pages/CandidateRegistrationPage';
import HelpSupportPage from './pages/HelpSupportPage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import CandidateManagementPage from './pages/admin/CandidateManagementPage';
import VoterApprovalPage from './pages/admin/VoterApprovalPage';
import ElectionResultsPage from './pages/admin/ElectionResultsPage';
import ElectionManagementPage from './pages/ElectionManagementPage';
import ResultsAnalyticsPage from './pages/ResultsAnalyticsPage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Main App Layout
const AppLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className={`transition-all duration-300 ease-in-out pt-16 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'} ml-0`}>
        <Routes>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/voting" element={
            <ProtectedRoute>
              <VotingPage />
            </ProtectedRoute>
          } />
          
          <Route path="/booth-locator" element={
            <ProtectedRoute>
              <BoothLocatorPage />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/voting-history" element={
            <ProtectedRoute>
              <VotingHistoryPage />
            </ProtectedRoute>
          } />
          
          <Route path="/candidates" element={
            <ProtectedRoute>
              <CandidateProfilesPage />
            </ProtectedRoute>
          } />
          
          <Route path="/elections" element={
            <ProtectedRoute>
              <ElectionCalendarPage />
            </ProtectedRoute>
          } />
          
          <Route path="/candidate-registration" element={
            <ProtectedRoute>
              <CandidateRegistrationPage />
            </ProtectedRoute>
          } />
          
          <Route path="/help" element={
            <ProtectedRoute>
              <HelpSupportPage />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/candidates" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CandidateManagementPage />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/voters" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <VoterApprovalPage />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/results" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ElectionResultsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/elections" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ElectionManagementPage />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/analytics" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ResultsAnalyticsPage />
            </ProtectedRoute>
          } />
          
          {/* Redirect to dashboard for authenticated users */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/register" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
