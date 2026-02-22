import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children, adminOnly = false, redirectTo = '/login' }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          {/* Background ring */}
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          {/* Spinning ring */}
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          {/* Optional loading text */}
          <p className="text-center text-gray-500 mt-4">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Check for admin access if required
  if (adminOnly && user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  // Render the protected component if authenticated and authorized
  return children;
};

// Optional: Higher-order component wrapper
export const withProtectedRoute = (WrappedComponent, options = {}) => {
  return function WithProtectedRouteProps(props) {
    return (
      <ProtectedRoute {...options}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
};