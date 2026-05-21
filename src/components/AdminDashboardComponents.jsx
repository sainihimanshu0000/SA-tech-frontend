import React, { useState, useEffect } from 'react'
import { Button, Badge } from './UI'
import { 
  IoEye, IoCreate, IoTrash, IoClose, IoSearch,
  IoDownload, IoSync, IoStatsChart, IoTrendingUp,
  IoTrendingDown, IoCart, IoPeople, IoCube, IoWarning,
  IoSunny, IoLeaf, IoFlash
} from 'react-icons/io5'


import { createCategory, getAllCategories } from '../api/categoriesAPI';
import { toast } from 'react-hot-toast';

// ==================== STAT CARD ====================
export const StatCard = ({ title, value, change, icon: Icon, color, trend, onClick }) => {
  const colors = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  }

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-500 text-sm">{title}</p>
        <div className={`w-10 h-10 ${colors[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="text-xl" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className={`text-sm mt-2 flex items-center gap-1 ${
        trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
      }`}>
        {trend === 'up' && <IoTrendingUp />}
        {trend === 'down' && <IoTrendingDown />}
        {change}
      </p>
    </div>
  )
}

// ==================== TAB BUTTON ====================
export const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={`pb-3 px-4 font-semibold transition-colors relative ${
      active 
        ? 'border-b-2 border-green-600 text-green-600' 
        : 'text-gray-600 hover:text-green-600'
    }`}
  >
    <Icon className="inline mr-2" /> {label}
    {count > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
        {count}
      </span>
    )}
  </button>
)

// ==================== REVENUE CHART ====================
export function RevenueChart({ data = [] }) {
  // Transform data to the format expected by the component
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return []
    
    // If data is already in the correct format (with label/value), use it
    if (data[0]?.label !== undefined || data[0]?.value !== undefined) {
      return data
    }
    
    // Transform from API format (_id, revenue, orders)
    return data.map(item => ({
      label: item._id || new Date(item.date || Date.now()).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short'
      }),
      value: item.revenue || item.total || 0,
      orders: item.orders || 0
    }))
  }, [data])

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <IoStatsChart className="text-4xl text-gray-400 mx-auto mb-2" />
          <p>No revenue data available</p>
        </div>
      </div>
    )
  }

  // Find max value for scaling
  const maxValue = Math.max(...chartData.map(d => d.value || 0), 1)
  
  return (
    <div className="space-y-4">
      {chartData.map((item, idx) => (
        <div key={idx} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
            <div className="text-right">
              <span className="text-lg font-bold text-green-600">
                ₹{item.value?.toLocaleString('en-IN') || 0}
              </span>
              {item.orders > 0 && (
                <span className="text-xs text-gray-500 ml-2">
                  ({item.orders} orders)
                </span>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
              style={{
                width: `${((item.value || 0) / maxValue) * 100}%`
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ==================== RECENT ORDERS ====================
export function RecentOrders({ orders = [], onViewAll }) {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
        <div className="text-center py-8 text-gray-500">
          <IoCart className="text-4xl mx-auto mb-2 opacity-50" />
          <p>No recent orders</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Recent Orders</h3>
        <button
          onClick={onViewAll}
          className="text-green-600 hover:text-green-700 font-semibold text-sm"
        >
          View All →
        </button>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                Order #{order._id?.slice(-6) || ''}
              </p>
              <p className="text-sm text-gray-600">
                {order.user?.name || order.customerName || 'Customer'}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">
                ₹{order.totalAmount?.toLocaleString('en-IN') || 0}
              </p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                {order.status || 'pending'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== LOW STOCK PRODUCTS ====================
export function LowStockProducts({ onManage }) {
  const [lowStockItems, setLowStockItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLowStockProducts()
  }, [])

  const fetchLowStockProducts = async () => {
    try {
      const { getLowStockProducts } = await import('../api/adminAPI')
      const res = await getLowStockProducts(10)
      setLowStockItems(res.data || [])
    } catch (err) {
      console.error('Error fetching low stock products:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <IoWarning className="text-yellow-600 text-xl" />
          <h3 className="text-xl font-bold">Low Stock Alert</h3>
        </div>
        <button
          onClick={onManage}
          className="text-green-600 hover:text-green-700 font-semibold text-sm"
        >
          Manage →
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : lowStockItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">✓ All products have healthy stock levels</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lowStockItems.slice(0, 5).map((product) => (
            <div key={product._id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-600">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-yellow-600">{product.stock} units</p>
                <p className="text-xs text-gray-500">₹{product.price?.toLocaleString('en-IN') || 0}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== PRODUCT CARD ====================
export function ProductCard({ product, onEdit, onDelete, onView, selected, onSelect }) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition ${
      selected ? 'border-green-500' : 'border-transparent hover:shadow-lg'
    }`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="absolute top-2 left-2 w-5 h-5 z-10"
        />
        <div className="aspect-square bg-gray-200 flex items-center justify-center">
          {product.images?.[0] || product.image ? (
            <img 
              src={product.images?.[0] || product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center text-gray-400">
              <IoCube className="text-4xl mx-auto" />
              <p className="text-sm">No Image</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <h4 className="font-bold text-gray-900 truncate">{product.name}</h4>
        
        <div className="flex items-center gap-2 my-2">
          <span className="text-lg font-bold text-green-600">
            ₹{product.price?.toLocaleString('en-IN') || 0}
          </span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.mrp?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center text-sm mb-3">
          <span className="text-gray-600">Stock: <span className="font-bold">{product.stock || 0}</span></span>
          {product.isFeatured && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Featured</span>}
          {product.isBestseller && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Bestseller</span>}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onView?.(product)}
            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center justify-center gap-1"
          >
            <IoEye size={16} /> View
          </button>
          <button
            onClick={() => onEdit?.(product)}
            className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(product)}
            className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== PRODUCT FORM ====================



export function ProductForm({ form, onChange, onSubmit, onCancel, editing, submitting }) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await getAllCategories();
      console.log('📥 Categories API response:', response);
      
      // Handle different response structures
      const categoriesData = response.data || response.categories || response;
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      
      console.log('📋 Fetched categories:', categoriesData);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      if (name === 'image') {
        onChange({ ...form, image: files[0] });
      } else if (name === 'images') {
        onChange({ ...form, images: Array.from(files) });
      }
    } else if (type === 'checkbox') {
      onChange({ ...form, [name]: checked });
    } else {
      onChange({ ...form, [name]: value });
    }
  };

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) {
      toast.error('Enter a category name');
      return;
    }

    try {
      setCreatingCategory(true);
      const response = await createCategory({ name });
      const category = response.data || response.category || response;
      await fetchCategories();
      if (category?._id) {
        onChange({ ...form, category: category._id });
      }
      setNewCategoryName('');
      toast.success('Category created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create category');
    } finally {
      setCreatingCategory(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">{editing ? 'Edit Product' : 'Add New Product'}</h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <IoClose size={24} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Basic Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={form.name || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description || ''}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter product description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              {loadingCategories ? (
                <div className="w-full px-3 py-2 border rounded-lg bg-gray-50 animate-pulse">
                  Loading categories...
                </div>
              ) : (
                <select
                  name="category"
                  value={form.category || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name} {cat.icon || ''}
                    </option>
                  ))}
                </select>
              )}
              {!loadingCategories && categories.length === 0 && (
                <div className="mt-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <p className="text-sm text-yellow-800 mb-2">
                    No categories found. Create one here to continue.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Category name"
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={creatingCategory}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {creatingCategory ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={form.tags || ''}
                onChange={handleChange}
                placeholder="organic, seeds, vegetable"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
            </div>
          </div>

          {/* Pricing and Stock */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Pricing & Stock</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={form.price || ''}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹)</label>
              <input
                type="number"
                name="mrp"
                value={form.mrp || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to use same as price</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                name="stock"
                value={form.stock || ''}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured || false}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Featured Product</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isBestseller"
                  checked={form.isBestseller || false}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Bestseller</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="subsidyEligible"
                  checked={form.subsidyEligible || false}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Subsidy Eligible</span>
              </label>
            </div>

            {form.subsidyEligible && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subsidy Percentage</label>
                <input
                  type="number"
                  name="subsidyPercentage"
                  value={form.subsidyPercentage || ''}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="1"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                />
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Product Images</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {form.image && (
              <p className="text-sm text-green-600 mt-1">
                Selected: {form.image.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Images</label>
            <input
              type="file"
              name="images"
              onChange={handleChange}
              accept="image/*"
              multiple
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {form.images && form.images.length > 0 && (
              <p className="text-sm text-green-600 mt-1">
                Selected: {form.images.length} file(s)
              </p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={submitting || (categories.length === 0 && !loadingCategories)}
          >
            {submitting ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
// ==================== PRODUCT VIEW MODAL ====================
export function ProductViewModal({ product, onClose, onEdit }) {
  if (!product) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-white">
          <h3 className="text-2xl font-bold">{product.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {product.images?.[0] || product.image ? (
            <img 
              src={product.images?.[0] || product.image} 
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          ) : null}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Price</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{product.price?.toLocaleString('en-IN') || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Stock</p>
              <p className="text-2xl font-bold">{product.stock || 0} units</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-semibold capitalize">{product.category || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold">{product.isActive ? '✓ Active' : '✗ Inactive'}</p>
            </div>
          </div>

          {product.description && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Description</p>
              <p className="text-gray-800">{product.description}</p>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            {product.isFeatured && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs font-semibold">Featured</span>}
            {product.isBestseller && <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded text-xs font-semibold">Bestseller</span>}
            {product.subsidyEligible && <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-semibold">{product.subsidyPercentage}% Subsidy</span>}
          </div>
        </div>

        <div className="p-6 border-t flex gap-2 bg-gray-50">
          <button
            onClick={() => {
              onEdit?.(product)
              onClose()
            }}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            Edit Product
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== DELETE CONFIRMATION MODAL ====================
export function DeleteConfirmationModal({ product, onConfirm, onCancel }) {
  if (!product) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-red-600 mb-2">Delete {product.name}?</h3>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete "{product.name}"? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== BULK DELETE MODAL ====================
export function BulkDeleteModal({ count, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-red-600 mb-2">Delete {count} Products?</h3>
        <p className="text-gray-700 mb-6">
          This action cannot be undone. Are you sure you want to delete {count} selected product{count !== 1 ? 's' : ''}?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            Delete All
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== ORDERS TABLE ====================
export const OrdersTable = ({
  orders,
  loading,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onUpdateStatus,
  onRefresh,
  onExport,
  bulkAction,
  setBulkAction,
  onBulkAction,
  filters,
  setFilters,
  searchTerm,
  setSearchTerm,
  currentPage,
  totalPages,
  onPageChange,
  getStatusBadgeColor
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold">Order Management</h3>
          <p className="text-sm text-gray-500 mt-1">
            Total: {orders.length} | Pending: {orders.filter(o => (o.orderStatus || o.status) === 'pending').length}
          </p>
        </div>
        
        <div className="flex gap-2">
          {selectedItems.length > 0 && (
            <>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="">Bulk Actions</option>
                <option value="processing">Mark Processing</option>
                <option value="shipped">Mark Shipped</option>
                <option value="delivered">Mark Delivered</option>
                <option value="cancelled">Cancel Orders</option>
              </select>
              {bulkAction && (
                <Button onClick={onBulkAction} size="sm">
                  Apply
                </Button>
              )}
            </>
          )}
          <Button onClick={onExport} variant="outline" size="sm">
            <IoDownload className="mr-2" /> Export
          </Button>
          <Button onClick={onRefresh} variant="outline" size="sm">
            <IoSync className={loading ? 'animate-spin' : ''} /> Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
          className="px-3 py-2 border rounded-lg"
        />
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
          className="px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <IoCart className="text-4xl mx-auto mb-2 opacity-50" />
          <p>No orders found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={orders.length > 0 && selectedItems.length === orders.length}
                    onChange={() => onSelectAll(orders)}
                  />
                </th>
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Items</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Payment</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(order._id)}
                      onChange={() => onSelectItem(order._id)}
                    />
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">#{order._id?.slice(-8)}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{order.userId?.name || order.user?.name || order.customerName || 'Guest'}</p>
                      <p className="text-sm text-gray-500">{order.userId?.email || order.user?.email || order.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{order.items?.length || 0} items</td>
                  <td className="py-3 px-4 font-semibold">₹{order.totalAmount?.toLocaleString('en-IN') || 0}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.orderStatus || order.status || 'pending'}
                      onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                      className={`px-2 py-1 rounded text-sm border ${getStatusBadgeColor(order.orderStatus || order.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={order.paymentStatus === 'paid' || order.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                      {order.paymentStatus || 'pending'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(order.createdAt || order.date || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <IoEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== USERS TABLE ====================
export const UsersTable = ({
  users,
  loading,
  searchTerm,
  setSearchTerm,
  onRefresh,
  onCreateAdmin,
  onUpdateRole,
  onToggleStatus,
  onDeleteUser,
  currentPage,
  totalPages,
  onPageChange,
  totalAdmins = 0,
  getStatusBadgeColor
}) => {
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  })
  const [submittingAdmin, setSubmittingAdmin] = useState(false)

  const resetAdminForm = () => {
    setAdminForm({
      name: '',
      email: '',
      password: '',
      phoneNumber: ''
    })
  }

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    setSubmittingAdmin(true)
    const result = await onCreateAdmin(adminForm)
    setSubmittingAdmin(false)

    if (result?.success) {
      resetAdminForm()
      setShowAdminForm(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h3 className="text-2xl font-bold">User Management</h3>
          <p className="text-sm text-gray-500">Total admins: {totalAdmins}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAdminForm(prev => !prev)} size="sm">
            <IoCreate className="mr-1" /> Create Admin
          </Button>
          <Button onClick={onRefresh} variant="outline" size="sm">
            <IoSync className={loading ? 'animate-spin' : ''} /> Refresh
          </Button>
        </div>
      </div>

      {showAdminForm && (
        <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
          <input
            type="text"
            placeholder="Admin name"
            value={adminForm.name}
            onChange={(e) => setAdminForm(prev => ({ ...prev, name: e.target.value }))}
            className="px-3 py-2 border rounded-lg"
            required
          />
          <input
            type="email"
            placeholder="Admin email"
            value={adminForm.email}
            onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
            className="px-3 py-2 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={adminForm.password}
            onChange={(e) => setAdminForm(prev => ({ ...prev, password: e.target.value }))}
            className="px-3 py-2 border rounded-lg"
            minLength={6}
            required
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={adminForm.phoneNumber}
            onChange={(e) => setAdminForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
            className="px-3 py-2 border rounded-lg"
          />
          <div className="flex gap-2">
            <Button disabled={submittingAdmin} size="sm" className="flex-1">
              {submittingAdmin ? 'Creating...' : 'Save'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                resetAdminForm()
                setShowAdminForm(false)
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="relative mb-6">
        <IoSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search users by name, email or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <IoPeople className="text-4xl mx-auto mb-2 opacity-50" />
          <p>No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Contact</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Orders</th>
                <th className="text-left py-3 px-4">Joined</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-400 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{user.name || user.username || 'User'}</p>
                        <p className="text-sm text-gray-500">{user._id || user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.phoneNumber || user.phone || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}>
                      {user.role || 'user'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">{user.totalOrders || user.ordersCount || 0}</td>
                  <td className="py-3 px-4">
                    {new Date(user.createdAt || user.joinDate || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="View user"
                    >
                      <IoEye size={18} />
                    </button>
                    <button
                      onClick={() => onUpdateRole(user._id || user.id, user.role === 'admin' ? 'user' : 'admin')}
                      className="px-2 py-1 text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 rounded"
                      title={user.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                    >
                      {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                    </button>
                    <button
                      onClick={() => onToggleStatus(user._id || user.id, !user.isActive)}
                      className={`px-2 py-1 text-xs rounded ${
                        user.isActive
                          ? 'text-orange-700 bg-orange-50 hover:bg-orange-100'
                          : 'text-green-700 bg-green-50 hover:bg-green-100'
                      }`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${user.name || user.email}? This cannot be undone.`)) {
                          onDeleteUser(user._id || user.id)
                        }
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete user"
                    >
                      <IoTrash size={18} />
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold">User Details</h4>
              <button onClick={() => setSelectedUser(null)} className="p-1 hover:bg-gray-100 rounded">
                <IoClose size={20} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-right">{selectedUser.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-right">{selectedUser.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium text-right">{selectedUser.phoneNumber || selectedUser.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Role</span>
                <span className="font-medium capitalize">{selectedUser.role || 'user'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Status</span>
                <span className="font-medium">{selectedUser.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Total Orders</span>
                <span className="font-medium">{selectedUser.totalOrders || selectedUser.ordersCount || 0}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Last Login</span>
                <span className="font-medium text-right">
                  {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Joined</span>
                <span className="font-medium text-right">
                  {new Date(selectedUser.createdAt || Date.now()).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== SOLAR INQUIRIES TABLE ====================
export const SolarInquiriesTable = ({
  inquiries,
  loading,
  onUpdateStatus,
  onRefresh,
  getStatusBadgeColor
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Solar Installation Inquiries</h3>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <IoSync className={loading ? 'animate-spin' : ''} /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <IoSunny className="text-4xl mx-auto mb-2 opacity-50" />
          <p>No solar inquiries found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Contact</th>
                <th className="text-left py-3 px-4">System Size</th>
                <th className="text-left py-3 px-4">Property Type</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(inquiry => (
                <tr key={inquiry._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium">{inquiry.name || inquiry.customerName}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm">{inquiry.email}</p>
                      <p className="text-sm text-gray-500">{inquiry.phone}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{inquiry.systemCapacity || inquiry.systemSize || inquiry.capacity || 'N/A'} kW</td>
                  <td className="py-3 px-4 capitalize">{inquiry.propertyType || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <select
                      value={inquiry.status}
                      onChange={(e) => onUpdateStatus(inquiry._id, e.target.value)}
                      className={`px-2 py-1 rounded text-sm border ${getStatusBadgeColor(inquiry.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                      <option value="site_visited">Site Visited</option>
                      <option value="converted">Converted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(inquiry.createdAt || inquiry.date || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <IoEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ==================== SUBSIDY APPLICATIONS TABLE ====================
export const SubsidyApplicationsTable = ({
  applications,
  loading,
  onUpdateStatus,
  onRefresh,
  getStatusBadgeColor
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Subsidy Applications</h3>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <IoSync className={loading ? 'animate-spin' : ''} /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <IoLeaf className="text-4xl mx-auto mb-2 opacity-50" />
          <p>No subsidy applications found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Application ID</th>
                <th className="text-left py-3 px-4">Applicant</th>
                <th className="text-left py-3 px-4">Scheme</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm">#{app.applicationId || app._id?.slice(-8)}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium">{app.userId?.name || app.user?.name || app.applicantName || app.name}</p>
                    <p className="text-sm text-gray-500">{app.userId?.email || app.user?.email || app.email}</p>
                  </td>
                  <td className="py-3 px-4">{app.schemeName || app.schemeId?.name || 'N/A'}</td>
                  <td className="py-3 px-4">₹{app.appliedAmount?.toLocaleString('en-IN') || app.amount?.toLocaleString('en-IN') || 0}</td>
                  <td className="py-3 px-4">
                    <select
                      value={app.status}
                      onChange={(e) => onUpdateStatus(app._id, e.target.value, app.approvedAmount)}
                      className={`px-2 py-1 rounded text-sm border ${getStatusBadgeColor(app.status)}`}
                    >
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="disbursed">Disbursed</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(app.applicationDate || app.createdAt || app.date || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <IoEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ==================== SERVICE REQUESTS TABLE ====================
export const ServiceRequestsTable = ({
  requests,
  loading,
  onUpdateStatus,
  onRefresh,
  getStatusBadgeColor
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Service Requests</h3>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <IoSync className={loading ? 'animate-spin' : ''} /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <IoFlash className="text-4xl mx-auto mb-2 opacity-50" />
          <p>No service requests found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Request ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Service Type</th>
                <th className="text-left py-3 px-4">Location</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(request => (
                <tr key={request._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm">#{request.requestId || request._id?.slice(-8)}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium">{request.userId?.name || request.user?.name || request.customerName || request.name}</p>
                    <p className="text-sm text-gray-500">{request.userId?.phone || request.userId?.email || request.user?.phone || request.phone}</p>
                  </td>
                  <td className="py-3 px-4 capitalize">{request.serviceType || request.type}</td>
                  <td className="py-3 px-4 text-sm">{request.location?.address || request.address || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <select
                      value={request.status}
                      onChange={(e) => onUpdateStatus(request._id, e.target.value)}
                      className={`px-2 py-1 rounded text-sm border ${getStatusBadgeColor(request.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="quoted">Quoted</option>
                      <option value="approved">Approved</option>
                      <option value="installed">Installed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(request.createdAt || request.date || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <IoEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}