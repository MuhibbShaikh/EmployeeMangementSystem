import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Leaves from './pages/Leaves';
import Attendance from './pages/Attendance';
import Payroll from './pages/Payroll';
import Profile from './pages/Profile';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const AppRoutes = () => {
  const { user, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              {isAdmin() ? <AdminDashboard /> : <EmployeeDashboard />}
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/employees"
        element={
          <PrivateRoute adminOnly>
            <Layout><Employees /></Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/departments"
        element={
          <PrivateRoute adminOnly>
            <Layout><Departments /></Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/leaves"
        element={
          <PrivateRoute>
            <Layout><Leaves /></Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/attendance"
        element={
          <PrivateRoute>
            <Layout><Attendance /></Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/payroll"
        element={
          <PrivateRoute adminOnly>
            <Layout><Payroll /></Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/salary"
        element={
          <PrivateRoute>
            <Layout><Payroll /></Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Layout><Profile /></Layout>
          </PrivateRoute>
        }
      />
      
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
