import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button, Input, Badge } from '../components/UI'
import { useAuth } from '../hooks/useAuth'
import { getProfile, updateProfile, changePassword } from '../api/authAPI'
import { getOrders, cancelOrder } from '../api/ordersAPI'
import {
  IoPerson,
  IoLocation,
  IoBag,
  IoSettings,
  IoLockClosed,
  IoAdd,
  IoTrash,
  IoCheckmarkCircle,
  IoStar,
  IoCart,
  IoHeart,
} from 'react-icons/io5'

const TABS = [
  { id: 'overview', label: 'Overview', icon: IoPerson },
  { id: 'orders', label: 'Orders', icon: IoBag },
  { id: 'addresses', label: 'Addresses', icon: IoLocation },
  { id: 'settings', label: 'Settings', icon: IoSettings },
  { id: 'security', label: 'Security', icon: IoLockClosed },
]

const EMPTY_ADDRESS = {
  fullName: '',
  phoneNumber: '',
  pincode: '',
  address: '',
  landmark: '',
  city: '',
  state: '',
  isDefault: false,
}

const ORDER_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

export default function Profile() {
  const { user: authUser, setAuthUser } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)

  const [personalForm, setPersonalForm] = useState({ name: '', phoneNumber: '' })
  const [preferences, setPreferences] = useState({
    language: 'en',
    newsletter: true,
    notifications: true,
  })
  const [addresses, setAddresses] = useState([])
  const [editingAddressIndex, setEditingAddressIndex] = useState(null)
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    loadProfile()
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (activeTab === 'orders' && orders.length === 0 && !ordersLoading) {
      loadOrders()
    }
  }, [activeTab])

  async function loadProfile() {
    setLoading(true)
    try {
      const data = await getProfile()
      const user = data.user || data
      setProfile(user)
      setPersonalForm({
        name: user.name || '',
        phoneNumber: user.phoneNumber || '',
      })
      setPreferences(user.preferences || { language: 'en', newsletter: true, notifications: true })
      setAddresses(user.addresses || [])
      setAuthUser(user)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  async function loadOrders() {
    setOrdersLoading(true)
    try {
      const data = await getOrders()
      setOrders(data.orders || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load orders')
    } finally {
      setOrdersLoading(false)
    }
  }

  async function handleSavePersonal(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const data = await updateProfile({
        name: personalForm.name,
        phoneNumber: personalForm.phoneNumber,
      })
      const user = data.user
      setProfile(user)
      setAuthUser(user)
      toast.success('Profile updated')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  async function handleSavePreferences() {
    setSaving(true)
    try {
      const data = await updateProfile({ preferences })
      const user = data.user
      setProfile(user)
      setAuthUser(user)
      toast.success('Preferences saved')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  function startAddAddress() {
    setEditingAddressIndex('new')
    setAddressForm({ ...EMPTY_ADDRESS, isDefault: addresses.length === 0 })
  }

  function startEditAddress(index) {
    const addr = addresses[index]
    setEditingAddressIndex(index)
    setAddressForm({
      fullName: addr.fullName || '',
      phoneNumber: addr.phoneNumber || '',
      pincode: addr.pincode || '',
      address: addr.address || '',
      landmark: addr.landmark || '',
      city: addr.city || '',
      state: addr.state || '',
      isDefault: addr.isDefault || false,
    })
  }

  function cancelAddressEdit() {
    setEditingAddressIndex(null)
    setAddressForm(EMPTY_ADDRESS)
  }

  async function handleSaveAddress(e) {
    e.preventDefault()
    const required = ['fullName', 'phoneNumber', 'pincode', 'address', 'city', 'state']
    const missing = required.filter((f) => !addressForm[f]?.trim())
    if (missing.length) {
      toast.error('Please fill all required address fields')
      return
    }

    let updated = [...addresses]
    const newAddr = { ...addressForm }

    if (newAddr.isDefault) {
      updated = updated.map((a) => ({ ...a, isDefault: false }))
    }

    if (editingAddressIndex === 'new') {
      updated.push(newAddr)
    } else {
      updated[editingAddressIndex] = { ...updated[editingAddressIndex], ...newAddr }
    }

    setSaving(true)
    try {
      const data = await updateProfile({ addresses: updated })
      const user = data.user
      setProfile(user)
      setAddresses(user.addresses || [])
      setAuthUser(user)
      cancelAddressEdit()
      toast.success('Address saved')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save address')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAddress(index) {
    if (!window.confirm('Delete this address?')) return
    const updated = addresses.filter((_, i) => i !== index)
    if (updated.length && !updated.some((a) => a.isDefault)) {
      updated[0] = { ...updated[0], isDefault: true }
    }
    setSaving(true)
    try {
      const data = await updateProfile({ addresses: updated })
      const user = data.user
      setProfile(user)
      setAddresses(user.addresses || [])
      setAuthUser(user)
      toast.success('Address removed')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete address')
    } finally {
      setSaving(false)
    }
  }

  async function handleSetDefault(index) {
    const updated = addresses.map((a, i) => ({ ...a, isDefault: i === index }))
    setSaving(true)
    try {
      const data = await updateProfile({ addresses: updated })
      const user = data.user
      setAddresses(user.addresses || [])
      setAuthUser(user)
      toast.success('Default address updated')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update default address')
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setSaving(true)
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Password changed successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  async function handleCancelOrder(orderId) {
    if (!window.confirm('Cancel this order?')) return
    try {
      await cancelOrder(orderId, 'Cancelled by customer')
      toast.success('Order cancelled')
      loadOrders()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not cancel order')
    }
  }

  const displayUser = profile || authUser

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-agro-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-agro-background min-h-screen">
      <div className="bg-gradient-to-r from-agro-primary to-agro-primary-light text-white">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold shrink-0">
              {displayUser?.profileImage ? (
                <img
                  src={displayUser.profileImage}
                  alt={displayUser.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                (displayUser?.name || 'U').charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold">{displayUser?.name}</h1>
              <p className="text-white/80 mt-1">{displayUser?.email}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className="bg-white/20 text-white capitalize">{displayUser?.role || 'user'}</Badge>
                <Badge className="bg-white/20 text-white">
                  Member since {formatDate(displayUser?.createdAt)}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
              <div className="bg-white/10 rounded-xl px-5 py-3 text-center">
                <p className="text-2xl font-bold">{displayUser?.totalOrders ?? orders.length}</p>
                <p className="text-sm text-white/70">Orders</p>
              </div>
              <div className="bg-white/10 rounded-xl px-5 py-3 text-center">
                <p className="text-2xl font-bold flex items-center justify-center gap-1">
                  <IoStar className="text-agro-accent" />
                  {displayUser?.loyaltyPoints || 0}
                </p>
                <p className="text-sm text-white/70">Points</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <nav className="lg:w-56 shrink-0">
            <div className="bg-white rounded-xl shadow-soft p-2 flex lg:flex-col gap-1 overflow-x-auto">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    activeTab === id
                      ? 'bg-agro-primary text-white'
                      : 'text-gray-600 hover:bg-agro-background'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>

            <div className="hidden lg:block mt-6 bg-white rounded-xl shadow-soft p-4 space-y-2">
              <Link
                to="/cart"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-agro-primary py-2"
              >
                <IoCart size={18} /> My Cart
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-agro-primary py-2"
              >
                <IoHeart size={18} /> Wishlist
              </Link>
              <Link
                to="/products"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-agro-primary py-2"
              >
                <IoBag size={18} /> Shop Products
              </Link>
            </div>
          </nav>

          <div className="flex-1 min-w-0">
            {activeTab === 'overview' && (
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h2 className="text-xl font-bold text-agro-dark mb-6">Personal Information</h2>
                <form onSubmit={handleSavePersonal} className="space-y-4 max-w-lg">
                  <Input
                    label="Full Name"
                    value={personalForm.name}
                    onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    value={displayUser?.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                  <Input
                    label="Phone Number"
                    value={personalForm.phoneNumber}
                    onChange={(e) => setPersonalForm({ ...personalForm, phoneNumber: e.target.value })}
                    placeholder="10-digit mobile number"
                  />
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-agro-dark">Order History</h2>
                {ordersLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-10 h-10 border-4 border-agro-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-soft p-12 text-center">
                    <IoBag className="mx-auto text-5xl text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">No orders yet</p>
                    <Link to="/products">
                      <Button>Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-xl shadow-soft p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <p className="font-semibold text-agro-dark">
                            Order #{order.orderNumber || order._id?.slice(-8)}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                              ORDER_STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                          <p className="font-bold text-agro-primary">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                      </div>
                      <ul className="divide-y divide-gray-100">
                        {(order.items || []).map((item, idx) => (
                          <li key={idx} className="flex items-center gap-4 py-3">
                            {item.productImage && (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-14 h-14 rounded-lg object-cover bg-gray-100"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.productName}</p>
                              <p className="text-sm text-gray-500">
                                Qty {item.quantity} × {formatCurrency(item.price)}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                      {!['shipped', 'delivered', 'cancelled'].includes(order.orderStatus) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-agro-dark">Saved Addresses</h2>
                  {editingAddressIndex === null && (
                    <Button size="sm" onClick={startAddAddress}>
                      <IoAdd size={18} /> Add Address
                    </Button>
                  )}
                </div>

                {editingAddressIndex !== null && (
                  <div className="bg-white rounded-xl shadow-soft p-6">
                    <h3 className="font-semibold mb-4">
                      {editingAddressIndex === 'new' ? 'New Address' : 'Edit Address'}
                    </h3>
                    <form onSubmit={handleSaveAddress} className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name *"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        required
                      />
                      <Input
                        label="Phone *"
                        value={addressForm.phoneNumber}
                        onChange={(e) => setAddressForm({ ...addressForm, phoneNumber: e.target.value })}
                        required
                      />
                      <Input
                        label="Pincode *"
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        required
                      />
                      <Input
                        label="City *"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        required
                      />
                      <Input
                        label="State *"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        required
                      />
                      <Input
                        label="Landmark"
                        value={addressForm.landmark}
                        onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                      />
                      <div className="sm:col-span-2">
                        <Input
                          label="Street Address *"
                          value={addressForm.address}
                          onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                          required
                        />
                      </div>
                      <label className="sm:col-span-2 flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={addressForm.isDefault}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, isDefault: e.target.checked })
                          }
                          className="rounded border-gray-300 text-agro-primary"
                        />
                        Set as default address
                      </label>
                      <div className="sm:col-span-2 flex gap-2">
                        <Button type="submit" disabled={saving}>
                          Save Address
                        </Button>
                        <Button type="button" variant="ghost" onClick={cancelAddressEdit}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {addresses.length === 0 && editingAddressIndex === null ? (
                  <div className="bg-white rounded-xl shadow-soft p-12 text-center text-gray-500">
                    No saved addresses. Add one for faster checkout.
                  </div>
                ) : (
                  addresses.map((addr, index) => (
                    <div key={addr._id || index} className="bg-white rounded-xl shadow-soft p-6">
                      <div className="flex justify-between gap-4">
                        <div>
                          {addr.isDefault && (
                            <Badge className="bg-agro-primary/10 text-agro-primary mb-2">
                              Default
                            </Badge>
                          )}
                          <p className="font-semibold">{addr.fullName}</p>
                          <p className="text-gray-600 text-sm mt-1">
                            {addr.address}
                            {addr.landmark ? `, ${addr.landmark}` : ''}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {addr.city}, {addr.state} — {addr.pincode}
                          </p>
                          <p className="text-gray-500 text-sm mt-1">{addr.phoneNumber}</p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          {!addr.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleSetDefault(index)}
                              className="text-sm text-agro-primary hover:underline"
                            >
                              Set default
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => startEditAddress(index)}
                            className="text-sm text-gray-600 hover:text-agro-primary"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(index)}
                            className="text-sm text-red-600 hover:underline flex items-center gap-1"
                          >
                            <IoTrash size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-soft p-6 max-w-lg">
                <h2 className="text-xl font-bold text-agro-dark mb-6">Preferences</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-agro-dark mb-2">Language</label>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-agro-primary outline-none"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                    </select>
                  </div>
                  <label className="flex items-center justify-between gap-4 cursor-pointer">
                    <span className="text-sm font-medium">Email newsletter</span>
                    <input
                      type="checkbox"
                      checked={preferences.newsletter}
                      onChange={(e) =>
                        setPreferences({ ...preferences, newsletter: e.target.checked })
                      }
                      className="w-5 h-5 rounded text-agro-primary"
                    />
                  </label>
                  <label className="flex items-center justify-between gap-4 cursor-pointer">
                    <span className="text-sm font-medium">Order notifications</span>
                    <input
                      type="checkbox"
                      checked={preferences.notifications}
                      onChange={(e) =>
                        setPreferences({ ...preferences, notifications: e.target.checked })
                      }
                      className="w-5 h-5 rounded text-agro-primary"
                    />
                  </label>
                  <Button onClick={handleSavePreferences} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-xl shadow-soft p-6 max-w-lg">
                <h2 className="text-xl font-bold text-agro-dark mb-6">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    required
                    minLength={6}
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    required
                  />
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
                {displayUser?.lastLogin && (
                  <p className="text-sm text-gray-500 mt-6 flex items-center gap-2">
                    <IoCheckmarkCircle className="text-green-500" />
                    Last login: {formatDate(displayUser.lastLogin)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
