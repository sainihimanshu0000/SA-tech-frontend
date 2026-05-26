import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/UI'
import { useAuth } from '../hooks/useAuth'
import { getAllProducts } from '../api/productsAPI'
import { getAllCategories } from '../api/categoriesAPI'
import { addToCart } from '../api/cartAPI'
import { addToWishlist, getWishlist, removeFromWishlist } from '../api/wishlistAPI'
import {
  IoArrowUp,
  IoBag,
  IoCart,
  IoChevronDown,
  IoChevronUp,
  IoClose,
  IoFilterSharp,
  IoFlash,
  IoGrid,
  IoHeart,
  IoHeartOutline,
  IoList,
  IoSearch,
  IoStar,
} from 'react-icons/io5'

const DEFAULT_PRICE_RANGE = { min: 0, max: 100000 }

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
]

const categoryIcons = {
  plants: '🌱',
  seeds: '🌿',
  fertilizers: '🧪',
  'bio waste': '♻️',
  tools: '🛠️',
  solar: '☀️',
  irrigation: '💧',
  equipment: '⚙️',
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

function getProductImage(product) {
  const primary = product?.images?.primary
  return product?.image || (typeof primary === 'string' ? primary : primary?.url) || product?.images?.thumbnails?.[0]
}

function getCategoryLabel(category) {
  if (!category) return 'Product'
  return category.name || category.label || category.slug || String(category)
}

function getCategoryValue(category) {
  if (!category) return ''
  return category.slug || category._id || category.name || ''
}

function Rating({ value = 0, count }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <IoStar
          key={index}
          className={index < Math.round(value || 0) ? 'text-yellow-400' : 'text-gray-300'}
          size={15}
        />
      ))}
      {count !== undefined && <span className="text-xs text-gray-500 ml-1">({count || 0})</span>}
    </div>
  )
}

function ProductSkeleton({ viewMode }) {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className={`bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden animate-pulse ${viewMode === 'list' ? 'sm:flex' : ''}`}>
          <div className={`${viewMode === 'list' ? 'sm:w-56 h-56' : 'h-60'} bg-gradient-to-br from-gray-100 to-gray-200`} />
          <div className="p-5 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-5" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </>
  )
}

function FilterSection({ title, open, onToggle, children }) {
  return (
    <div className="border-b border-gray-100 py-5 first:pt-0 last:border-b-0">
      <button type="button" onClick={onToggle} className="flex items-center justify-between w-full mb-3 group">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <span className="text-gray-400 group-hover:text-agro-primary transition">
          {open ? <IoChevronUp /> : <IoChevronDown />}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProductTile({ product, viewMode, wishlisted, actionLoading, onAddToCart, onBuyNow, onToggleWishlist }) {
  const imageUrl = getProductImage(product)
  const categoryName = getCategoryLabel(product.category)
  const productUrl = `/product/${product._id || product.slug}`
  const inStock = (product.stock || 0) > 0
  const discount = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : product.discount || 0

  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
      className={`group bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-hover transition overflow-hidden ${viewMode === 'list' ? 'sm:flex' : ''}`}
    >
      <Link to={productUrl} className={`relative block bg-agro-background overflow-hidden ${viewMode === 'list' ? 'sm:w-64 h-64' : 'h-60'}`}>
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🌱</div>
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold rounded-full px-3 py-1">{discount}% OFF</span>
        )}
        <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-agro-dark text-xs font-semibold rounded-full px-3 py-1">
          {categoryName}
        </span>
        {!inStock && (
          <span className="absolute inset-0 bg-black/45 text-white flex items-center justify-center font-bold">Out of Stock</span>
        )}
      </Link>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-agro-primary font-bold">{inStock ? 'Ready to ship' : 'Unavailable'}</p>
            <Link to={productUrl}>
              <h3 className="text-lg font-bold text-agro-dark line-clamp-2 hover:text-agro-primary transition">{product.name}</h3>
            </Link>
          </div>
          <button
            type="button"
            onClick={() => onToggleWishlist(product)}
            className={`p-2 rounded-full border transition ${wishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-500 hover:text-red-500'}`}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {wishlisted ? <IoHeart size={20} /> : <IoHeartOutline size={20} />}
          </button>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {product.description || 'Quality agriculture product for your farm needs.'}
        </p>
        <div className="mb-3">
          <Rating value={product.avgRating || product.rating} count={product.totalReviews || product.reviews?.length} />
        </div>

        <div className="mt-auto">
          <p className="text-2xl font-bold text-agro-primary">{formatCurrency(product.price)}</p>
          {product.mrp > product.price && <p className="text-sm text-gray-400 line-through">{formatCurrency(product.mrp)}</p>}
          <p className={`text-xs font-semibold mt-1 ${inStock ? 'text-green-600' : 'text-red-600'}`}>
            {inStock ? `${product.stock} in stock` : 'Out of stock'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            disabled={!inStock || actionLoading === `cart-${product._id}`}
            onClick={() => onAddToCart(product)}
            className="w-full"
          >
            <IoCart /> {actionLoading === `cart-${product._id}` ? 'Adding...' : 'Cart'}
          </Button>
          <Button
            size="sm"
            variant="accent"
            disabled={!inStock || actionLoading === `buy-${product._id}`}
            onClick={() => onBuyNow(product)}
            className="w-full"
          >
            <IoFlash /> {actionLoading === `buy-${product._id}` ? 'Wait...' : 'Buy Now'}
          </Button>
        </div>
      </div>
    </motion.article>
  )
}

