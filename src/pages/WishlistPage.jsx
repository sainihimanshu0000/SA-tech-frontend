import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { Button, Card, Badge } from '../components/UI';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from '../api/axios';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlistProducts();
  }, [wishlist]);

  const fetchWishlistProducts = async () => {
    setLoading(true);
    try {
      // Fetch full product details for items in wishlist
      const productPromises = wishlist.map(item =>
        axios.get(`/api/products/${item._id}`)
      );
      const responses = await Promise.all(productPromises);
      const productData = responses.map(res => res.data);
      setProducts(productData);
    } catch (error) {
      console.error('Error fetching wishlist products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (products.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

            <Card className="p-8 text-center">
              <p className="text-gray-600 mb-4">Your wishlist is empty</p>
              <Link
                to="/products"
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Start Shopping
              </Link>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-2">{products.length} items saved</p>
            </div>
            <Link
              to="/products"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Continue Shopping →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product._id} className="overflow-hidden hover:shadow-lg transition">
                {/* Product Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-3 right-3">
                      <Badge text={`-${product.discount}%`} color="red" />
                    </div>
                  )}

                  {/* Organic Badge */}
                  {product.isOrganic && (
                    <div className="absolute top-3 left-3">
                      <Badge text="Organic" color="green" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(Math.floor(product.rating))}
                        {'☆'.repeat(5 - Math.floor(product.rating))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.numReviews || 0} reviews)
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{product.price?.toFixed(2) || 'N/A'}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          ₹{product.originalPrice?.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    {product.stock && product.stock > 0 ? (
                      <span className="text-sm text-green-600 font-medium">
                        ✓ In Stock ({product.stock} available)
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 font-medium">
                        ✗ Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      text="Add to Cart"
                      onClick={() => handleAddToCart(product)}
                      className="flex-1"
                      disabled={!product.stock || product.stock === 0}
                    />
                    <button
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 font-medium py-2 rounded-lg transition"
                    >
                      Remove
                    </button>
                  </div>

                  {/* View Details Link */}
                  <Link
                    to={`/products/${product._id}`}
                    className="block text-center mt-3 text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    View Details →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
