import React, { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Badge } from '../components/UI'
import API from '../api/axios'
import { 
  IoTrash, IoArrowBack, IoHeart, IoHeartOutline,
  IoAdd, IoRemove, IoCart, IoBagCheck,
  IoGift, IoRocket, IoShield, IoReload,
  IoChevronDown, IoChevronUp, IoWarning
} from 'react-icons/io5'

export default function CartPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState({})
  const [savedForLater, setSavedForLater] = useState([])
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [showOrderSummary, setShowOrderSummary] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Quantity update debounce
  const [updateQueue, setUpdateQueue] = useState({})
  const [processingQueue, setProcessingQueue] = useState(false)

  useEffect(() => {
    fetchCart()
    fetchSavedItems()
    window.scrollTo(0, 0)
  }, [])

  // Process update queue
  useEffect(() => {
    if (Object.keys(updateQueue).length > 0 && !processingQueue) {
      setProcessingQueue(true)
      const timer = setTimeout(async () => {
        try {
          const updates = Object.entries(updateQueue).map(([productId, quantity]) => ({
            productId,
            quantity
          }))
          
          await API.put(`/cart/${cart._id}/batch`, { updates })
          await fetchCart()
          setUpdateQueue({})
        } catch (err) {
          console.error('Batch update failed:', err)
        } finally {
          setProcessingQueue(false)
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [updateQueue, processingQueue, cart?._id])

  async function fetchCart() {
    setLoading(true)
    setError('')
    try {
      const res = await API.get('/cart')
      setCart(res.data)
      
      // Fetch related products based on cart items
      if (res.data.products?.length > 0) {
        fetchRelatedProducts(res.data.products)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cart')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchSavedItems() {
    try {
      const res = await API.get('/cart/saved')
      setSavedForLater(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  async function fetchRelatedProducts(cartItems) {
    try {
      const categories = cartItems.map(item => item.product.category)
      const res = await API.get(`/products/recommendations?categories=${categories.join(',')}&limit=4`)
      setRelatedProducts(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const updateQuantity = useCallback((productId, newQty, variant = null) => {
    if (newQty < 1) {
      removeItem(productId)
      return
    }

    // Update local state immediately for responsive UI
    setCart(prev => ({
      ...prev,
      products: prev.products.map(item =>
        item.product._id === productId
          ? { ...item, quantity: newQty }
          : item
      )
    }))

    // Add to update queue
    setUpdateQueue(prev => ({
      ...prev,
      [productId]: newQty
    }))

    setUpdating(prev => ({ ...prev, [productId]: true }))
  }, [])

  async function removeItem(productId) {
    if (!window.confirm('Are you sure you want to remove this item?')) return

    try {
      // Optimistic update
      setCart(prev => ({
        ...prev,
        products: prev.products.filter(item => item.product._id !== productId)
      }))

      await API.delete(`/cart/${cart._id}/items/${productId}`)
      setSuccess('Item removed from cart')
      setTimeout(() => setSuccess(''), 3000)
      
      // Remove from update queue if present
      if (updateQueue[productId]) {
        const newQueue = { ...updateQueue }
        delete newQueue[productId]
        setUpdateQueue(newQueue)
      }
    } catch (err) {
      // Revert on error
      fetchCart()
      setError('Failed to remove item')
    }
  }

  async function saveForLater(productId) {
    try {
      await API.post(`/cart/save/${productId}`)
      removeItem(productId) // Remove from cart
      fetchSavedItems() // Refresh saved items
      setSuccess('Item saved for later')
    } catch (err) {
      setError('Failed to save item')
    }
  }

  async function moveToCart(productId) {
    try {
      await API.post(`/cart/move/${productId}`)
      fetchCart()
      fetchSavedItems()
    } catch (err) {
      setError('Failed to move item to cart')
    }
  }

  async function removeSavedItem(productId) {
    try {
      await API.delete(`/cart/saved/${productId}`)
      fetchSavedItems()
    } catch (err) {
      setError('Failed to remove saved item')
    }
  }

  async function applyCoupon() {
    if (!couponCode.trim()) return

    try {
      const res = await API.post('/cart/apply-coupon', { code: couponCode })
      setAppliedCoupon(res.data.coupon)
      fetchCart() // Refresh cart with new pricing
      setSuccess('Coupon applied successfully!')
      setCouponCode('')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid coupon code')
    }
  }

  async function removeCoupon() {
    try {
      await API.delete('/cart/coupon')
      setAppliedCoupon(null)
      fetchCart()
    } catch (err) {
      setError('Failed to remove coupon')
    }
  }

  const calculateDiscounts = () => {
    if (!cart) return { subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0 }
    
    const subtotal = cart.products.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0
    const shipping = subtotal > 500 ? 0 : 40
    const tax = (subtotal - discount) * 0.1
    
    return {
      subtotal,
      discount,
      shipping,
      tax,
      total: subtotal - discount + shipping + tax
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-xl p-4 h-32"></div>
                ))}
              </div>
              <div className="bg-white rounded-xl p-6 h-64"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const pricing = calculateDiscounts()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 text-green-600 font-semibold mb-6 hover:text-green-700 transition group"
        >
          <IoArrowBack className="group-hover:-translate-x-1 transition" /> Continue Shopping
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <IoCart className="text-green-600" /> Shopping Cart
            {cart?.products?.length > 0 && (
              <Badge className="bg-green-100 text-green-700 text-lg">
                {cart.products.length} {cart.products.length === 1 ? 'Item' : 'Items'}
              </Badge>
            )}
          </h1>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
            <IoWarning /> {error}
            <button onClick={() => setError('')} className="ml-auto">✕</button>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
            <span>✅</span> {success}
          </div>
        )}

        {!cart || cart.products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Browse our products and find something great!
            </p>
            <Link to="/products">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Start Shopping <IoArrowBack className="rotate-180 ml-2" />
              </Button>
            </Link>

            {/* Show saved items if any */}
            {savedForLater.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-xl font-bold mb-4">Saved for Later</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {savedForLater.map(item => (
                    <div key={item._id} className="bg-gray-50 rounded-lg p-3">
                      <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded mb-2" />
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-green-600 font-bold text-sm">₹{item.price}</p>
                      <button
                        onClick={() => moveToCart(item._id)}
                        className="text-xs text-green-600 hover:underline mt-1"
                      >
                        Move to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.products.map(item => (
                  <div 
                    key={item.product._id} 
                    className={`bg-white rounded-xl shadow-md p-4 flex gap-4 hover:shadow-lg transition relative ${
                      updating[item.product._id] ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <Link to={`/product/${item.product._id}`} className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden group">
                      {item.product.image ? (
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          🌱
                        </div>
                      )}
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link to={`/product/${item.product._id}`} className="hover:text-green-600">
                            <h3 className="font-bold text-gray-800 text-lg">{item.product.name}</h3>
                          </Link>
                          <p className="text-sm text-gray-500 mb-2 capitalize">{item.product.category}</p>
                        </div>
                        <p className="font-bold text-green-600 text-xl">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border-2 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            disabled={updating[item.product._id]}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                          >
                            <IoRemove />
                          </button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            disabled={updating[item.product._id]}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                          >
                            <IoAdd />
                          </button>
                        </div>

                        {item.product.stock < 10 && (
                          <span className="text-xs text-orange-600">
                            Only {item.product.stock} left
                          </span>
                        )}
                      </div>

                      {/* Unit Price */}
                      <p className="text-sm text-gray-500 mt-2">
                        ₹{item.product.price.toLocaleString()} each
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => saveForLater(item.product._id)}
                        className="p-2 hover:bg-gray-100 rounded-full transition group"
                        title="Save for later"
                      >
                        <IoHeartOutline className="text-gray-400 group-hover:text-green-600" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="p-2 hover:bg-gray-100 rounded-full transition group"
                        title="Remove"
                      >
                        <IoTrash className="text-gray-400 group-hover:text-red-600" />
                      </button>
                    </div>

                    {/* Loading Overlay */}
                    {updating[item.product._id] && (
                      <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Free Shipping Progress */}
                {pricing.subtotal < 500 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-700 mb-2">
                      Add ₹{(500 - pricing.subtotal).toLocaleString()} more to get FREE shipping!
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((pricing.subtotal / 500) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                  <button
                    onClick={() => setShowOrderSummary(!showOrderSummary)}
                    className="flex items-center justify-between w-full lg:hidden mb-4"
                  >
                    <h3 className="text-xl font-bold">Order Summary</h3>
                    {showOrderSummary ? <IoChevronUp /> : <IoChevronDown />}
                  </button>

                  <div className={showOrderSummary ? 'block' : 'hidden lg:block'}>
                    {/* Coupon Code */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Have a coupon?
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Enter code"
                          className="flex-1 px-3 py-2 border-2 rounded-lg focus:border-green-500 outline-none"
                          disabled={appliedCoupon}
                        />
                        {appliedCoupon ? (
                          <button
                            onClick={removeCoupon}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={applyCoupon}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Apply
                          </button>
                        )}
                      </div>
                      
                      {appliedCoupon && (
                        <p className="text-sm text-green-600 mt-2">
                          {appliedCoupon.code} applied! {appliedCoupon.discount}% off
                        </p>
                      )}
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 border-b-2 border-gray-100 pb-4 mb-4">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal:</span>
                        <span>₹{pricing.subtotal.toLocaleString()}</span>
                      </div>
                      
                      {pricing.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-₹{pricing.discount.toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping:</span>
                        {pricing.shipping === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          <span>₹{pricing.shipping}</span>
                        )}
                      </div>
                      
                      <div className="flex justify-between text-gray-600">
                        <span>Tax (10%):</span>
                        <span>₹{pricing.tax.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-bold text-gray-800">Total:</span>
                      <div className="text-right">
                        <span className="text-3xl font-bold text-green-600">
                          ₹{pricing.total.toLocaleString()}
                        </span>
                        <p className="text-xs text-gray-500">Incl. all taxes</p>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Link to="/checkout">
                      <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                        <IoBagCheck className="mr-2" /> Proceed to Checkout
                      </Button>
                    </Link>

                    {/* Trust Badges */}
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IoShield className="text-green-600" /> Secure Checkout
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IoRocket className="text-green-600" /> Free Shipping on orders ₹500+
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IoReload className="text-green-600" /> 7-Day Easy Returns
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Saved for Later Section */}
            {savedForLater.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <IoGift className="text-green-600" /> Saved for Later
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {savedForLater.map(item => (
                    <div key={item._id} className="bg-white rounded-xl shadow-md p-3 hover:shadow-lg transition">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <h4 className="font-medium truncate">{item.name}</h4>
                      <p className="text-green-600 font-bold">₹{item.price}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => moveToCart(item._id)}
                          className="flex-1 text-xs bg-green-600 text-white py-1 rounded hover:bg-green-700"
                        >
                          Move to Cart
                        </button>
                        <button
                          onClick={() => removeSavedItem(item._id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <IoTrash className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-4">You might also like</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedProducts.map(product => (
                    <Link 
                      key={product._id} 
                      to={`/product/${product._id}`}
                      className="bg-white rounded-xl shadow-md p-3 hover:shadow-lg transition group"
                    >
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-32 object-cover rounded-lg mb-2 group-hover:scale-105 transition"
                      />
                      <h4 className="font-medium truncate">{product.name}</h4>
                      <p className="text-green-600 font-bold">₹{product.price}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}