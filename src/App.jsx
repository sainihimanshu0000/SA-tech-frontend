import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { useAuth } from './hooks/useAuth'
import { ErrorBoundary } from './components/ErrorBoundary' // Named import
import { ScrollToTop } from './components/ScrollToTop' // Named import
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductListing from './pages/ProductListing'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import SolarServices from './pages/SolarServices'
import EMICalculator from './pages/EMICalculator'
import CropAdvisory from './pages/CropAdvisory'
import WishlistPage from './pages/WishlistPage'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Subsidy from './pages/Subsidy'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Loading component
const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="relative inline-block">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-gray-600 mt-4">{message}</p>
    </div>
  </div>
)

// Analytics tracker component
const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view
    console.log('Page viewed:', location.pathname);
    // You can send to Google Analytics here
    // window.gtag('config', 'GA_MEASUREMENT_ID', { page_path: location.pathname });
  }, [location]);

  return null;
}

// Wrapper component to use auth hook inside AuthProvider
function AppContent() {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageViewTracker />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/solar-services" element={<SolarServices />} />
          <Route path="/emi-calculator" element={<EMICalculator />} />
          <Route path="/crop-advisory" element={<CropAdvisory />} />
          <Route path="/subsidy" element={<Subsidy />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protected Routes */}
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          
          {/* Auth Routes - Redirect if already authenticated */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" state={{ from: location }} replace /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/" state={{ from: location }} replace /> : <Register />} 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  )
}