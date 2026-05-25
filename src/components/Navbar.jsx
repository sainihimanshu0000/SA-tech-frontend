import React, { useState, useEffect, useRef } from 'react'
import { 
  IoSearchSharp, IoCartOutline, IoClose, IoMenu,
  IoPerson, IoLogOut, IoChevronDown, IoSunny,
  IoCalculator, IoLeaf, IoStorefront
} from 'react-icons/io5'
import { GiHamburgerMenu } from 'react-icons/gi'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import API from '../api/axios'
import NotificationBell from './NotificationBell'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  const { isAuthenticated, user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
    setShowDropdown(false)
  }, [location])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false)
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          const res = await API.get(`/products/search?q=${searchQuery}`)
          const products = res.data.products || res.data.data || res.data
          setSearchResults(Array.isArray(products) ? products.slice(0, 5) : [])
        } catch (err) {
          console.error('Search error:', err)
        }
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    setShowDropdown(false)
    navigate('/')
  }

  const mainNavLinks = [
    { path: '/products', label: 'Shop', icon: <IoStorefront className="text-purple-500" /> },
    { path: '/blog', label: 'Blog', icon: <IoLeaf className="text-orange-500" /> },
    { path: '/crop-advisory', label: 'Crop Advisory', icon: <IoLeaf className="text-green-500" /> },
  ]

  const servicesLinks = [
    { path: '/solar-services', label: '☀️ Solar Services' },
    { path: '/emi-calculator', label: '🧮 EMI Calculator' },
  ]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-soft'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">🌾</span>
            </div>
            <span className="font-bold text-xl text-gray-800 hidden sm:block group-hover:text-green-600 transition">
              AgroMart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {mainNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  location.pathname === link.path
                    ? 'bg-green-50 text-green-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for seeds, fertilizers, tools..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
              />
              <IoSearchSharp className="absolute left-3 top-2.5 text-gray-400" size={18} />
              
              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border max-h-96 overflow-y-auto">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product._id || product.id || product.slug}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 transition"
                      onClick={() => setSearchQuery('')}
                    >
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                          🌾
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">₹{product.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Right Menu */}
          <div className="flex items-center gap-2">
            <NotificationBell />
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              <IoSearchSharp size={20} className="text-gray-700" />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full group">
              <IoCartOutline size={22} className="text-gray-700 group-hover:text-green-600 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative" ref={dropdownRef}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden lg:block text-sm font-medium">{user?.name}</span>
                    <IoChevronDown className={`hidden lg:block transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border py-1 animate-slide-in">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition"
                      >
                        <IoPerson className="text-gray-500" /> Profile
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition"
                        >
                          <IoStorefront className="text-gray-500" /> Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition w-full text-left text-red-600"
                      >
                        <IoLogOut className="text-red-500" /> Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="hidden sm:block px-4 py-2 text-gray-700 hover:text-green-600 transition font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              {mobileOpen ? <IoClose size={24} /> : <GiHamburgerMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden py-3 border-t animate-slide-in" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                autoFocus
              />
              <IoSearchSharp className="absolute left-3 top-2.5 text-gray-400" size={18} />
              
              {/* Mobile Search Results */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border max-h-80 overflow-y-auto">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product._id || product.id || product.slug}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 transition"
                      onClick={() => {
                        setSearchQuery('')
                        setSearchOpen(false)
                      }}
                    >
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                          🌾
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">₹{product.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t animate-slide-in">
            <div className="flex flex-col gap-1">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    location.pathname === link.path
                      ? 'bg-green-50 text-green-600 font-medium'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Services Section Mobile */}
              <div className="px-4 py-2 mt-2">
                <p className="text-xs font-semibold text-gray-500 uppercase">Services</p>
              </div>
              {servicesLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{link.label}</span>
                </Link>
              ))}

              <div className="border-t my-2"></div>

              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2">
                    <p className="text-sm text-gray-500">Logged in as</p>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    <IoPerson className="text-gray-500" /> Profile
                  </Link>
                  <Link
                    to="/cart"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    <IoCartOutline className="text-gray-500" /> Cart ({cartCount})
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="text-gray-500">💝</span> Wishlist
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileOpen(false)}
                    >
                      <IoStorefront className="text-gray-500" /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg text-left text-red-600 w-full"
                  >
                    <IoLogOut className="text-red-500" /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4">
                  <Link
                    to="/login"
                    className="block text-center py-2 text-gray-700 hover:text-green-600 transition font-medium border rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-center py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}