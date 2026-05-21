import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Badge } from '../components/UI'
import { 
  IoAdd, IoBarChart, IoCart, IoPeople, IoCube, 
  IoCreate, IoTrash, IoEye, IoClose, IoSearch,
  IoDownload, IoSync, IoStatsChart, IoTrendingUp,
  IoTrendingDown, IoPricetag, IoSunny, IoLeaf, IoFlash,
  IoDocument, IoCashOutline, IoGrid, IoList,
  IoFilter, IoRefresh, IoArrowUp, IoArrowDown,
  IoCheckmarkCircle, IoAlertCircle, IoTime,
  IoWallet, IoBag, IoPerson, IoStorefront,
  IoNewspaper, IoSettings, IoLogOut, IoMenu,
  IoColorPalette, IoGlobe, IoLockClosed, IoNotifications,
  IoMail, IoMoon, IoShield
} from 'react-icons/io5'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getDashboardStats,
  getAllOrders,
  getAllProductsAdmin,
  getAllUsers,
  createAdminUser,
  updateUserRole,
  toggleUserStatus,
  deleteUserAdmin,
  updateOrderStatus,
  bulkUpdateOrders,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  bulkDeleteProducts,
  getLowStockProducts,
  getAllSolarInquiries,
  getAllSubsidyApplications,
  updateSolarInquiryStatus,
  updateSubsidyStatus,
  exportOrdersToCSV,
  exportProductsToCSV,
  getRevenueAnalytics,
  getProductAnalytics
} from '../api/adminAPI'
import {
  getServiceRequests,
  updateServiceStatus
} from '../api/servicesAPI'
import {
  RevenueChart,
  RecentOrders,
  LowStockProducts,
  ProductCard,
  ProductForm,
  ProductViewModal,
  DeleteConfirmationModal,
  BulkDeleteModal,
  StatCard,
  TabButton,
  OrdersTable,
  UsersTable,
  SolarInquiriesTable,
  SubsidyApplicationsTable,
  ServiceRequestsTable
} from '../components/AdminDashboardComponents'
import BlogAdmin from './admin/BlogAdmin';
import LoanAdmin from './admin/LoanAdmin'
import { getAllCategories } from '../api/categoriesAPI' // Add this import
import { useAuth } from '../hooks/useAuth'

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Modern Stat Card Component
const ModernStatCard = ({ title, value, change, icon: Icon, color, trend, onClick }) => {
  const colors = {
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600'
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Icon className="text-2xl text-white" />
          </div>
        </div>
        
        <p className="text-3xl font-bold text-white mb-2">{value}</p>
        
        <div className="flex items-center gap-2">
          {trend === 'up' ? (
            <IoArrowUp className="text-green-300" />
          ) : trend === 'down' ? (
            <IoArrowDown className="text-red-300" />
          ) : null}
          <span className="text-sm text-white/80">{change}</span>
        </div>
      </div>
    </motion.div>
  )
}

