import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Badge } from '../components/UI'
import API from '../api/axios'
import { IoStar, IoCart, IoFlash, IoShieldCheckmark, IoReload, IoLeaf } from 'react-icons/io5'

export default function ProductPage(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [buying, setBuying] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewAdding, setReviewAdding] = useState(false)
  const imageUrl = product?.image || product?.images?.primary || product?.images?.thumbnails?.[0]
  const categoryName = typeof product?.category === 'object' ? product.category?.name : product?.category

  useEffect(() => { fetchProduct() }, [id])

  async function fetchProduct(){
    setLoading(true)
    try {
      const res = await API.get(`/products/${id}`)
      setProduct(res.data.product || res.data.data || res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function addToCart(redirectToCheckout = false){
    const selectedQuantity = parseInt(quantity)
    if (selectedQuantity > product.stock) {
      alert(`Only ${product.stock} item(s) available`)
      return
    }

    if (redirectToCheckout) {
      setBuying(true)
    } else {
      setAdding(true)
    }
    try {
      await API.post('/cart', { productId: product._id || id, quantity: selectedQuantity })
      if (redirectToCheckout) {
        navigate('/checkout')
      } else {
        alert('Added to cart!')
      }
    } catch (err) {
      console.error(err)
      if (err.response?.status === 401) {
        navigate('/login', { state: { from: `/product/${id}` } })
      } else {
        alert(err.response?.data?.message || 'Failed to add product to cart')
      }
    } finally {
      setAdding(false)
      setBuying(false)
    }
  }

  async function submitReview(){
    setReviewAdding(true)
    try {
      await API.post(`/products/${id}/reviews`, { rating: parseInt(rating), comment })
      setComment('')
      setRating(5)
      fetchProduct()
    } catch (err) {
      console.error(err)
    } finally {
      setReviewAdding(false)
    }
  }

  if(loading) return <div className="flex items-center justify-center h-screen"><div className="text-xl">Loading...</div></div>
  if(!product) return <div className="text-center mt-12">Product not found</div>

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Product Header */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Image */}
          <div className="md:col-span-1">
            <div className="bg-agro-background rounded-xl aspect-square flex items-center justify-center overflow-hidden sticky top-24">
              {imageUrl ? (
                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl">🌱</span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2">
            <Badge color="secondary" className="mb-3">{categoryName || 'Product'}</Badge>
            <h1 className="text-4xl font-bold text-agro-dark mb-2">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <IoStar key={i} className={i < Math.floor(product.avgRating || 0) ? 'text-agro-accent' : 'text-gray-300'} size={20} />
              ))}
              <span className="text-gray-600">({product.reviews?.length || 0} reviews)</span>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

            {/* Price & Stock */}
            <div className="mb-6">
              <p className="text-4xl font-bold text-agro-primary">₹{product.price}</p>
              <p className={`mt-2 text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-agro-error'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3 mb-8">
              <div className="flex items-center border-2 border-agro-background rounded-lg">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-agro-primary hover:bg-agro-background"
                >
                  −
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center outline-none bg-transparent"
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                  className="px-4 py-2 text-agro-primary hover:bg-agro-background"
                >
                  +
                </button>
              </div>
              <Button 
                size="lg" 
                onClick={() => addToCart(false)}
                disabled={adding || buying || product.stock === 0}
                className="flex-1"
              >
                <IoCart /> {adding ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                size="lg"
                variant="accent"
                onClick={() => addToCart(true)}
                disabled={adding || buying || product.stock === 0}
                className="flex-1"
              >
                <IoFlash /> {buying ? 'Preparing...' : 'Buy Now'}
              </Button>
            </div>

            {/* Details */}
            <div className="grid sm:grid-cols-4 gap-4 p-4 bg-agro-background rounded-xl">
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Category</p>
                <p className="font-semibold text-agro-dark capitalize">{categoryName || 'Product'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">SKU</p>
                <p className="font-semibold text-agro-dark">{product._id?.slice(-6)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Delivery</p>
                <p className="font-semibold text-agro-dark">3-5 days</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Payment</p>
                <p className="font-semibold text-agro-dark">COD Available</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              <div className="border rounded-xl p-4 flex gap-3">
                <IoShieldCheckmark className="text-agro-primary text-2xl shrink-0" />
                <div>
                  <p className="font-semibold text-agro-dark">Secure Checkout</p>
                  <p className="text-sm text-gray-600">Protected user order flow</p>
                </div>
              </div>
              <div className="border rounded-xl p-4 flex gap-3">
                <IoReload className="text-agro-primary text-2xl shrink-0" />
                <div>
                  <p className="font-semibold text-agro-dark">Easy Cancellation</p>
                  <p className="text-sm text-gray-600">Cancel before dispatch</p>
                </div>
              </div>
              <div className="border rounded-xl p-4 flex gap-3">
                <IoLeaf className="text-agro-primary text-2xl shrink-0" />
                <div>
                  <p className="font-semibold text-agro-dark">Farm Ready</p>
                  <p className="text-sm text-gray-600">Trusted agriculture supplies</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {(product.longDescription || product.specifications) && (
          <div className="bg-agro-background rounded-xl p-6 mb-12">
            <h2 className="text-2xl font-bold text-agro-dark mb-4">About This Product</h2>
            {product.longDescription && (
              <p className="text-gray-700 leading-relaxed mb-4">{product.longDescription}</p>
            )}
            {product.specifications && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(product.specifications)
                  .filter(([, value]) => Array.isArray(value) ? value.length > 0 : Boolean(value))
                  .map(([key, value]) => (
                    <div key={key} className="bg-white rounded-lg p-4">
                      <p className="text-xs uppercase text-gray-500 font-semibold">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-agro-dark font-medium mt-1">
                        {Array.isArray(value) ? value.join(', ') : value}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-agro-dark mb-6">Customer Reviews</h2>
            
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((rev, i) => (
                  <div key={i} className="bg-agro-background p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, j) => (
                          <IoStar key={j} className={j < rev.rating ? 'text-agro-accent' : 'text-gray-300'} size={16} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">User</p>
                    </div>
                    <p className="text-gray-700">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No reviews yet</p>
            )}
          </div>

          {/* Add Review */}
          <div className="bg-agro-background p-6 rounded-xl h-fit">
            <h3 className="font-bold text-agro-dark mb-4">Leave a Review</h3>
            
            <div className="mb-4">
              <label className="text-sm font-semibold text-agro-dark block mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(r => (
                  <button 
                    key={r}
                    onClick={() => setRating(r)}
                    className="transition"
                  >
                    <IoStar className={r <= rating ? 'text-agro-accent' : 'text-gray-300'} size={24} />
                  </button>
                ))}
              </div>
            </div>

            <textarea 
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full p-3 border-2 border-agro-primary rounded-lg mb-3 outline-none resize-none"
              rows="3"
            />
            
            <Button 
              size="sm"
              onClick={submitReview}
              disabled={reviewAdding}
              className="w-full"
            >
              {reviewAdding ? 'Posting...' : 'Post Review'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