export default function ProductListing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
  const [pages, setPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [viewMode, setViewMode] = useState('grid')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const [priceRange, setPriceRange] = useState(DEFAULT_PRICE_RANGE)
  const [actionLoading, setActionLoading] = useState('')

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sort') || 'newest',
    priceRange: {
      min: Number(searchParams.get('minPrice')) || DEFAULT_PRICE_RANGE.min,
      max: Number(searchParams.get('maxPrice')) || DEFAULT_PRICE_RANGE.max,
    },
    rating: Number(searchParams.get('rating')) || 0,
    inStock: searchParams.get('inStock') === 'true',
  })

  const [showFilters, setShowFilters] = useState({ category: true, price: true, rating: true })

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getAllCategories()
      const list = data.categories || data.data || data || []
      setCategories(Array.isArray(list) ? list : [])
    } catch (err) {
      console.error('Error fetching categories:', err)
      setCategories([])
    }
  }, [])

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([])
      return
    }
    try {
      const data = await getWishlist()
      const ids = (data.wishlist || data.products || []).map((product) => product._id || product.id).filter(Boolean)
      setWishlist(ids)
    } catch (err) {
      console.error('Error fetching wishlist:', err)
      setWishlist([])
    }
  }, [isAuthenticated])

  const updateURLParams = useCallback(() => {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.search) params.set('search', filters.search)
    if (filters.sortBy !== 'newest') params.set('sort', filters.sortBy)
    if (filters.priceRange.min > DEFAULT_PRICE_RANGE.min) params.set('minPrice', filters.priceRange.min)
    if (filters.priceRange.max < DEFAULT_PRICE_RANGE.max) params.set('maxPrice', filters.priceRange.max)
    if (filters.rating > 0) params.set('rating', filters.rating)
    if (filters.inStock) params.set('inStock', 'true')
    if (page > 1) params.set('page', page)
    setSearchParams(params, { replace: true })
  }, [filters, page, setSearchParams])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const apiFilters = {
        ...(filters.category && { category: filters.category }),
        ...(filters.search && { search: filters.search }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.priceRange.min > DEFAULT_PRICE_RANGE.min && { minPrice: filters.priceRange.min }),
        ...(filters.priceRange.max < DEFAULT_PRICE_RANGE.max && { maxPrice: filters.priceRange.max }),
        ...(filters.rating > 0 && { rating: filters.rating }),
        ...(filters.inStock && { inStock: 'true' }),
      }
      const data = await getAllProducts(page, 12, apiFilters)
      setProducts(data.products || data.data || [])
      setPages(data.pagination?.pages || data.pages || data.totalPages || 1)
      setTotalProducts(data.pagination?.total || data.total || data.totalProducts || 0)
      if (data.priceRange) {
        setPriceRange({
          min: data.priceRange.minPrice ?? data.priceRange.min ?? DEFAULT_PRICE_RANGE.min,
          max: data.priceRange.maxPrice ?? data.priceRange.max ?? DEFAULT_PRICE_RANGE.max,
        })
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setProducts([])
      setPages(1)
      setTotalProducts(0)
      setError(err.response?.data?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => { fetchCategories() }, [fetchCategories])
  useEffect(() => { fetchWishlist() }, [fetchWishlist])
  useEffect(() => {
    fetchProducts()
    updateURLParams()
  }, [fetchProducts, updateURLParams])
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const categoryOptions = useMemo(() => categories.map((category) => {
    const label = getCategoryLabel(category)
    return {
      value: getCategoryValue(category),
      label,
      icon: category.icon || categoryIcons[label.toLowerCase()] || '📦',
      count: category.productCount || category.productsCount || category.count,
    }
  }).filter((category) => category.value), [categories])

  const activeFilterCount = [
    filters.category,
    filters.search,
    filters.sortBy !== 'newest',
    filters.priceRange.min > DEFAULT_PRICE_RANGE.min,
    filters.priceRange.max < DEFAULT_PRICE_RANGE.max,
    filters.rating > 0,
    filters.inStock,
  ].filter(Boolean).length

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handlePriceRangeChange = (type, value) => {
    setFilters((prev) => ({ ...prev, priceRange: { ...prev.priceRange, [type]: Number(value) || 0 } }))
    setPage(1)
  }

  const activeFilterChips = [
    filters.category && { key: 'category', label: `Category: ${categoryOptions.find((cat) => cat.value === filters.category)?.label || filters.category}`, clear: () => handleFilterChange('category', '') },
    filters.search && { key: 'search', label: `Search: ${filters.search}`, clear: () => handleFilterChange('search', '') },
    filters.sortBy !== 'newest' && { key: 'sort', label: sortOptions.find((option) => option.value === filters.sortBy)?.label || filters.sortBy, clear: () => handleFilterChange('sortBy', 'newest') },
    filters.priceRange.min > DEFAULT_PRICE_RANGE.min && { key: 'minPrice', label: `Min ${formatCurrency(filters.priceRange.min)}`, clear: () => handlePriceRangeChange('min', DEFAULT_PRICE_RANGE.min) },
    filters.priceRange.max < DEFAULT_PRICE_RANGE.max && { key: 'maxPrice', label: `Max ${formatCurrency(filters.priceRange.max)}`, clear: () => handlePriceRangeChange('max', DEFAULT_PRICE_RANGE.max) },
    filters.rating > 0 && { key: 'rating', label: `${filters.rating}+ stars`, clear: () => handleFilterChange('rating', 0) },
    filters.inStock && { key: 'stock', label: 'In stock only', clear: () => handleFilterChange('inStock', false) },
  ].filter(Boolean)

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      sortBy: 'newest',
      priceRange: DEFAULT_PRICE_RANGE,
      rating: 0,
      inStock: false,
    })
    setPage(1)
  }

  const requireLogin = () => {
    toast.error('Please login to continue')
    navigate('/login', { state: { from: '/products' } })
  }

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) return requireLogin()
    setActionLoading(`cart-${product._id}`)
    try {
      await addToCart(product._id, 1)
      toast.success(`${product.name} added to cart`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product to cart')
    } finally {
      setActionLoading('')
    }
  }

  const handleBuyNow = async (product) => {
    if (!isAuthenticated) return requireLogin()
    setActionLoading(`buy-${product._id}`)
    try {
      await addToCart(product._id, 1)
      navigate('/checkout')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to prepare checkout')
    } finally {
      setActionLoading('')
    }
  }

  const handleToggleWishlist = async (product) => {
    if (!isAuthenticated) return requireLogin()
    const isWishlisted = wishlist.includes(product._id)
    setWishlist((prev) => isWishlisted ? prev.filter((id) => id !== product._id) : [...prev, product._id])
    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id)
        toast.success('Removed from wishlist')
      } else {
        await addToWishlist(product._id)
        toast.success('Added to wishlist')
      }
    } catch (err) {
      setWishlist((prev) => isWishlisted ? [...prev, product._id] : prev.filter((id) => id !== product._id))
      toast.error(err.response?.data?.message || 'Wishlist update failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-gray-50 to-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-agro-dark via-agro-primary to-green-500 p-6 sm:p-8 text-white shadow-hover relative">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute right-20 bottom-0 w-24 h-24 rounded-full bg-yellow-300/20" />
          <div className="relative max-w-3xl">
            <p className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-1 text-sm font-semibold mb-4">
              <IoBag /> AgroMart Store
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold mb-3">Shop Agriculture Products</h1>
            <p className="text-white/85 text-base sm:text-lg">
              Search seeds, fertilizers, tools, irrigation, and farm-ready supplies with live stock and direct checkout.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="bg-white/15 rounded-full px-4 py-2 text-sm"><span className="font-bold">{totalProducts}</span> live products</span>
              <span className="bg-white/15 rounded-full px-4 py-2 text-sm">COD available</span>
              <span className="bg-white/15 rounded-full px-4 py-2 text-sm">Fast checkout</span>
            </div>
          </div>
        </motion.div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 items-start">
          {mobileFilterOpen && (
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
          )}
          <aside
            className={`fixed inset-y-0 left-0 z-50 h-screen w-80 max-w-[85vw] overflow-y-auto bg-white p-5 shadow-2xl transition-transform duration-300 lg:sticky lg:top-24 lg:z-auto lg:h-fit lg:w-auto lg:max-w-none lg:translate-x-0 lg:bg-transparent lg:p-0 lg:shadow-none ${
              mobileFilterOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="h-full lg:h-fit lg:bg-white lg:rounded-2xl lg:shadow-lg lg:border lg:border-gray-100 lg:p-6">
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="font-bold text-xl">Filters</h3>
                <button type="button" onClick={() => setMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><IoClose size={24} /></button>
              </div>

              {activeFilterCount > 0 && (
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-sm font-semibold">Active Filters ({activeFilterCount})</span>
                  <button type="button" onClick={clearFilters} className="text-sm text-red-600 font-semibold">Clear All</button>
                </div>
              )}

              <div className="mb-6 relative">
                <IoSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search seeds, tools, solar..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 outline-none"
                />
              </div>

              <FilterSection title="Category" open={showFilters.category} onToggle={() => setShowFilters((prev) => ({ ...prev, category: !prev.category }))}>
                <button type="button" onClick={() => handleFilterChange('category', '')} className={`flex items-center justify-between w-full px-3 py-2 rounded-lg ${!filters.category ? 'bg-green-600 text-white' : 'hover:bg-gray-100'}`}>
                  <span>All Products</span><span className="text-sm opacity-75">{totalProducts}</span>
                </button>
                {categoryOptions.map((category) => (
                  <button type="button" key={category.value} onClick={() => handleFilterChange('category', category.value)} className={`flex items-center justify-between w-full px-3 py-2 rounded-lg ${filters.category === category.value ? 'bg-green-600 text-white' : 'hover:bg-gray-100'}`}>
                    <span className="flex items-center gap-2"><span>{category.icon}</span>{category.label}</span>
                    {category.count !== undefined && <span className="text-sm opacity-75">{category.count}</span>}
                  </button>
                ))}
                {categoryOptions.length === 0 && <p className="text-sm text-gray-500 px-3 py-2">No categories available</p>}
              </FilterSection>

              <FilterSection title="Price Range" open={showFilters.price} onToggle={() => setShowFilters((prev) => ({ ...prev, price: !prev.price }))}>
                <label className="text-sm text-gray-600 block">Min: <span className="font-semibold">{formatCurrency(filters.priceRange.min)}</span></label>
                <input type="range" min={priceRange.min} max={priceRange.max} value={filters.priceRange.min} onChange={(e) => handlePriceRangeChange('min', e.target.value)} className="w-full accent-green-600" />
                <label className="text-sm text-gray-600 block">Max: <span className="font-semibold">{formatCurrency(filters.priceRange.max)}</span></label>
                <input type="range" min={priceRange.min} max={priceRange.max} value={filters.priceRange.max} onChange={(e) => handlePriceRangeChange('max', e.target.value)} className="w-full accent-green-600" />
              </FilterSection>

              <FilterSection title="Minimum Rating" open={showFilters.rating} onToggle={() => setShowFilters((prev) => ({ ...prev, rating: !prev.rating }))}>
                {[4, 3, 2, 1].map((rating) => (
                  <button type="button" key={rating} onClick={() => handleFilterChange('rating', filters.rating === rating ? 0 : rating)} className={`flex items-center justify-between w-full px-3 py-2 rounded-lg ${filters.rating === rating ? 'bg-green-600 text-white' : 'hover:bg-gray-100'}`}>
                    <Rating value={rating} /><span className="text-sm">& up</span>
                  </button>
                ))}
              </FilterSection>

              <label className="flex items-center gap-2 cursor-pointer mb-6">
                <input type="checkbox" checked={filters.inStock} onChange={(e) => handleFilterChange('inStock', e.target.checked)} className="w-4 h-4 text-green-600 rounded focus:ring-green-500" />
                <span className="text-sm font-medium">In Stock Only</span>
              </label>
              <button type="button" onClick={() => setMobileFilterOpen(false)} className="w-full lg:hidden bg-green-600 text-white py-3 rounded-lg font-semibold">Apply Filters</button>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="bg-white/90 backdrop-blur rounded-2xl border border-gray-100 shadow-lg p-4 mb-6 lg:sticky lg:top-20 z-30">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button type="button" className="lg:hidden flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg" onClick={() => setMobileFilterOpen(true)}>
                  <IoFilterSharp /> Filters
                  {activeFilterCount > 0 && <span className="bg-white text-green-600 px-2 py-0.5 rounded-full text-xs font-bold">{activeFilterCount}</span>}
                </button>
                <span className="text-sm text-gray-600">Showing <span className="font-semibold text-agro-dark">{products.length}</span> of <span className="font-semibold text-agro-dark">{totalProducts}</span></span>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-gray-600 hidden sm:block">Sort by:</span>
                  <select value={filters.sortBy} onChange={(e) => handleFilterChange('sortBy', e.target.value)} className="px-3 py-2 border-2 rounded-lg focus:border-green-500 outline-none bg-white">
                    {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button type="button" onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow text-green-600' : 'text-gray-600'}`}><IoGrid size={20} /></button>
                  <button type="button" onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow text-green-600' : 'text-gray-600'}`}><IoList size={20} /></button>
                </div>
              </div>
              {activeFilterChips.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  {activeFilterChips.map((chip) => (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={chip.clear}
                      className="inline-flex items-center gap-2 rounded-full bg-green-50 text-green-700 border border-green-100 px-3 py-1 text-xs font-semibold hover:bg-green-100 transition"
                    >
                      {chip.label}
                      <IoClose size={14} />
                    </button>
                  ))}
                  <button type="button" onClick={clearFilters} className="text-xs font-semibold text-red-600 hover:text-red-700 px-2">
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 2xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                <ProductSkeleton viewMode={viewMode} />
              </div>
            ) : products.length > 0 ? (
              <>
                <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }} initial="hidden" animate="visible" className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 2xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                  {products.map((product) => (
                    <ProductTile
                      key={product._id}
                      product={product}
                      viewMode={viewMode}
                      wishlisted={wishlist.includes(product._id)}
                      actionLoading={actionLoading}
                      onAddToCart={handleAddToCart}
                      onBuyNow={handleBuyNow}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </motion.div>

                {pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1} className="px-4 py-2 bg-white rounded-xl border border-gray-100 shadow disabled:opacity-50">Previous</button>
                    {Array.from({ length: Math.min(5, pages) }).map((_, index) => {
                      const pageNumber = pages <= 5 ? index + 1 : page <= 3 ? index + 1 : page >= pages - 2 ? pages - 4 + index : page - 2 + index
                      return <button type="button" key={pageNumber} onClick={() => setPage(pageNumber)} className={`w-10 h-10 rounded-xl font-semibold border ${pageNumber === page ? 'bg-green-600 text-white border-green-600' : 'bg-white shadow text-gray-700 border-gray-100'}`}>{pageNumber}</button>
                    })}
                    <button type="button" onClick={() => setPage((prev) => Math.min(pages, prev + 1))} disabled={page === pages} className="px-4 py-2 bg-white rounded-xl border border-gray-100 shadow disabled:opacity-50">Next</button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-12 text-center">
                <div className="text-7xl mb-5">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">No live products match these filters. Try changing search, category, or price range.</p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            )}
          </main>
        </div>

        <AnimatePresence>
          {showScrollTop && (
            <motion.button initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 z-40">
              <IoArrowUp size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