// Modern Tab Button
const ModernTabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`relative px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
      active 
        ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30' 
        : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-green-600'
    }`}
  >
    <Icon className="text-xl" />
    <span>{label}</span>
    {count > 0 && (
      <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        active ? 'bg-yellow-400 text-gray-900' : 'bg-red-500 text-white'
      }`}>
        {count}
      </span>
    )}
  </motion.button>
)

// Quick Action Card
const QuickActionCard = ({ icon: Icon, title, description, onClick, color }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100"
  >
    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
      <Icon className="text-2xl text-white" />
    </div>
    <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </motion.div>
)

// Activity Timeline Component
const ActivityTimeline = ({ activities }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <IoTime className="text-green-600" /> Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className={`w-8 h-8 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0`}>
              <activity.icon className="text-white text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">{activity.text}</p>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Performance Chart Card
const PerformanceCard = ({ title, value, subValue, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{subValue}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
        <Icon className="text-2xl text-white" />
      </div>
    </div>
    <div className="flex items-center gap-2 text-sm">
      {trend > 0 ? (
        <>
          <IoTrendingUp className="text-green-500" />
          <span className="text-green-500">+{trend}%</span>
        </>
      ) : (
        <>
          <IoTrendingDown className="text-red-500" />
          <span className="text-red-500">{trend}%</span>
        </>
      )}
      <span className="text-gray-400">vs last month</span>
    </div>
  </div>
)

// Settings Modal Component - Modern UI
const SettingsModal = ({ isOpen, onClose }) => {
  const [settingsTab, setSettingsTab] = useState('general')
  const [settings, setSettings] = useState({
    siteName: 'AgroMart',
    siteUrl: 'https://agromart.com',
    adminEmail: 'admin@agromart.com',
    itemsPerPage: 10,
    enableNotifications: true,
    enableEmailAlerts: true,
    darkMode: false,
    language: 'en',
    timezone: 'Asia/Kolkata'
  })

  const handleSave = () => {
    toast.success('Settings saved successfully!')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <IoSettings className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <p className="text-green-100 text-sm">Manage your application preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 rounded-xl hover:bg-white/30 transition flex items-center justify-center group"
          >
            <IoClose className="text-xl text-white group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-100px)]">
          {/* Settings Sidebar - Modern Design */}
          <div className="w-72 bg-gradient-to-b from-gray-50 to-white p-6 border-r border-gray-200">
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Navigation</p>
              <div className="space-y-2">
                {[
                  { id: 'general', icon: IoGlobe, label: 'General', desc: 'Basic settings', color: 'from-blue-500 to-blue-600' },
                  { id: 'notifications', icon: IoNotifications, label: 'Notifications', desc: 'Alert preferences', color: 'from-yellow-500 to-yellow-600' },
                  { id: 'appearance', icon: IoColorPalette, label: 'Appearance', desc: 'Theme & layout', color: 'from-purple-500 to-purple-600' },
                  { id: 'security', icon: IoLockClosed, label: 'Security', desc: 'Privacy & safety', color: 'from-red-500 to-red-600' }
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSettingsTab(item.id)}
                    className={`w-full p-4 rounded-xl transition-all relative overflow-hidden group ${
                      settingsTab === item.id 
                        ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {settingsTab === item.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500"
                        initial={false}
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        settingsTab === item.id 
                          ? 'bg-white/20' 
                          : `bg-gradient-to-br ${item.color} bg-opacity-10`
                      }`}>
                        <item.icon className={`text-xl ${
                          settingsTab === item.id ? 'text-white' : `text-${item.color.split('-')[1]}-600`
                        }`} />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{item.label}</p>
                        <p className={`text-xs ${settingsTab === item.id ? 'text-white/80' : 'text-gray-400'}`}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items per page</span>
                  <span className="font-semibold text-green-600">{settings.itemsPerPage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Notifications</span>
                  <span className={`font-semibold ${settings.enableNotifications ? 'text-green-600' : 'text-red-600'}`}>
                    {settings.enableNotifications ? 'On' : 'Off'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Language</span>
                  <span className="font-semibold text-blue-600">{settings.language.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Content - Modern Cards */}
          <div className="flex-1 p-8 overflow-y-auto bg-gray-50/50">
            <AnimatePresence mode="wait">
              <motion.div
                key={settingsTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {settingsTab === 'general' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <IoGlobe className="text-xl text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">General Settings</h3>
                    </div>
                    
                    <div className="grid gap-6">
                      {/* Site Name Card */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition pr-10"
                            placeholder="Enter site name"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>

                      {/* Site URL Card */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site URL
                        </label>
                        <input
                          type="url"
                          value={settings.siteUrl}
                          onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition"
                          placeholder="https://example.com"
                        />
                      </div>

                      {/* Admin Email Card */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Email
                        </label>
                        <input
                          type="email"
                          value={settings.adminEmail}
                          onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition"
                          placeholder="admin@example.com"
                        />
                      </div>

                      {/* Items Per Page Card */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Items Per Page
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[10, 20, 50, 100].map((value) => (
                            <button
                              key={value}
                              onClick={() => setSettings({ ...settings, itemsPerPage: value })}
                              className={`py-3 rounded-xl font-semibold transition ${
                                settings.itemsPerPage === value
                                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Language & Timezone Grid */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                          </label>
                          <select
                            value={settings.language}
                            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition bg-white"
                          >
                            <option value="en">🇬🇧 English</option>
                            <option value="hi">🇮🇳 Hindi</option>
                            <option value="gu">🇮🇳 Gujarati</option>
                            <option value="mr">🇮🇳 Marathi</option>
                            <option value="ta">🇮🇳 Tamil</option>
                          </select>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                          </label>
                          <select
                            value={settings.timezone}
                            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition bg-white"
                          >
                            <option value="Asia/Kolkata">🇮🇳 Asia/Kolkata (IST)</option>
                            <option value="Asia/Dubai">🇦🇪 Asia/Dubai</option>
                            <option value="Asia/Singapore">🇸🇬 Asia/Singapore</option>
                            <option value="UTC">🌐 UTC</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                        <IoNotifications className="text-xl text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Notification Settings</h3>
                    </div>
                    
                    <div className="grid gap-4">
                      {/* Enable Notifications Card */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                              <IoNotifications className="text-2xl text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">Enable Notifications</p>
                              <p className="text-sm text-gray-500">Receive browser notifications for important events</p>
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={settings.enableNotifications}
                              onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                              className="sr-only"
                              id="notifications"
                            />
                            <label
                              htmlFor="notifications"
                              className={`block w-14 h-8 rounded-full cursor-pointer transition ${
                                settings.enableNotifications ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`block w-6 h-6 rounded-full bg-white shadow-md transform transition ${
                                  settings.enableNotifications ? 'translate-x-7' : 'translate-x-1'
                                } mt-1`}
                              ></span>
                            </label>
                          </div>
                        </label>
                      </div>

                      {/* Email Alerts Card */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                              <IoMail className="text-2xl text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">Email Alerts</p>
                              <p className="text-sm text-gray-500">Receive email notifications for new orders and inquiries</p>
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={settings.enableEmailAlerts}
                              onChange={(e) => setSettings({ ...settings, enableEmailAlerts: e.target.checked })}
                              className="sr-only"
                              id="emailAlerts"
                            />
                            <label
                              htmlFor="emailAlerts"
                              className={`block w-14 h-8 rounded-full cursor-pointer transition ${
                                settings.enableEmailAlerts ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`block w-6 h-6 rounded-full bg-white shadow-md transform transition ${
                                  settings.enableEmailAlerts ? 'translate-x-7' : 'translate-x-1'
                                } mt-1`}
                              ></span>
                            </label>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'appearance' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <IoColorPalette className="text-xl text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Appearance Settings</h3>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                            {settings.darkMode ? <IoSunny className="text-2xl text-white" /> : <IoMoon className="text-2xl text-white" />}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Dark Mode</p>
                            <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={settings.darkMode}
                            onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                            className="sr-only"
                            id="darkMode"
                          />
                          <label
                            htmlFor="darkMode"
                            className={`block w-14 h-8 rounded-full cursor-pointer transition ${
                              settings.darkMode ? 'bg-purple-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`block w-6 h-6 rounded-full bg-white shadow-md transform transition ${
                                settings.darkMode ? 'translate-x-7' : 'translate-x-1'
                              } mt-1`}
                            ></span>
                          </label>
                        </div>
                      </label>
                    </div>

                    {/* Theme Colors */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100">
                      <h4 className="font-semibold text-gray-800 mb-4">Theme Color</h4>
                      <div className="flex gap-3">
                        {['#2E7D32', '#0288D1', '#FBC02D', '#7B1FA2', '#C2185B'].map((color) => (
                          <button
                            key={color}
                            className="w-10 h-10 rounded-full ring-2 ring-offset-2 hover:scale-110 transition"
                            style={{ backgroundColor: color }}
                            onClick={() => toast.info('Theme color feature coming soon!')}
                          ></button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'security' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                        <IoLockClosed className="text-xl text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Security Settings</h3>
                    </div>
                    
                    <div className="grid gap-4">
                      {/* Change Password Card */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100 group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                              <IoLockClosed className="text-2xl text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">Change Password</p>
                              <p className="text-sm text-gray-500">Update your account password</p>
                            </div>
                          </div>
                          <button className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/30">
                            Update
                          </button>
                        </div>
                      </div>

                      {/* Two-Factor Authentication Card */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100 group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                              <IoShield className="text-2xl text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">Two-Factor Authentication</p>
                              <p className="text-sm text-gray-500">Add an extra layer of security</p>
                            </div>
                          </div>
                          <button className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-600/30">
                            Enable
                          </button>
                        </div>
                      </div>

                      {/* Activity Log Card */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100 group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                              <IoTime className="text-2xl text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">Activity Log</p>
                              <p className="text-sm text-gray-500">View recent account activity</p>
                            </div>
                          </div>
                          <button className="px-6 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition shadow-lg shadow-orange-600/30">
                            View Log
                          </button>
                        </div>
                      </div>

                      {/* Login Sessions Card */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100 group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                              <IoGlobe className="text-2xl text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">Login Sessions</p>
                              <p className="text-sm text-gray-500">Manage active sessions</p>
                            </div>
                          </div>
                          <button className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-600/30">
                            Manage
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer with gradient */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 p-6 flex justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-8 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition font-semibold text-gray-700"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 transition font-semibold shadow-lg shadow-green-600/30 flex items-center gap-2"
          >
            <IoCheckmarkCircle className="text-xl" />
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

// Logout Confirmation Modal
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Logout</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to logout from the admin panel?</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  // State Management
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalUsers: 0,
    totalAdmins: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    pendingOrders: 0,
    solarInstallations: 0,
    subsidyApplications: 0,
    lowStockCount: 0,
    pendingSolar: 0,
    pendingSubsidy: 0,
    pendingLoans: 0
  })
  
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [solarInquiries, setSolarInquiries] = useState([])
  const [subsidyApps, setSubsidyApps] = useState([])
  const [serviceRequests, setServiceRequests] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [productAnalytics, setProductAnalytics] = useState([])
  const [activities, setActivities] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const [categories, setCategories] = useState([]) // Add categories state
  
  const [loading, setLoading] = useState({
    stats: true,
    orders: false,
    products: false,
    users: false,
    solar: false,
    subsidy: false,
    services: false,
    analytics: false,
    categories: false // Add categories loading state
  })
  
  const [tab, setTab] = useState('dashboard')
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [selectedItems, setSelectedItems] = useState([])
  const [bulkAction, setBulkAction] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    mrp: '',
    category: '',
    stock: '',
    image: null,
    images: [],
    tags: '',
    isFeatured: false,
    isBestseller: false,
    subsidyEligible: false,
    subsidyPercentage: ''
  })

  const [editingProduct, setEditingProduct] = useState(null)
  const [viewingProduct, setViewingProduct] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)

  // Filter states
  const [orderFilters, setOrderFilters] = useState({
    status: '',
    paymentStatus: '',
    dateFrom: '',
    dateTo: ''
  })

  const [productFilters, setProductFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    featured: false
  })

  // Fetch categories function
  const fetchCategories = async () => {
    try {
      setLoading(prev => ({ ...prev, categories: true }))
      const response = await getAllCategories()
      console.log('📋 Fetched categories:', response)
      
      // Handle different response structures
      const categoriesData = response.data || response.categories || response
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
    } catch (error) {
      console.error('❌ Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(prev => ({ ...prev, categories: false }))
    }
  }

  // Generate sample activities
  const generateActivities = () => {
    return [
      { icon: IoCart, text: 'New order received from Rajesh Kumar', time: '2 minutes ago', color: 'bg-blue-500' },
      { icon: IoPerson, text: 'New user registered: Priya Sharma', time: '15 minutes ago', color: 'bg-green-500' },
      { icon: IoAlertCircle, text: 'Low stock alert: Organic Fertilizer', time: '1 hour ago', color: 'bg-yellow-500' },
      { icon: IoCheckmarkCircle, text: 'Subsidy application approved', time: '2 hours ago', color: 'bg-purple-500' },
      { icon: IoCashOutline, text: 'Loan application under review', time: '3 hours ago', color: 'bg-orange-500' }
    ]
  }

  // Fetch all data on mount
  useEffect(() => {
    fetchDashboardData()
    fetchCategories() // Fetch categories
    setActivities(generateActivities())
  }, [])

  // Fetch data based on tab change
  useEffect(() => {
    switch(tab) {
      case 'orders':
        fetchOrders()
        break
      case 'products':
      case 'product-list':
        fetchProducts()
        break
      case 'users':
        fetchUsers()
        break
      case 'solar':
        fetchSolarInquiries()
        break
      case 'subsidy':
        fetchSubsidyApplications()
        break
      case 'services':
        fetchServiceRequests()
        break
      case 'analytics':
        fetchAnalytics()
        break
      default:
        break
    }
  }, [tab, currentPage, orderFilters, productFilters, searchTerm])

  // Dashboard Data Fetch
  async function fetchDashboardData() {
    try {
      setLoading(prev => ({ ...prev, stats: true, analytics: true }))
      
      const [statsRes, analyticsRes, lowStockRes] = await Promise.allSettled([
        getDashboardStats(),
        getRevenueAnalytics(dateRange),
        getLowStockProducts()
      ])

      // Handle stats
      if (statsRes.status === 'fulfilled' && statsRes.value) {
        const statsData = statsRes.value.data || statsRes.value
        setStats(prev => ({
          ...prev,
          ...statsData,
          totalRevenue: statsData.totalRevenue ?? statsData.totalSales ?? prev.totalRevenue,
          lowStockCount: lowStockRes.status === 'fulfilled' ? lowStockRes.value?.data?.length || 0 : 0
        }))
      }
      
      // Handle analytics
      if (analyticsRes.status === 'fulfilled' && analyticsRes.value) {
        const revenueData = analyticsRes.value.data || analyticsRes.value
        setRevenueData(revenueData?.daily || revenueData?.revenue || [])
      }
      
      setError(null)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err.response?.data?.message || err.message)
      toast.error('Failed to fetch dashboard data')
    } finally {
      setLoading(prev => ({ ...prev, stats: false, analytics: false }))
    }
  }

  // Orders
  async function fetchOrders() {
    try {
      setLoading(prev => ({ ...prev, orders: true }))
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: orderFilters.status,
        paymentStatus: orderFilters.paymentStatus,
        startDate: orderFilters.dateFrom,
        endDate: orderFilters.dateTo,
        search: searchTerm
      }
      
      const res = await getAllOrders(params)
      setOrders(res.orders || res.data?.orders || [])
      setTotalPages(res.pagination?.pages || res.totalPages || res.data?.totalPages || 1)
    } catch (err) {
      console.error('Error fetching orders:', err)
      toast.error('Failed to fetch orders')
      setOrders([])
    } finally {
      setLoading(prev => ({ ...prev, orders: false }))
    }
  }

  // Products
  async function fetchProducts() {
    try {
      setLoading(prev => ({ ...prev, products: true }))
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        category: productFilters.category,
        minPrice: productFilters.minPrice,
        maxPrice: productFilters.maxPrice,
        inStock: productFilters.inStock,
        featured: productFilters.featured,
        search: searchTerm
      }
      
      const res = await getAllProductsAdmin(params)
      setProducts(res.products || res.data?.products || [])
      setTotalPages(res.pagination?.pages || res.totalPages || res.data?.totalPages || 1)
    } catch (err) {
      console.error('Error fetching products:', err)
      toast.error('Failed to fetch products')
      setProducts([])
    } finally {
      setLoading(prev => ({ ...prev, products: false }))
    }
  }

  // Users
  async function fetchUsers() {
    try {
      setLoading(prev => ({ ...prev, users: true }))
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        role: ''
      }
      
      const res = await getAllUsers(params)
      setUsers(Array.isArray(res.data) ? res.data : res.data?.users || res.users || [])
      setTotalPages(res.pagination?.pages || res.data?.totalPages || res.totalPages || 1)
      if (res.summary) {
        setStats(prev => ({
          ...prev,
          totalUsers: res.summary.totalUsers ?? prev.totalUsers,
          totalAdmins: res.summary.totalAdmins ?? prev.totalAdmins
        }))
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      toast.error('Failed to fetch users')
      setUsers([])
    } finally {
      setLoading(prev => ({ ...prev, users: false }))
    }
  }

  async function handleCreateAdmin(adminData) {
    try {
      await createAdminUser(adminData)
      toast.success('Admin created successfully')
      fetchUsers()
      fetchDashboardData()
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create admin'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  async function handleUpdateUserRole(userId, role) {
    try {
      await updateUserRole(userId, role)
      toast.success(`User role updated to ${role}`)
      fetchUsers()
      fetchDashboardData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user role')
    }
  }

  async function handleToggleUserStatus(userId, isActive) {
    try {
      await toggleUserStatus(userId, isActive)
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`)
      fetchUsers()
      fetchDashboardData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user status')
    }
  }

  async function handleDeleteUser(userId) {
    try {
      await deleteUserAdmin(userId)
      toast.success('User deleted successfully')
      fetchUsers()
      fetchDashboardData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user')
    }
  }

  // Solar Inquiries
  async function fetchSolarInquiries() {
    try {
      setLoading(prev => ({ ...prev, solar: true }))
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: '',
        search: searchTerm
      }
      
      const res = await getAllSolarInquiries(params)
      setSolarInquiries(Array.isArray(res.data) ? res.data : res.inquiries || res.data?.inquiries || [])
      setTotalPages(res.pagination?.pages || res.totalPages || res.data?.totalPages || 1)
    } catch (err) {
      console.error('Error fetching solar inquiries:', err)
      setSolarInquiries([])
    } finally {
      setLoading(prev => ({ ...prev, solar: false }))
    }
  }

  // Subsidy Applications
  async function fetchSubsidyApplications() {
    try {
      setLoading(prev => ({ ...prev, subsidy: true }))
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: '',
        search: searchTerm
      }
      
      const res = await getAllSubsidyApplications(params)
      setSubsidyApps(Array.isArray(res.data) ? res.data : res.applications || res.data?.applications || [])
      setTotalPages(res.pagination?.pages || res.totalPages || res.data?.totalPages || 1)
    } catch (err) {
      console.error('Error fetching subsidy applications:', err)
      setSubsidyApps([])
    } finally {
      setLoading(prev => ({ ...prev, subsidy: false }))
    }
  }

  // Service Requests
  async function fetchServiceRequests() {
    try {
      setLoading(prev => ({ ...prev, services: true }))
      const res = await getServiceRequests(currentPage, itemsPerPage)
      setServiceRequests(res.requests || res.data?.requests || [])
      setTotalPages(res.pagination?.pages || res.data?.totalPages || 1)
    } catch (err) {
      console.error('Error fetching service requests:', err)
      toast.error('Failed to fetch service requests')
      setServiceRequests([])
    } finally {
      setLoading(prev => ({ ...prev, services: false }))
    }
  }

  // Analytics
  async function fetchAnalytics() {
    try {
      setLoading(prev => ({ ...prev, analytics: true }))
      
      const [revenue, products] = await Promise.allSettled([
        getRevenueAnalytics(dateRange),
        getProductAnalytics()
      ])
      
      // Handle revenue data
      if (revenue.status === 'fulfilled' && revenue.value) {
        const revenueData = revenue.value.data || revenue.value
        setRevenueData(revenueData?.daily || revenueData?.revenue || [])
      } else {
        setRevenueData([])
      }
      
      // Handle product analytics
      if (products.status === 'fulfilled' && products.value) {
        const productData = products.value.data || products.value
        setProductAnalytics(productData?.topProducts || [])
      } else {
        setProductAnalytics([])
      }
      
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setRevenueData([])
      setProductAnalytics([])
    } finally {
      setLoading(prev => ({ ...prev, analytics: false }))
    }
  }

  // Update Order Status
  async function updateOrderStatusHandler(orderId, newStatus) {
    try {
      await updateOrderStatus(orderId, { status: newStatus })
      toast.success('Order status updated successfully!')
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status')
    }
  }

  // Bulk Update Orders
  async function bulkUpdateOrdersHandler() {
    if (selectedItems.length === 0) {
      toast.error('No orders selected')
      return
    }

    try {
      await bulkUpdateOrders({
        orderIds: selectedItems,
        action: bulkAction
      })
      toast.success(`${selectedItems.length} orders updated successfully!`)
      setSelectedItems([])
      setBulkAction('')
      fetchOrders()
    } catch (err) {
      toast.error('Failed to update orders')
    }
  }

  // Fixed handleAddProduct function
  async function handleAddProduct(e) {
    e.preventDefault()
    try {
      setSubmitting(true)
      
      console.log('📝 Product Form Data:', productForm);

      // Create FormData object
      const formData = new FormData()
      
      // Validate required fields
      if (!productForm.name || !productForm.description || !productForm.price || !productForm.category) {
        toast.error('Name, description, price, and category are required')
        setSubmitting(false)
        return
      }

      // Append all form fields
      Object.keys(productForm).forEach(key => {
        if (key === 'images' && productForm.images?.length > 0) {
          // Handle multiple images
          productForm.images.forEach((image) => {
            formData.append('thumbnails', image)
          })
        } else if (key === 'image' && productForm.image) {
          // Handle single image
          formData.append('primary', productForm.image)
        } else if (key === 'tags' && productForm.tags) {
          // Handle tags as JSON string
          const tagsArray = productForm.tags.split(',').map(t => t.trim())
          formData.append('tags', JSON.stringify(tagsArray))
        } else if (key === 'isFeatured' || key === 'isBestseller' || key === 'subsidyEligible') {
          // Handle boolean values
          formData.append(key, productForm[key] ? 'true' : 'false')
        } else if (key === 'price' || key === 'mrp' || key === 'stock' || key === 'subsidyPercentage') {
          // Handle numeric values
          if (productForm[key]) {
            formData.append(key, productForm[key].toString())
          }
        } else {
          // Handle all other fields
          if (productForm[key] !== null && productForm[key] !== undefined && productForm[key] !== '') {
            formData.append(key, productForm[key])
          }
        }
      })

      // Debug: Log FormData contents
      console.log('📦 FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }

      // Send the formData
      const res = await createProductAdmin(formData)
      
      toast.success('Product added successfully!')
      resetForm()
      fetchProducts()
      setTab('product-list')
    } catch (err) {
      console.error('❌ Error in handleAddProduct:', err)
      console.error('Error response:', err.response?.data)
      toast.error(err.response?.data?.message || 'Failed to add product')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdateProduct(e) {
    e.preventDefault()
    if (!editingProduct) return

    try {
      setSubmitting(true)

      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        mrp: parseFloat(productForm.mrp || productForm.price),
        category: productForm.category,
        stock: parseInt(productForm.stock),
        tags: productForm.tags ? productForm.tags.split(',').map(tag => tag.trim()) : [],
        isFeatured: productForm.isFeatured || false,
        isBestseller: productForm.isBestseller || false,
        subsidyEligible: productForm.subsidyEligible || false,
        subsidyPercentage: productForm.subsidyPercentage ? parseFloat(productForm.subsidyPercentage) : 0
      }

      await updateProductAdmin(editingProduct._id, productData)
      toast.success('Product updated successfully!')
      resetForm()
      setEditingProduct(null)
      fetchProducts()
      setTab('product-list')
    } catch (err) {
      console.error('❌ Error updating product:', err)
      toast.error(err.response?.data?.message || 'Failed to update product')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteProduct(productId) {
    try {
      await deleteProductAdmin(productId)
      toast.success('Product deleted successfully!')
      setShowDeleteModal(false)
      setProductToDelete(null)
      fetchProducts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product')
    }
  }

  async function handleBulkDeleteProducts() {
    if (selectedItems.length === 0) return

    try {
      await bulkDeleteProducts({ productIds: selectedItems })
      toast.success(`${selectedItems.length} products deleted successfully!`)
      setSelectedItems([])
      setShowBulkDeleteModal(false)
      fetchProducts()
    } catch (err) {
      toast.error('Failed to delete products')
    }
  }

  // Update Solar Inquiry Status
  async function updateSolarInquiryStatusHandler(inquiryId, status, notes = '') {
    try {
      await updateSolarInquiryStatus(inquiryId, { status, notes })
      toast.success('Inquiry status updated!')
      fetchSolarInquiries()
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  // Update Subsidy Status
  async function updateSubsidyStatusHandler(appId, status, approvedAmount = null) {
    try {
      await updateSubsidyStatus(appId, { status, approvedAmount })
      toast.success('Subsidy status updated!')
      fetchSubsidyApplications()
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  // Update Service Request Status
  async function updateServiceStatusHandler(requestId, status) {
    try {
      await updateServiceStatus(requestId, status)
      toast.success('Service request status updated!')
      fetchServiceRequests()
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  // Export Functions
  async function handleExportOrders() {
    try {
      const blob = await exportOrdersToCSV(orderFilters)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Orders exported successfully!')
    } catch (err) {
      toast.error('Failed to export orders')
    }
  }

  async function handleExportProducts() {
    try {
      const blob = await exportProductsToCSV(productFilters)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `products-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Products exported successfully!')
    } catch (err) {
      toast.error('Failed to export products')
    }
  }

  // Helper Functions
  function resetForm() {
    setProductForm({
      name: '',
      description: '',
      price: '',
      mrp: '',
      category: '',
      stock: '',
      image: null,
      images: [],
      tags: '',
      isFeatured: false,
      isBestseller: false,
      subsidyEligible: false,
      subsidyPercentage: ''
    })
  }

  function handleEditProduct(product) {
    setEditingProduct(product)
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      mrp: product.mrp?.toString() || product.price?.toString() || '',
      category: product.category?._id || product.category || '',
      stock: product.stock?.toString() || '',
      image: null,
      images: [],
      tags: product.tags?.join(', ') || '',
      isFeatured: product.isFeatured || false,
      isBestseller: product.isBestseller || false,
      subsidyEligible: product.subsidyEligible || false,
      subsidyPercentage: product.subsidyPercentage?.toString() || ''
    })
    setTab('edit-product')
  }

  function toggleSelectItem(itemId) {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  function selectAllItems(items) {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map(item => item._id || item.id))
    }
  }

  // Handle logout
  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // Get status badge color
  function getStatusBadgeColor(status) {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      installed: 'bg-green-100 text-green-800',
      quoted: 'bg-blue-100 text-blue-800',
      converted: 'bg-green-100 text-green-800',
      site_visited: 'bg-purple-100 text-purple-800',
      consulted: 'bg-blue-100 text-blue-800',
      'under-review': 'bg-orange-100 text-orange-800',
      under_review: 'bg-orange-100 text-orange-800',
      submitted: 'bg-gray-100 text-gray-800',
      disbursed: 'bg-indigo-100 text-indigo-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  // Render Dashboard Tab
  const renderDashboard = () => (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={fadeIn} className="bg-gradient-to-r from-green-600 to-green-500 rounded-3xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome back, Admin!</h2>
        <p className="text-green-50 mb-6">Here's what's happening with your store today.</p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-white text-green-600 px-6 py-2 rounded-xl font-semibold hover:bg-green-50 transition flex items-center gap-2">
            <IoAdd /> Quick Action
          </button>
          <button 
            onClick={fetchDashboardData}
            className="bg-green-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-600 transition border border-white/30 flex items-center gap-2"
          >
            <IoRefresh /> Refresh
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernStatCard
          title="Total Orders"
          value={stats.totalOrders}
          change="+12.5% from last month"
          icon={IoCart}
          color="green"
          trend="up"
          onClick={() => setTab('orders')}
        />
        <ModernStatCard
          title="Total Revenue"
          value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
          change="+8.2% from last month"
          icon={IoWallet}
          color="blue"
          trend="up"
        />
        <ModernStatCard
          title="Products"
          value={stats.totalProducts}
          change={stats.lowStockCount > 0 ? `${stats.lowStockCount} low in stock` : 'All stocked'}
          icon={IoCube}
          color="purple"
          trend={stats.lowStockCount > 0 ? 'down' : 'up'}
          onClick={() => setTab('products')}
        />
        <ModernStatCard
          title="Customers"
          value={stats.totalCustomers}
          change="+5.3% from last month"
          icon={IoPeople}
          color="orange"
          trend="up"
          onClick={() => setTab('users')}
        />
        <ModernStatCard
          title="Admins"
          value={stats.totalAdmins}
          change={`${stats.activeUsers || 0} active users`}
          icon={IoShield}
          color="red"
          trend="up"
          onClick={() => setTab('users')}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeIn}>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionCard
            icon={IoAdd}
            title="Add Product"
            description="Create a new product listing"
            onClick={() => {
              resetForm()
              setEditingProduct(null)
              setTab('products')
            }}
            color="from-blue-500 to-blue-600"
          />
          <QuickActionCard
            icon={IoCart}
            title="View Orders"
            description="Check pending orders"
            onClick={() => setTab('orders')}
            color="from-green-500 to-green-600"
          />
          <QuickActionCard
            icon={IoPeople}
            title="Manage Users"
            description="View and manage users"
            onClick={() => setTab('users')}
            color="from-purple-500 to-purple-600"
          />
          <QuickActionCard
            icon={IoDocument}
            title="Blog Posts"
            description="Create or edit blog posts"
            onClick={() => setTab('blog')}
            color="from-orange-500 to-orange-600"
          />
        </div>
      </motion.div>

      {/* Performance Overview */}
      <motion.div variants={fadeIn} className="grid md:grid-cols-3 gap-6">
        <PerformanceCard
          title="Today's Revenue"
          value={`₹${(stats.totalRevenue ? stats.totalRevenue / 30 : 0).toLocaleString()}`}
          subValue="Estimated for today"
          icon={IoCashOutline}
          color="from-green-500 to-green-600"
          trend={12}
        />
        <PerformanceCard
          title="Pending Orders"
          value={stats.pendingOrders}
          subValue="Awaiting processing"
          icon={IoTime}
          color="from-yellow-500 to-yellow-600"
          trend={-5}
        />
        <PerformanceCard
          title="Conversion Rate"
          value="68.5%"
          subValue="Average this month"
          icon={IoTrendingUp}
          color="from-blue-500 to-blue-600"
          trend={8}
        />
      </motion.div>

      {/* Solar & Subsidy Stats */}
      <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Solar Installations</h3>
              <p className="text-yellow-100 text-sm">Active inquiries and installations</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <IoSunny className="text-3xl" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-3xl font-bold">{stats.solarInstallations || 0}</p>
              <p className="text-sm text-yellow-100">Total Installations</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.pendingSolar || 0}</p>
              <p className="text-sm text-yellow-100">Pending Inquiries</p>
            </div>
          </div>
          <button 
            onClick={() => setTab('solar')}
            className="mt-4 w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 rounded-xl font-semibold transition"
          >
            Manage Solar
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Subsidy Applications</h3>
              <p className="text-green-100 text-sm">Government subsidy requests</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <IoLeaf className="text-3xl" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-3xl font-bold">{stats.subsidyApplications || 0}</p>
              <p className="text-sm text-green-100">Total Applications</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.pendingSubsidy || 0}</p>
              <p className="text-sm text-green-100">Pending Approval</p>
            </div>
          </div>
          <button 
            onClick={() => setTab('subsidy')}
            className="mt-4 w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 rounded-xl font-semibold transition"
          >
            Review Applications
          </button>
        </div>
      </motion.div>

      {/* Charts and Activity */}
      <motion.div variants={fadeIn} className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Takes 2 columns on large screens */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Revenue Overview</h3>
              <p className="text-sm text-gray-500">Monthly revenue analysis</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition">Weekly</button>
              <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium">Monthly</button>
              <button className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition">Yearly</button>
            </div>
          </div>
          {loading.analytics ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <RevenueChart data={revenueData} />
          )}
        </div>

        {/* Activity Timeline */}
        <div className="lg:col-span-1">
          <ActivityTimeline activities={activities} />
        </div>
      </motion.div>

      {/* Recent Orders & Low Stock */}
      <motion.div variants={fadeIn} className="grid md:grid-cols-2 gap-6">
        <RecentOrders orders={orders.slice(0, 5)} onViewAll={() => setTab('orders')} />
        <LowStockProducts onManage={() => setTab('products')} />
      </motion.div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
              >
                <IoMenu className="text-xl" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center">
                  <IoStorefront className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">AgroMart</h1>
                  <p className="text-xs text-gray-500">Admin Dashboard</p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders, products, users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowSettings(true)}
                className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                title="Settings"
              >
                <IoSettings className="text-xl" />
              </button>
              <button 
                onClick={() => setShowLogout(true)}
                className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                title="Logout"
              >
                <IoLogOut className="text-xl" />
              </button>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Date Range Selector */}
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <Badge className="bg-green-100 text-green-700">Admin</Badge>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button 
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <IoFilter /> Apply
            </button>
          </div>
        </div>

        {/* Modern Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <ModernTabButton
            active={tab === 'dashboard'}
            onClick={() => setTab('dashboard')}
            icon={IoBarChart}
            label="Dashboard"
          />
          <ModernTabButton
            active={tab === 'orders'}
            onClick={() => setTab('orders')}
            icon={IoCart}
            label="Orders"
            count={stats.pendingOrders}
          />
          <ModernTabButton
            active={tab === 'products' || tab === 'product-list' || tab === 'edit-product'}
            onClick={() => setTab('product-list')}
            icon={IoCube}
            label="Products"
          />
          <ModernTabButton
            active={tab === 'users'}
            onClick={() => setTab('users')}
            icon={IoPeople}
            label="Users"
          />
          <ModernTabButton
            active={tab === 'solar'}
            onClick={() => setTab('solar')}
            icon={IoSunny}
            label="Solar"
          />
          <ModernTabButton
            active={tab === 'subsidy'}
            onClick={() => setTab('subsidy')}
            icon={IoLeaf}
            label="Subsidy"
          />
          <ModernTabButton
            active={tab === 'services'}
            onClick={() => setTab('services')}
            icon={IoFlash}
            label="Services"
          />
          <ModernTabButton
            active={tab === 'analytics'}
            onClick={() => setTab('analytics')}
            icon={IoStatsChart}
            label="Analytics"
          />
          <ModernTabButton
            active={tab === 'blog'}
            onClick={() => setTab('blog')}
            icon={IoDocument}
            label="Blog"
          />
          <ModernTabButton
            active={tab === 'loans'}
            onClick={() => setTab('loans')}
            icon={IoCashOutline}
            label="Loans"
            count={stats.pendingLoans}
          />
        </div>

        {/* Render Active Tab with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {tab === 'dashboard' && renderDashboard()}
            {tab === 'loans' && <LoanAdmin />}
            {tab === 'orders' && (
              <OrdersTable
                orders={orders}
                loading={loading.orders}
                selectedItems={selectedItems}
                onSelectItem={toggleSelectItem}
                onSelectAll={() => selectAllItems(orders)}
                onUpdateStatus={updateOrderStatusHandler}
                onRefresh={fetchOrders}
                onExport={handleExportOrders}
                bulkAction={bulkAction}
                setBulkAction={setBulkAction}
                onBulkAction={bulkUpdateOrdersHandler}
                filters={orderFilters}
                setFilters={setOrderFilters}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                getStatusBadgeColor={getStatusBadgeColor}
              />
            )}
            {tab === 'blog' && <BlogAdmin />}
            
            {tab === 'product-list' && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Product Management</h3>
                    <p className="text-sm text-gray-500">Manage your product catalog</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {selectedItems.length > 0 && (
                      <Button
                        onClick={() => setShowBulkDeleteModal(true)}
                        variant="danger"
                        size="sm"
                      >
                        Delete Selected ({selectedItems.length})
                      </Button>
                    )}
                    <Button onClick={handleExportProducts} variant="outline" size="sm">
                      <IoDownload className="mr-2" /> Export
                    </Button>
                    <Button
                      onClick={() => {
                        resetForm()
                        setEditingProduct(null)
                        setTab('products')
                      }}
                      size="sm"
                    >
                      <IoAdd className="mr-2" /> Add Product
                    </Button>
                    <Button onClick={fetchProducts} variant="outline" size="sm">
                      <IoSync className={loading.products ? 'animate-spin' : ''} /> Refresh
                    </Button>
                  </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 col-span-2"
                  />
                  <select
                    value={productFilters.category}
                    onChange={(e) => setProductFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name} {cat.icon || ''}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={productFilters.minPrice}
                    onChange={(e) => setProductFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={productFilters.maxPrice}
                    onChange={(e) => setProductFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Products Grid */}
                {loading.products ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onEdit={() => handleEditProduct(product)}
                        onDelete={() => {
                          setProductToDelete(product)
                          setShowDeleteModal(true)
                        }}
                        onView={() => setViewingProduct(product)}
                        selected={selectedItems.includes(product._id)}
                        onSelect={() => toggleSelectItem(product._id)}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-semibold transition ${
                          currentPage === i + 1
                            ? 'bg-green-600 text-white'
                            : 'border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {tab === 'users' && (
              <UsersTable
                users={users}
                loading={loading.users}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onRefresh={fetchUsers}
                onCreateAdmin={handleCreateAdmin}
                onUpdateRole={handleUpdateUserRole}
                onToggleStatus={handleToggleUserStatus}
                onDeleteUser={handleDeleteUser}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalAdmins={stats.totalAdmins}
                getStatusBadgeColor={getStatusBadgeColor}
              />
            )}
            
            {tab === 'solar' && (
              <SolarInquiriesTable
                inquiries={solarInquiries}
                loading={loading.solar}
                onUpdateStatus={updateSolarInquiryStatusHandler}
                onRefresh={fetchSolarInquiries}
                getStatusBadgeColor={getStatusBadgeColor}
              />
            )}
            
            {tab === 'subsidy' && (
              <SubsidyApplicationsTable
                applications={subsidyApps}
                loading={loading.subsidy}
                onUpdateStatus={updateSubsidyStatusHandler}
                onRefresh={fetchSubsidyApplications}
                getStatusBadgeColor={getStatusBadgeColor}
              />
            )}
            
            {tab === 'services' && (
              <ServiceRequestsTable
                requests={serviceRequests}
                loading={loading.services}
                onUpdateStatus={updateServiceStatusHandler}
                onRefresh={fetchServiceRequests}
                getStatusBadgeColor={getStatusBadgeColor}
              />
            )}
            
            {(tab === 'products' || tab === 'edit-product') && (
              <ProductForm
                form={productForm}
                onChange={setProductForm}
                onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                onCancel={() => {
                  resetForm()
                  setEditingProduct(null)
                  setTab('product-list')
                }}
                editing={!!editingProduct}
                submitting={submitting}
                categories={categories} // Pass categories to ProductForm
                loadingCategories={loading.categories}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Modals */}
        {viewingProduct && (
          <ProductViewModal
            product={viewingProduct}
            onClose={() => setViewingProduct(null)}
            onEdit={() => {
              handleEditProduct(viewingProduct)
              setViewingProduct(null)
            }}
          />
        )}

        {showDeleteModal && productToDelete && (
          <DeleteConfirmationModal
            product={productToDelete}
            onConfirm={() => handleDeleteProduct(productToDelete._id)}
            onCancel={() => {
              setShowDeleteModal(false)
              setProductToDelete(null)
            }}
          />
        )}

        {showBulkDeleteModal && (
          <BulkDeleteModal
            count={selectedItems.length}
            onConfirm={handleBulkDeleteProducts}
            onCancel={() => {
              setShowBulkDeleteModal(false)
            }}
          />
        )}

        {/* Settings Modal */}
        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

        {/* Logout Modal */}
        <LogoutModal 
          isOpen={showLogout} 
          onClose={() => setShowLogout(false)} 
          onConfirm={handleLogout}
        />
      </div>
    </div>
  )
}