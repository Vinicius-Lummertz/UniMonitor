import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CalendarPage } from './pages/CalendarPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { PomodoroPage } from './pages/PomodoroPage';
import { StatsPage } from './pages/StatsPage';
import { SettingsPage } from './pages/SettingsPage';
import { BottomNav } from './components/ui/BottomNav';
import { OnboardingTour } from './components/OnboardingTour';
import './index.css';

// Layout com Bottom Navigation
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="h-screen flex flex-col overflow-hidden" data-theme={user?.theme || 'default'}>
      <main className="flex-1 overflow-auto pb-16">
        {children}
      </main>
      <BottomNav />

      {/* Onboarding Tour for first-time users */}
      {user?.first_login && <OnboardingTour />}
    </div>
  );
};

// Protected Route
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        } />
        <Route path="/subjects" element={
          <ProtectedRoute>
            <SubjectsPage />
          </ProtectedRoute>
        } />
        <Route path="/pomodoro" element={
          <ProtectedRoute>
            <PomodoroPage />
          </ProtectedRoute>
        } />
        <Route path="/stats" element={
          <ProtectedRoute>
            <StatsPage />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
