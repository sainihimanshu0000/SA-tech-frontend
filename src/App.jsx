import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { useAuth } from './hooks/useAuth'
import { ErrorBoundary } from './components/ErrorBoundary' // Named import
import { ScrollToTop } from './components/ScrollToTop' // Named import
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const Home = lazy(() => import('./pages/Home'))
const ProductListing = lazy(() => import('./pages/ProductListing'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const SolarServices = lazy(() => import('./pages/SolarServices'))
const Services = lazy(() => import('./pages/Services'))
const EMICalculator = lazy(() => import('./pages/EMICalculator'))
const CropAdvisory = lazy(() => import('./pages/CropAdvisory'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Subsidy = lazy(() => import('./pages/Subsidy'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))
const EcoPowerApp = lazy(() => import('./pages/EcoPowerApp'))
const Profile = lazy(() => import('./pages/Profile'))
const VendorDashboard = lazy(() => import('./pages/VendorDashboard'))
const VendorProducts = lazy(() => import('./pages/VendorProducts'))
const IoTDashboard = lazy(() => import('./pages/IoTDashboard'))
const BulkSimulator = lazy(() => import('./pages/BulkSimulator'))
const Subscriptions = lazy(() => import('./pages/Subscriptions'))

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
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const isEcoPowerPage = location.pathname === '/ecopower';

  if (loading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageViewTracker />
      <ScrollToTop />
      {!isEcoPowerPage && <Navbar />}
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/services" element={<Services />} />
            <Route path="/solar-services" element={<SolarServices />} />
            <Route path="/emi-calculator" element={<EMICalculator />} />
            <Route path="/crop-advisory" element={<CropAdvisory />} />
            <Route path="/subsidy" element={<Subsidy />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/ecopower" element={<EcoPowerApp />} />
            
            {/* Protected Routes */}
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            <Route path="/vendor/dashboard" element={<ProtectedRoute><VendorDashboard /></ProtectedRoute>} />
            <Route path="/vendor/products" element={<ProtectedRoute><VendorProducts /></ProtectedRoute>} />
            <Route path="/iot" element={<IoTDashboard />} />
            <Route path="/bulk-simulator" element={<BulkSimulator />} />
            <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
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
        </Suspense>
      </main>
      {!isEcoPowerPage && <Footer />}
      
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