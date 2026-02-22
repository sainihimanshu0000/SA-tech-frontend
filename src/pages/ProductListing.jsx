import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, Badge } from '../components/UI'
import ProductCard from '../components/ProductCard'
import API from '../api/axios'
import { 
  IoFilterSharp, IoClose, IoSearch, IoArrowUp, 
  IoArrowDown, IoStar, IoGrid, IoList,
  IoChevronDown, IoChevronUp, IoHeart, IoHeartOutline,
  IoLeaf, IoFlask, IoSunny, IoWater, IoFlash,
  IoPricetag, IoBag, IoTime, IoLocation
} from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'

// Skeleton Loader Component
const ProductSkeleton = ({ count = 6, variant = 'grid' }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className={`bg-white rounded-xl shadow-md overflow-hidden animate-pulse ${
            variant === 'list' ? 'flex' : ''
          }`}
        >
          <div className={`${variant === 'list' ? 'w-48 h-48' : 'h-48'} bg-gray-200`}></div>
          <div className="p-4 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </>
  )
}

// Category Icon Mapping
const getCategoryIcon = (category) => {
  const icons = {
    plants: '🌱',
    seeds: '🪴',
    fertilizers: '🧪',
    'bio waste': '♻️',
    tools: '🛠️',
    solar: <IoSunny className="inline" />,
    seeds: <IoLeaf className="inline" />,
    fertilizers: <IoFlask className="inline" />,
    irrigation: <IoWater className="inline" />,
    equipment: <IoFlash className="inline" />
  }
  return icons[category?.toLowerCase()] || '📦'
}

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // State
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [viewMode, setViewMode] = useState('grid')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
  
  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sort') || 'newest',
    priceRange: {
      min: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')) : 0,
      max: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')) : 100000
    },
    rating: searchParams.get('rating') ? parseInt(searchParams.get('rating')) : 0,
    inStock: searchParams.get('inStock') === 'true'
  })

  const [showFilters, setShowFilters] = useState({
    category: true,
    price: true,
    rating: true,
    availability: true
  })

  // Categories with counts
  const categories = [
    { name: 'plants', label: 'Plants', icon: '🌱', count: 24 },
    { name: 'seeds', label: 'Seeds', icon: '🌿', count: 156 },
    { name: 'fertilizers', label: 'Fertilizers', icon: '🧪', count: 89 },
    { name: 'bio waste', label: 'Bio Waste', icon: '♻️', count: 12 },
    { name: 'tools', label: 'Tools', icon: '🛠️', count: 45 },
    { name: 'solar', label: 'Solar Products', icon: '☀️', count: 34 },
    { name: 'irrigation', label: 'Irrigation', icon: '💧', count: 28 },
    { name: 'equipment', label: 'Equipment', icon: '⚙️', count: 67 }
  ]

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Top Rated' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetchProducts()
    updateURLParams()
  }, [page, filters])

  const updateURLParams = () => {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.search) params.set('search', filters.search)
    if (filters.sortBy !== 'newest') params.set('sort', filters.sortBy)
    if (filters.priceRange.min > 0) params.set('minPrice', filters.priceRange.min)
    if (filters.priceRange.max < 100000) params.set('maxPrice', filters.priceRange.max)
    if (filters.rating > 0) params.set('rating', filters.rating)
    if (filters.inStock) params.set('inStock', 'true')
    if (page > 1) params.set('page', page)
    
    setSearchParams(params, { replace: true })
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 12,
        ...(filters.category && { category: filters.category }),
        ...(filters.search && { search: filters.search }),
        ...(filters.sortBy && { sort: filters.sortBy }),
        ...(filters.priceRange.min > 0 && { minPrice: filters.priceRange.min }),
        ...(filters.priceRange.max < 100000 && { maxPrice: filters.priceRange.max }),
        ...(filters.rating > 0 && { rating: filters.rating }),
        ...(filters.inStock && { inStock: true })
      })

      const res = await API.get(`/products?${queryParams}`)
      setProducts(res.data.products || res.data.data || [])
      setPages(res.data.pages || res.data.totalPages || 1)
      setTotalProducts(res.data.total || res.data.totalProducts || 0)
      
      // Update price range from response if available
      if (res.data.priceRange) {
        setPriceRange(res.data.priceRange)
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      // Fallback data for demo
      setProducts([
        {
          _id: 1,
          name: 'Organic Tomato Seeds',
          price: 299,
          mrp: 399,
          rating: 4.5,
          reviews: 128,
          image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7e5b',
          category: 'seeds',
          inStock: true
        },
        {
          _id: 2,
          name: 'Solar Water Pump',
          price: 24999,
          mrp: 29999,
          rating: 4.8,
          reviews: 56,
          image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d',
          category: 'solar',
          inStock: true
        },
        {
          _id: 3,
          name: 'Organic Fertilizer',
          price: 599,
          mrp: 799,
          rating: 4.3,
          reviews: 89,
          image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449',
          category: 'fertilizers',
          inStock: true
        }
      ])
      setPages(3)
      setTotalProducts(45)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handlePriceRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { ...prev.priceRange, [type]: value }
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      sortBy: 'newest',
      priceRange: { min: 0, max: 100000 },
      rating: 0,
      inStock: false
    })
    setPage(1)
  }

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeFilterCount = [
    filters.category,
    filters.search,
    filters.sortBy !== 'newest',
    filters.priceRange.min > 0,
    filters.priceRange.max < 100000,
    filters.rating > 0,
    filters.inStock
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">All Products</h1>
          <p className="text-gray-600">
            <span className="font-semibold text-green-600">{totalProducts}</span> products found
            {filters.category && (
              <>
                {' '}in <span className="font-semibold capitalize">{filters.category}</span>
              </>
            )}
          </p>
        </motion.div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {(mobileFilterOpen || window.innerWidth >= 768) && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`
                  fixed md:static inset-0 z-50 md:z-auto bg-white md:bg-transparent
                  w-80 md:w-64 p-6 md:p-0 overflow-y-auto
                  ${!mobileFilterOpen && 'hidden md:block'}
                `}
              >
                <div className="md:bg-white md:rounded-xl md:shadow-lg md:p-6 h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 md:hidden">
                    <h3 className="font-bold text-xl">Filters</h3>
                    <button 
                      onClick={() => setMobileFilterOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                      <IoClose size={24} />
                    </button>
                  </div>

                  {/* Active Filters */}
                  {activeFilterCount > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Active Filters ({activeFilterCount})</span>
                        <button
                          onClick={clearFilters}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {filters.category && (
                          <Badge className="bg-blue-100 text-blue-700 flex items-center gap-1">
                            {filters.category}
                            <button 
                              onClick={() => handleFilterChange('category', '')}
                              className="ml-1 hover:text-blue-900"
                            >
                              ✕
                            </button>
                          </Badge>
                        )}
                        {filters.priceRange.min > 0 && (
                          <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                            Min: ₹{filters.priceRange.min}
                            <button 
                              onClick={() => handlePriceRangeChange('min', 0)}
                              className="ml-1 hover:text-green-900"
                            >
                              ✕
                            </button>
                          </Badge>
                        )}
                        {filters.priceRange.max < 100000 && (
                          <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                            Max: ₹{filters.priceRange.max}
                            <button 
                              onClick={() => handlePriceRangeChange('max', 100000)}
                              className="ml-1 hover:text-green-900"
                            >
                              ✕
                            </button>
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Search */}
                  <div className="mb-6">
                    <div className="relative">
                      <IoSearch className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6 border-b pb-4">
                    <button
                      onClick={() => setShowFilters(prev => ({ ...prev, category: !prev.category }))}
                      className="flex items-center justify-between w-full mb-3"
                    >
                      <h4 className="font-semibold text-gray-800">Category</h4>
                      {showFilters.category ? <IoChevronUp /> : <IoChevronDown />}
                    </button>
                    
                    <AnimatePresence>
                      {showFilters.category && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <button
                            onClick={() => handleFilterChange('category', '')}
                            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition ${
                              !filters.category ? 'bg-green-600 text-white' : 'hover:bg-gray-100'
                            }`}
                          >
                            <span>All Products</span>
                            <span className="text-sm opacity-75">{totalProducts}</span>
                          </button>
                          
                          {categories.map(cat => (
                            <button
                              key={cat.name}
                              onClick={() => handleFilterChange('category', cat.name)}
                              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition capitalize ${
                                filters.category === cat.name ? 'bg-green-600 text-white' : 'hover:bg-gray-100'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span>{cat.icon}</span>
                                {cat.label}
                              </span>
                              <span className="text-sm opacity-75">{cat.count}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Price Range Filter */}
                  <div className="mb-6 border-b pb-4">
                    <button
                      onClick={() => setShowFilters(prev => ({ ...prev, price: !prev.price }))}
                      className="flex items-center justify-between w-full mb-3"
                    >
                      <h4 className="font-semibold text-gray-800">Price Range</h4>
                      {showFilters.price ? <IoChevronUp /> : <IoChevronDown />}
                    </button>
                    
                    <AnimatePresence>
                      {showFilters.price && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-4 overflow-hidden"
                        >
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">
                              Min: <span className="font-semibold">₹{filters.priceRange.min}</span>
                            </label>
                            <input
                              type="range"
                              min={priceRange.min}
                              max={priceRange.max}
                              value={filters.priceRange.min}
                              onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value))}
                              className="w-full accent-green-600"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">
                              Max: <span className="font-semibold">₹{filters.priceRange.max}</span>
                            </label>
                            <input
                              type="range"
                              min={priceRange.min}
                              max={priceRange.max}
                              value={filters.priceRange.max}
                              onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value))}
                              className="w-full accent-green-600"
                            />
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={filters.priceRange.min}
                              onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value) || 0)}
                              className="w-1/2 px-3 py-2 border-2 rounded-lg focus:border-green-500 outline-none"
                              placeholder="Min"
                            />
                            <input
                              type="number"
                              value={filters.priceRange.max}
                              onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value) || 100000)}
                              className="w-1/2 px-3 py-2 border-2 rounded-lg focus:border-green-500 outline-none"
                              placeholder="Max"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Rating Filter */}
                  <div className="mb-6 border-b pb-4">
                    <button
                      onClick={() => setShowFilters(prev => ({ ...prev, rating: !prev.rating }))}
                      className="flex items-center justify-between w-full mb-3"
                    >
                      <h4 className="font-semibold text-gray-800">Minimum Rating</h4>
                      {showFilters.rating ? <IoChevronUp /> : <IoChevronDown />}
                    </button>
                    
                    <AnimatePresence>
                      {showFilters.rating && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          {[4, 3, 2, 1].map(rating => (
                            <button
                              key={rating}
                              onClick={() => handleFilterChange('rating', rating)}
                              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition ${
                                filters.rating === rating ? 'bg-green-600 text-white' : 'hover:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <IoStar
                                    key={i}
                                    className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                  />
                                ))}
                              </div>
                              <span>& Up</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Availability Filter */}
                  <div className="mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className="text-sm font-medium">In Stock Only</span>
                    </label>
                  </div>

                  {/* Apply Filters Button (Mobile) */}
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full md:hidden bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-4 mb-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Mobile Filter Button */}
                <button
                  className="md:hidden flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  onClick={() => setMobileFilterOpen(true)}
                >
                  <IoFilterSharp /> Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-white text-green-600 px-2 py-0.5 rounded-full text-xs font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Results Count (Mobile) */}
                <span className="text-sm text-gray-600 md:hidden">
                  Showing <span className="font-semibold">{products.length}</span> of {totalProducts}
                </span>

                {/* Sort By */}
                <div className="flex items-center gap-2 ml-auto md:ml-0">
                  <span className="text-sm text-gray-600 hidden sm:block">Sort by:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="px-3 py-2 border-2 rounded-lg focus:border-green-500 outline-none bg-white"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition ${
                      viewMode === 'grid' 
                        ? 'bg-white shadow-md text-green-600' 
                        : 'text-gray-600 hover:text-green-600'
                    }`}
                    title="Grid View"
                  >
                    <IoGrid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition ${
                      viewMode === 'list' 
                        ? 'bg-white shadow-md text-green-600' 
                        : 'text-gray-600 hover:text-green-600'
                    }`}
                    title="List View"
                  >
                    <IoList size={20} />
                  </button>
                </div>
              </div>

              {/* Active Filters Bar (Desktop) */}
              {activeFilterCount > 0 && (
                <div className="hidden md:flex items-center gap-2 mt-4 pt-4 border-t">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  {filters.category && (
                    <Badge className="bg-blue-100 text-blue-700">
                      Category: {filters.category}
                      <button 
                        onClick={() => handleFilterChange('category', '')}
                        className="ml-2 hover:text-blue-900"
                      >
                        ✕
                      </button>
                    </Badge>
                  )}
                  {filters.priceRange.min > 0 && (
                    <Badge className="bg-green-100 text-green-700">
                      Min: ₹{filters.priceRange.min}
                      <button 
                        onClick={() => handlePriceRangeChange('min', 0)}
                        className="ml-2 hover:text-green-900"
                      >
                        ✕
                      </button>
                    </Badge>
                  )}
                  {filters.priceRange.max < 100000 && (
                    <Badge className="bg-green-100 text-green-700">
                      Max: ₹{filters.priceRange.max}
                      <button 
                        onClick={() => handlePriceRangeChange('max', 100000)}
                        className="ml-2 hover:text-green-900"
                      >
                        ✕
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </motion.div>

            {/* Products Grid/List */}
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                <ProductSkeleton count={6} variant={viewMode} />
              </div>
            ) : products.length > 0 ? (
              <>
                <motion.div 
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                  }}
                  initial="hidden"
                  animate="visible"
                  className={`grid ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  } gap-6`}
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                    >
                      <ProductCard 
                        product={product} 
                        variant={viewMode === 'list' ? 'horizontal' : 'grid'}
                        isWishlisted={wishlist.includes(product._id)}
                        onWishlistToggle={() => toggleWishlist(product._id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(prev => Math.max(1, prev - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, pages) }).map((_, i) => {
                        let pageNum
                        if (pages <= 5) {
                          pageNum = i + 1
                        } else if (page <= 3) {
                          pageNum = i + 1
                        } else if (page >= pages - 2) {
                          pageNum = pages - 4 + i
                        } else {
                          pageNum = page - 2 + i
                        }
                        
                        return (
                          <button
                            key={i}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-lg font-semibold transition ${
                              pageNum === page
                                ? 'bg-green-600 text-white shadow-md'
                                : 'bg-white shadow hover:shadow-md text-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>
                    
                    <button
                      onClick={() => setPage(prev => Math.min(pages, prev + 1))}
                      disabled={page === pages}
                      className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-lg p-12 text-center"
              >
                <div className="text-8xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your criteria. Try adjusting your filters or search term.
                </p>
                <Button 
                  onClick={clearFilters}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
                >
                  Clear All Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all z-40"
            >
              <IoArrowUp size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}