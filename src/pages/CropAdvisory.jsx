import React, { useState, useEffect } from 'react'
import { 
  IoLeaf, IoWarning, IoCheckmarkCircle, IoImage,
  IoCloud, IoCalendar, IoTime, IoArrowForward,
  IoSearch, IoFilter, IoClose, IoCamera,
  IoSunny, IoRainy, IoThermometer, IoWater
} from 'react-icons/io5'
import { Button, Badge } from '../components/UI'
import API from '../api/axios'

export default function CropAdvisory() {
  const [queries, setQueries] = useState([])
  const [expertTips, setExpertTips] = useState([])
  const [weatherData, setWeatherData] = useState(null)
  const [newQuery, setNewQuery] = useState({
    cropName: '',
    cropType: 'cereal',
    problemDescription: '',
    symptoms: '',
    severity: 'medium',
    images: [],
    location: '',
    soilType: 'loamy',
    irrigation: 'drip',
    previousCrops: ''
  })
  const [loading, setLoading] = useState({
    queries: false,
    tips: false,
    weather: false
  })
  const [selectedQuery, setSelectedQuery] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [previewImages, setPreviewImages] = useState([])

  // Common crops in India
  const commonCrops = [
    'Wheat', 'Rice', 'Corn', 'Sugarcane', 'Cotton', 
    'Soybean', 'Groundnut', 'Mustard', 'Potato', 'Tomato',
    'Onion', 'Chili', 'Brinjal', 'Cabbage', 'Cauliflower'
  ]

  // Crop types
  const cropTypes = [
    { value: 'cereal', label: 'Cereal', icon: '🌾' },
    { value: 'pulse', label: 'Pulse', icon: '🫘' },
    { value: 'oilseed', label: 'Oilseed', icon: '🌻' },
    { value: 'vegetable', label: 'Vegetable', icon: '🥬' },
    { value: 'fruit', label: 'Fruit', icon: '🍎' },
    { value: 'cash', label: 'Cash Crop', icon: '💰' }
  ]

  // Soil types
  const soilTypes = [
    'Alluvial', 'Black', 'Red', 'Laterite', 'Desert', 'Mountain', 'Loamy', 'Clay'
  ]

  useEffect(() => {
    fetchMyQueries()
    fetchExpertTips()
    fetchWeatherData()
  }, [])

  const fetchMyQueries = async () => {
    try {
      setLoading(prev => ({ ...prev, queries: true }))
      const res = await API.get('/api/crops/my-queries')
      setQueries(Array.isArray(res.data) ? res.data : res.data.queries || [])
    } catch (err) {
      console.error('Error fetching queries:', err)
    } finally {
      setLoading(prev => ({ ...prev, queries: false }))
    }
  }

  const fetchExpertTips = async () => {
    try {
      setLoading(prev => ({ ...prev, tips: true }))
      // Mock expert tips (replace with actual API)
      setExpertTips([
        {
          id: 1,
          title: 'Early Blight in Tomatoes',
          crop: 'Tomato',
          tip: 'Apply copper-based fungicide at first sign of spots. Ensure proper air circulation.',
          season: 'Kharif',
          image: '🍅'
        },
        {
          id: 2,
          title: 'Wheat Rust Prevention',
          crop: 'Wheat',
          tip: 'Use resistant varieties. Apply Propiconazole if rust appears. Maintain field hygiene.',
          season: 'Rabi',
          image: '🌾'
        },
        {
          id: 3,
          title: 'Rice Blast Management',
          crop: 'Rice',
          tip: 'Avoid excess nitrogen. Apply Tricyclazole at booting stage. Keep fields clean.',
          season: 'Kharif',
          image: '🌾'
        }
      ])
    } catch (err) {
      console.error('Error fetching tips:', err)
    } finally {
      setLoading(prev => ({ ...prev, tips: false }))
    }
  }

  const fetchWeatherData = async () => {
    try {
      setLoading(prev => ({ ...prev, weather: true }))
      // Mock weather data (replace with actual weather API)
      setWeatherData({
        temperature: 32,
        humidity: 65,
        rainfall: 120,
        forecast: 'Sunny',
        soilMoisture: 45,
        advisory: 'Good time for irrigation'
      })
    } catch (err) {
      console.error('Error fetching weather:', err)
    } finally {
      setLoading(prev => ({ ...prev, weather: false }))
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviewImages(prev => [...prev, ...newPreviews])
    setNewQuery(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))
  }

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index))
    setNewQuery(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmitQuery = async (e) => {
    e.preventDefault()
    try {
      setLoading(prev => ({ ...prev, submitting: true }))

      // Create form data for image upload
      const formData = new FormData()
      formData.append('cropName', newQuery.cropName)
      formData.append('cropType', newQuery.cropType)
      formData.append('problemDescription', newQuery.problemDescription)
      formData.append('symptoms', newQuery.symptoms)
      formData.append('severity', newQuery.severity)
      formData.append('location', newQuery.location)
      formData.append('soilType', newQuery.soilType)
      formData.append('irrigation', newQuery.irrigation)
      formData.append('previousCrops', newQuery.previousCrops)
      
      newQuery.images.forEach((image, index) => {
        formData.append(`images`, image)
      })

      await API.post('/api/crops', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      alert('✅ Crop query submitted successfully! Our experts will respond within 24 hours.')
      setNewQuery({
        cropName: '',
        cropType: 'cereal',
        problemDescription: '',
        symptoms: '',
        severity: 'medium',
        images: [],
        location: '',
        soilType: 'loamy',
        irrigation: 'drip',
        previousCrops: ''
      })
      setPreviewImages([])
      fetchMyQueries()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit query')
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }))
    }
  }

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return 'bg-green-100 text-green-700'
      case 'in-progress': return 'bg-blue-100 text-blue-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  // Filter queries
  const filteredQueries = queries.filter(query => {
    if (filter === 'pending' && query.status !== 'pending') return false
    if (filter === 'resolved' && query.status !== 'resolved') return false
    if (filter === 'in-progress' && query.status !== 'in-progress') return false
    if (searchTerm && !query.cropName.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="success" className="mb-4 px-4 py-2">
            <span className="flex items-center gap-2 text-lg">
              <IoLeaf /> Expert Crop Advisory Services
            </span>
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-agro-dark mb-4">
            Crop <span className="text-green-600">Advisory</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get expert advice for your crops. Submit your queries and our agronomists will help you.
          </p>
        </div>

        {/* Weather Widget */}
        {weatherData && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl text-white p-6 mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <IoSunny className="text-4xl text-yellow-300" />
                <div>
                  <p className="text-sm opacity-90">Current Weather</p>
                  <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <IoRainy className="text-4xl text-blue-200" />
                <div>
                  <p className="text-sm opacity-90">Humidity</p>
                  <p className="text-2xl font-bold">{weatherData.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <IoThermometer className="text-4xl text-red-200" />
                <div>
                  <p className="text-sm opacity-90">Soil Moisture</p>
                  <p className="text-2xl font-bold">{weatherData.soilMoisture}%</p>
                </div>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <p className="text-sm">Advisory: {weatherData.advisory}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Submit Query Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 text-agro-dark flex items-center gap-2">
                <IoLeaf className="text-green-600" /> Ask an Expert
              </h2>

              <form onSubmit={handleSubmitQuery} className="space-y-4">
                {/* Crop Name with Autocomplete */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Crop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    list="crops"
                    placeholder="e.g., Wheat, Rice"
                    value={newQuery.cropName}
                    onChange={(e) => setNewQuery({ ...newQuery, cropName: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 outline-none"
                    required
                  />
                  <datalist id="crops">
                    {commonCrops.map(crop => (
                      <option key={crop} value={crop} />
                    ))}
                  </datalist>
                </div>

                {/* Crop Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Crop Type</label>
                  <select
                    value={newQuery.cropType}
                    onChange={(e) => setNewQuery({ ...newQuery, cropType: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 outline-none"
                  >
                    {cropTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Problem Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Problem Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Describe the problem in detail..."
                    value={newQuery.problemDescription}
                    onChange={(e) => setNewQuery({ ...newQuery, problemDescription: e.target.value })}
                    rows="3"
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 outline-none"
                    required
                  />
                </div>

                {/* Symptoms */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Observed Symptoms
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Yellow leaves, spots, wilting"
                    value={newQuery.symptoms}
                    onChange={(e) => setNewQuery({ ...newQuery, symptoms: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 outline-none"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="crop-images"
                    />
                    <label
                      htmlFor="crop-images"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <IoCamera className="text-3xl text-gray-400" />
                      <span className="text-sm text-gray-500">Click to upload images</span>
                    </label>
                  </div>
                  
                  {/* Image Previews */}
                  {previewImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {previewImages.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={img}
                            alt={`Preview ${index}`}
                            className="w-full h-16 object-cover rounded"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                          >
                            <IoClose size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Farm Location
                  </label>
                  <input
                    type="text"
                    placeholder="District, State"
                    value={newQuery.location}
                    onChange={(e) => setNewQuery({ ...newQuery, location: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 outline-none"
                  />
                </div>

                {/* Soil Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Soil Type</label>
                  <select
                    value={newQuery.soilType}
                    onChange={(e) => setNewQuery({ ...newQuery, soilType: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 outline-none"
                  >
                    {soilTypes.map(type => (
                      <option key={type} value={type.toLowerCase()}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Irrigation Method */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Irrigation Method
                  </label>
                  <select
                    value={newQuery.irrigation}
                    onChange={(e) => setNewQuery({ ...newQuery, irrigation: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 outline-none"
                  >
                    <option value="drip">Drip Irrigation</option>
                    <option value="sprinkler">Sprinkler</option>
                    <option value="flood">Flood Irrigation</option>
                    <option value="rainfed">Rainfed</option>
                  </select>
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Severity</label>
                  <div className="flex gap-2">
                    {['low', 'medium', 'high'].map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setNewQuery({ ...newQuery, severity: level })}
                        className={`flex-1 py-2 rounded-lg capitalize transition ${
                          newQuery.severity === level
                            ? getSeverityColor(level)
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                  disabled={loading.submitting}
                >
                  {loading.submitting ? 'Submitting...' : 'Submit Query'}
                </Button>
              </form>
            </div>
          </div>

          {/* Queries List and Expert Tips */}
          <div className="lg:col-span-2 space-y-8">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg transition ${
                      filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg transition ${
                      filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilter('in-progress')}
                    className={`px-4 py-2 rounded-lg transition ${
                      filter === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => setFilter('resolved')}
                    className={`px-4 py-2 rounded-lg transition ${
                      filter === 'resolved' ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Resolved
                  </button>
                </div>
                <div className="relative">
                  <IoSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search queries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border-2 rounded-lg focus:border-green-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* My Queries */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <IoLeaf className="text-green-600" /> My Queries
              </h2>
              
              {loading.queries ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading queries...</p>
                </div>
              ) : filteredQueries.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <IoLeaf className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No queries found.</p>
                  <p className="text-gray-500">Submit your first crop advisory query!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQueries.map((query) => (
                    <div
                      key={query._id}
                      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
                      onClick={() => setSelectedQuery(selectedQuery === query._id ? null : query._id)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">{query.cropName}</h3>
                            <Badge className={getStatusColor(query.status)}>
                              {query.status?.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <IoCalendar /> {new Date(query.createdAt).toLocaleDateString()}
                            <IoTime /> {new Date(query.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(query.severity)}`}>
                          {query.severity.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4">{query.problemDescription}</p>

                      {query.symptoms && (
                        <div className="mb-4">
                          <span className="text-sm font-semibold text-gray-600">Symptoms: </span>
                          <span className="text-sm text-gray-600">{query.symptoms}</span>
                        </div>
                      )}

                      {query.images?.length > 0 && (
                        <div className="flex gap-2 mb-4">
                          {query.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Crop ${idx}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}

                      {selectedQuery === query._id && query.adminResponse?.response && (
                        <div className="mt-6 pt-6 border-t-2 border-gray-100">
                          <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                              <IoCheckmarkCircle /> Expert Response
                            </h4>
                            <p className="text-gray-700 mb-2">{query.adminResponse.response}</p>
                            {query.adminResponse.recommendation && (
                              <div className="bg-white rounded-lg p-4 mt-2">
                                <p className="font-semibold text-gray-700 mb-2">Recommendation:</p>
                                <p className="text-gray-600">{query.adminResponse.recommendation}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Expert Tips */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <IoLeaf className="text-green-600" /> Expert Tips
              </h2>
              
              {loading.tips ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {expertTips.map((tip) => (
                    <div key={tip.id} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition">
                      <div className="text-4xl mb-3">{tip.image}</div>
                      <h3 className="font-bold text-lg mb-1">{tip.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{tip.crop} • {tip.season}</p>
                      <p className="text-gray-600 text-sm">{tip.tip}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Common Problems Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Common Crop Problems & Solutions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                problem: 'Yellow Leaves',
                crop: 'Rice/Wheat',
                solution: 'Nitrogen deficiency. Apply Urea at 50kg/acre.',
                icon: '🍂'
              },
              {
                problem: 'Leaf Spots',
                crop: 'Tomato/Potato',
                solution: 'Fungal infection. Apply Mancozeb 2g/L water.',
                icon: '🍅'
              },
              {
                problem: 'Wilting',
                crop: 'Vegetables',
                solution: 'Check irrigation. May be root rot. Apply Trichoderma.',
                icon: '🥬'
              }
            ].map((item, i) => (
              <div key={i} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-bold">{item.problem}</h3>
                <p className="text-sm text-gray-500 mb-2">{item.crop}</p>
                <p className="text-sm text-gray-600">{item.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


// import React, { useState, useEffect } from 'react'
// import { 
//   IoLeaf, IoWarning, IoCheckmarkCircle, IoImage,
//   IoCloud, IoCalendar, IoTime, IoArrowForward,
//   IoSearch, IoFilter, IoClose, IoCamera,
//   IoSunny, IoRainy, IoThermometer, IoWater,
//   IoLocation, IoLeafOutline, IoFlask, IoBug,
//   IoMedical, IoFlower, IoEarth, IoWaterOutline,
//   IoAnalytics, IoNotifications, IoCloudUpload,
//   IoDownload, IoShare, IoBookmark, IoOptions,
//   IoGrid, IoList, IoMap, IoStatsChart,
//   IoPeople, IoChatbubbles, IoCall,
//   IoVideocam, IoDocument, IoNewspaper,
//   IoChevronDown, IoChevronUp, IoRefresh,
//   IoAdd, IoRemove, IoHeart, IoHeartOutline,
//   IoStar, IoStarOutline, IoEllipsisVertical,
//   IoQrCode, IoScan, IoBulb, IoRocket,
//   IoTrendingUp, IoTrendingDown, IoSwapHorizontal,
//   IoCopy, IoLink, IoQRCode, IoBarcode
// } from 'react-icons/io5'
// import { motion, AnimatePresence } from 'framer-motion'

// // Modern Font Configuration
// const fontFamily = {
//   heading: "'Clash Display', sans-serif",
//   subheading: "'Satoshi', sans-serif",
//   body: "'General Sans', sans-serif"
// }

// // ==================== MODERN WEATHER WIDGET ====================
// const ModernWeatherWidget = ({ weatherData, loading }) => {
//   if (loading) {
//     return (
//       <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 animate-pulse">
//         <div className="h-20 bg-white/20 rounded-2xl"></div>
//       </div>
//     )
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-3xl p-6 text-white relative overflow-hidden"
//     >
//       {/* Background Pattern */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full transform translate-x-20 -translate-y-20"></div>
//         <div className="absolute bottom-0 left-0 w-60 h-60 bg-white rounded-full transform -translate-x-30 translate-y-30"></div>
//       </div>

//       <div className="relative z-10">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-lg font-semibold flex items-center gap-2">
//             <IoCloud className="text-2xl" />
//             Weather Advisory
//           </h3>
//           <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Live</span>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <motion.div 
//             whileHover={{ scale: 1.05 }}
//             className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
//           >
//             <IoSunny className="text-3xl text-yellow-300 mb-2" />
//             <p className="text-sm opacity-90">Temperature</p>
//             <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
//           </motion.div>

//           <motion.div 
//             whileHover={{ scale: 1.05 }}
//             className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
//           >
//             <IoRainy className="text-3xl text-blue-200 mb-2" />
//             <p className="text-sm opacity-90">Humidity</p>
//             <p className="text-2xl font-bold">{weatherData.humidity}%</p>
//           </motion.div>

//           <motion.div 
//             whileHover={{ scale: 1.05 }}
//             className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
//           >
//             <IoWater className="text-3xl text-blue-300 mb-2" />
//             <p className="text-sm opacity-90">Soil Moisture</p>
//             <p className="text-2xl font-bold">{weatherData.soilMoisture}%</p>
//           </motion.div>

//           <motion.div 
//             whileHover={{ scale: 1.05 }}
//             className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
//           >
//             <IoThermometer className="text-3xl text-red-200 mb-2" />
//             <p className="text-sm opacity-90">Rainfall</p>
//             <p className="text-2xl font-bold">{weatherData.rainfall}mm</p>
//           </motion.div>
//         </div>

//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="mt-4 p-4 bg-white/20 rounded-2xl"
//         >
//           <p className="flex items-center gap-2">
//             <IoBulb className="text-yellow-300" />
//             <span>Advisory: {weatherData.advisory}</span>
//           </p>
//         </motion.div>
//       </div>
//     </motion.div>
//   )
// }

// // ==================== MODERN QUERY FORM ====================
// const ModernQueryForm = ({ onSubmit, loading, newQuery, setNewQuery, previewImages, setPreviewImages }) => {
//   const [isExpanded, setIsExpanded] = useState(false)
//   const [currentStep, setCurrentStep] = useState(1)

//   const commonCrops = [
//     'Wheat', 'Rice', 'Corn', 'Sugarcane', 'Cotton', 
//     'Soybean', 'Groundnut', 'Mustard', 'Potato', 'Tomato',
//     'Onion', 'Chili', 'Brinjal', 'Cabbage', 'Cauliflower'
//   ]

//   const cropTypes = [
//     { value: 'cereal', label: 'Cereal', icon: '🌾', color: 'from-amber-500 to-yellow-500' },
//     { value: 'pulse', label: 'Pulse', icon: '🫘', color: 'from-green-500 to-emerald-500' },
//     { value: 'oilseed', label: 'Oilseed', icon: '🌻', color: 'from-yellow-500 to-orange-500' },
//     { value: 'vegetable', label: 'Vegetable', icon: '🥬', color: 'from-green-400 to-emerald-400' },
//     { value: 'fruit', label: 'Fruit', icon: '🍎', color: 'from-red-500 to-pink-500' },
//     { value: 'cash', label: 'Cash Crop', icon: '💰', color: 'from-purple-500 to-indigo-500' }
//   ]

//   const soilTypes = [
//     'Alluvial', 'Black', 'Red', 'Laterite', 'Desert', 'Mountain', 'Loamy', 'Clay'
//   ]

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files)
//     const newPreviews = files.map(file => URL.createObjectURL(file))
//     setPreviewImages(prev => [...prev, ...newPreviews])
//     setNewQuery(prev => ({
//       ...prev,
//       images: [...prev.images, ...files]
//     }))
//   }

//   const removeImage = (index) => {
//     setPreviewImages(prev => prev.filter((_, i) => i !== index))
//     setNewQuery(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }))
//   }

//   const steps = [
//     { number: 1, title: 'Crop Details', icon: IoLeaf },
//     { number: 2, title: 'Problem Description', icon: IoBug },
//     { number: 3, title: 'Farm Information', icon: IoLocation }
//   ]

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       className="bg-white rounded-3xl shadow-xl overflow-hidden sticky top-24"
//     >
//       {/* Header */}
//       <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
//         <h2 className="text-2xl font-bold flex items-center gap-2" style={{ fontFamily: fontFamily.heading }}>
//           <IoLeaf /> Ask an Expert
//         </h2>
//         <p className="text-emerald-100 text-sm mt-1">Get personalized advice from our agronomists</p>
//       </div>

//       {/* Progress Steps */}
//       <div className="px-6 pt-6">
//         <div className="flex justify-between">
//           {steps.map((step) => (
//             <div key={step.number} className="flex-1">
//               <div className="flex items-center">
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                   currentStep >= step.number 
//                     ? 'bg-emerald-600 text-white' 
//                     : 'bg-gray-200 text-gray-400'
//                 }`}>
//                   <step.icon size={16} />
//                 </div>
//                 {step.number < steps.length && (
//                   <div className={`flex-1 h-1 mx-2 ${
//                     currentStep > step.number ? 'bg-emerald-600' : 'bg-gray-200'
//                   }`} />
//                 )}
//               </div>
//               <p className="text-xs mt-1 text-gray-600">{step.title}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       <form onSubmit={onSubmit} className="p-6">
//         <AnimatePresence mode="wait">
//           {currentStep === 1 && (
//             <motion.div
//               key="step1"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               className="space-y-4"
//             >
//               {/* Crop Name */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Crop Name <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     list="crops"
//                     placeholder="Search for your crop..."
//                     value={newQuery.cropName}
//                     onChange={(e) => setNewQuery({ ...newQuery, cropName: e.target.value })}
//                     className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition"
//                     required
//                   />
//                   <IoSearch className="absolute right-4 top-3.5 text-gray-400" />
//                 </div>
//                 <datalist id="crops">
//                   {commonCrops.map(crop => (
//                     <option key={crop} value={crop} />
//                   ))}
//                 </datalist>
//               </div>

//               {/* Crop Type */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Crop Type</label>
//                 <div className="grid grid-cols-3 gap-2">
//                   {cropTypes.map(type => (
//                     <motion.button
//                       key={type.value}
//                       type="button"
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => setNewQuery({ ...newQuery, cropType: type.value })}
//                       className={`p-3 rounded-xl border-2 transition ${
//                         newQuery.cropType === type.value
//                           ? `border-${type.color.split('-')[1]}-500 bg-${type.color.split('-')[1]}-50`
//                           : 'border-gray-200 hover:border-gray-300'
//                       }`}
//                     >
//                       <span className="text-2xl mb-1 block">{type.icon}</span>
//                       <span className="text-xs font-medium">{type.label}</span>
//                     </motion.button>
//                   ))}
//                 </div>
//               </div>

//               {/* Severity */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Severity Level</label>
//                 <div className="flex gap-2">
//                   {['low', 'medium', 'high'].map(level => (
//                     <motion.button
//                       key={level}
//                       type="button"
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => setNewQuery({ ...newQuery, severity: level })}
//                       className={`flex-1 py-3 rounded-xl capitalize font-medium transition ${
//                         newQuery.severity === level
//                           ? level === 'low' ? 'bg-green-100 text-green-700 border-2 border-green-500'
//                             : level === 'medium' ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-500'
//                             : 'bg-red-100 text-red-700 border-2 border-red-500'
//                           : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                       }`}
//                     >
//                       {level}
//                     </motion.button>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {currentStep === 2 && (
//             <motion.div
//               key="step2"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               className="space-y-4"
//             >
//               {/* Problem Description */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Problem Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   placeholder="Describe the problem in detail. Include when it started, affected area, etc."
//                   value={newQuery.problemDescription}
//                   onChange={(e) => setNewQuery({ ...newQuery, problemDescription: e.target.value })}
//                   rows="4"
//                   className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition"
//                   required
//                 />
//               </div>

//               {/* Symptoms */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Observed Symptoms
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="e.g., Yellow leaves, brown spots, wilting"
//                   value={newQuery.symptoms}
//                   onChange={(e) => setNewQuery({ ...newQuery, symptoms: e.target.value })}
//                   className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition"
//                 />
//               </div>

//               {/* Image Upload */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Upload Images
//                 </label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-500 transition">
//                   <input
//                     type="file"
//                     multiple
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="hidden"
//                     id="crop-images"
//                   />
//                   <label
//                     htmlFor="crop-images"
//                     className="cursor-pointer flex flex-col items-center gap-2"
//                   >
//                     <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
//                       <IoCamera className="text-2xl text-emerald-600" />
//                     </div>
//                     <span className="text-sm text-gray-600">Click to upload images</span>
//                     <span className="text-xs text-gray-400">Max 5 images, JPG/PNG</span>
//                   </label>
//                 </div>
                
//                 {/* Image Previews */}
//                 {previewImages.length > 0 && (
//                   <div className="grid grid-cols-4 gap-2 mt-2">
//                     {previewImages.map((img, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         className="relative"
//                       >
//                         <img
//                           src={img}
//                           alt={`Preview ${index}`}
//                           className="w-full h-16 object-cover rounded-lg"
//                         />
//                         <button
//                           onClick={() => removeImage(index)}
//                           className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
//                         >
//                           <IoClose size={14} />
//                         </button>
//                       </motion.div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           )}

//           {currentStep === 3 && (
//             <motion.div
//               key="step3"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               className="space-y-4"
//             >
//               {/* Location */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Farm Location
//                 </label>
//                 <div className="relative">
//                   <IoLocation className="absolute left-3 top-3.5 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="District, State"
//                     value={newQuery.location}
//                     onChange={(e) => setNewQuery({ ...newQuery, location: e.target.value })}
//                     className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:border-emerald-500 outline-none transition"
//                   />
//                 </div>
//               </div>

//               {/* Soil Type */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Soil Type</label>
//                 <select
//                   value={newQuery.soilType}
//                   onChange={(e) => setNewQuery({ ...newQuery, soilType: e.target.value })}
//                   className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition"
//                 >
//                   {soilTypes.map(type => (
//                     <option key={type} value={type.toLowerCase()}>{type}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Irrigation Method */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Irrigation Method
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   {['drip', 'sprinkler', 'flood', 'rainfed'].map(method => (
//                     <motion.button
//                       key={method}
//                       type="button"
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => setNewQuery({ ...newQuery, irrigation: method })}
//                       className={`p-3 rounded-xl border-2 capitalize transition ${
//                         newQuery.irrigation === method
//                           ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
//                           : 'border-gray-200 hover:border-gray-300'
//                       }`}
//                     >
//                       {method}
//                     </motion.button>
//                   ))}
//                 </div>
//               </div>

//               {/* Previous Crops */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Previous Crops Grown
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="e.g., Wheat, Rice (last season)"
//                   value={newQuery.previousCrops}
//                   onChange={(e) => setNewQuery({ ...newQuery, previousCrops: e.target.value })}
//                   className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition"
//                 />
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Navigation Buttons */}
//         <div className="flex gap-3 mt-6">
//           {currentStep > 1 && (
//             <motion.button
//               type="button"
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setCurrentStep(currentStep - 1)}
//               className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-medium hover:border-gray-300 transition"
//             >
//               Back
//             </motion.button>
//           )}
//           {currentStep < 3 ? (
//             <motion.button
//               type="button"
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setCurrentStep(currentStep + 1)}
//               className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-emerald-700 transition"
//             >
//               Next
//             </motion.button>
//           ) : (
//             <motion.button
//               type="submit"
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               disabled={loading.submitting}
//               className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-50"
//             >
//               {loading.submitting ? 'Submitting...' : 'Submit Query'}
//             </motion.button>
//           )}
//         </div>

//         {/* Form Note */}
//         <p className="text-xs text-gray-400 text-center mt-4">
//           Our experts will respond within 24 hours ⚡
//         </p>
//       </form>
//     </motion.div>
//   )
// }

// // ==================== MODERN QUERY CARD ====================
// const ModernQueryCard = ({ query, isSelected, onSelect }) => {
//   const getSeverityConfig = (severity) => {
//     const configs = {
//       low: { color: 'bg-green-100 text-green-700', icon: IoCheckmarkCircle },
//       medium: { color: 'bg-yellow-100 text-yellow-700', icon: IoWarning },
//       high: { color: 'bg-red-100 text-red-700', icon: IoWarning }
//     }
//     return configs[severity] || configs.medium
//   }

//   const getStatusConfig = (status) => {
//     const configs = {
//       pending: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
//       'in-progress': { color: 'bg-blue-100 text-blue-700', label: 'In Progress' },
//       resolved: { color: 'bg-green-100 text-green-700', label: 'Resolved' }
//     }
//     return configs[status] || configs.pending
//   }

//   const severityConfig = getSeverityConfig(query.severity)
//   const statusConfig = getStatusConfig(query.status)

//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       whileHover={{ y: -2 }}
//       onClick={onSelect}
//       className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer overflow-hidden"
//     >
//       <div className="p-6">
//         {/* Header */}
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex items-start gap-3">
//             <div className={`w-10 h-10 rounded-xl ${severityConfig.color} flex items-center justify-center flex-shrink-0`}>
//               <severityConfig.icon className="text-xl" />
//             </div>
//             <div>
//               <div className="flex items-center gap-2 mb-1">
//                 <h3 className="text-xl font-bold text-gray-800">{query.cropName}</h3>
//                 <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
//                   {statusConfig.label}
//                 </span>
//               </div>
//               <div className="flex items-center gap-3 text-sm text-gray-500">
//                 <span className="flex items-center gap-1">
//                   <IoCalendar /> {new Date(query.createdAt).toLocaleDateString()}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <IoTime /> {new Date(query.createdAt).toLocaleTimeString()}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <span className={`px-3 py-1 rounded-full text-xs font-semibold ${severityConfig.color}`}>
//             {query.severity.toUpperCase()}
//           </span>
//         </div>

//         {/* Problem Description */}
//         <p className="text-gray-600 mb-4 line-clamp-2">{query.problemDescription}</p>

//         {/* Symptoms */}
//         {query.symptoms && (
//           <div className="mb-4 flex items-center gap-2">
//             <span className="text-xs font-semibold text-gray-500">Symptoms:</span>
//             <span className="text-sm text-gray-600">{query.symptoms}</span>
//           </div>
//         )}

//         {/* Images */}
//         {query.images?.length > 0 && (
//           <div className="flex gap-2 mb-4">
//             {query.images.slice(0, 3).map((img, idx) => (
//               <img
//                 key={idx}
//                 src={img}
//                 alt={`Crop ${idx}`}
//                 className="w-12 h-12 object-cover rounded-lg"
//               />
//             ))}
//             {query.images.length > 3 && (
//               <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-600">
//                 +{query.images.length - 3}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Expand Indicator */}
//         <div className="flex justify-end">
//           <motion.div
//             animate={{ rotate: isSelected ? 180 : 0 }}
//             className="text-gray-400"
//           >
//             <IoChevronDown size={20} />
//           </motion.div>
//         </div>
//       </div>

//       {/* Expert Response */}
//       <AnimatePresence>
//         {isSelected && query.adminResponse?.response && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: 'auto', opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             className="border-t-2 border-gray-100"
//           >
//             <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50">
//               <h4 className="font-semibold text-emerald-700 mb-3 flex items-center gap-2">
//                 <IoCheckmarkCircle /> Expert Response
//               </h4>
//               <p className="text-gray-700 mb-3">{query.adminResponse.response}</p>
//               {query.adminResponse.recommendation && (
//                 <div className="bg-white rounded-xl p-4">
//                   <p className="font-semibold text-gray-700 mb-2">Recommendation:</p>
//                   <p className="text-gray-600">{query.adminResponse.recommendation}</p>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   )
// }

// // ==================== MODERN EXPERT TIPS ====================
// const ModernExpertTips = ({ tips, loading }) => {
//   const [selectedTip, setSelectedTip] = useState(null)

//   return (
//     <div className="bg-white rounded-3xl shadow-xl p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-xl font-bold flex items-center gap-2">
//           <IoLeaf className="text-emerald-600" /> Expert Tips
//         </h3>
//         <button className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 text-sm font-medium">
//           View All <IoArrowForward />
//         </button>
//       </div>

//       {loading ? (
//         <div className="space-y-4">
//           {[1, 2, 3].map(i => (
//             <div key={i} className="animate-pulse">
//               <div className="h-20 bg-gray-200 rounded-xl"></div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {tips.map((tip) => (
//             <motion.div
//               key={tip.id}
//               whileHover={{ scale: 1.02 }}
//               onClick={() => setSelectedTip(selectedTip === tip.id ? null : tip.id)}
//               className="border-2 border-gray-100 rounded-xl p-4 cursor-pointer hover:border-emerald-200 transition"
//             >
//               <div className="flex items-start gap-3">
//                 <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">
//                   {tip.image}
//                 </div>
//                 <div className="flex-1">
//                   <h4 className="font-semibold text-gray-800 mb-1">{tip.title}</h4>
//                   <p className="text-sm text-gray-500">{tip.crop} • {tip.season}</p>
//                   <AnimatePresence>
//                     {selectedTip === tip.id && (
//                       <motion.p
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: 'auto' }}
//                         exit={{ opacity: 0, height: 0 }}
//                         className="text-sm text-gray-600 mt-2 pt-2 border-t border-gray-100"
//                       >
//                         {tip.tip}
//                       </motion.p>
//                     )}
//                   </AnimatePresence>
//                 </div>
//                 <motion.div
//                   animate={{ rotate: selectedTip === tip.id ? 180 : 0 }}
//                   className="text-gray-400"
//                 >
//                   <IoChevronDown size={18} />
//                 </motion.div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// // ==================== MODERN QUERY FILTERS ====================
// const ModernQueryFilters = ({ filter, setFilter, searchTerm, setSearchTerm }) => {
//   const filters = [
//     { id: 'all', label: 'All', color: 'gray' },
//     { id: 'pending', label: 'Pending', color: 'yellow' },
//     { id: 'in-progress', label: 'In Progress', color: 'blue' },
//     { id: 'resolved', label: 'Resolved', color: 'green' }
//   ]

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-4">
//       <div className="flex flex-wrap gap-3 items-center justify-between">
//         <div className="flex gap-2">
//           {filters.map(f => (
//             <motion.button
//               key={f.id}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setFilter(f.id)}
//               className={`px-4 py-2 rounded-xl font-medium transition ${
//                 filter === f.id
//                   ? `bg-${f.color}-500 text-white`
//                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//               }`}
//             >
//               {f.label}
//             </motion.button>
//           ))}
//         </div>

//         <div className="relative">
//           <IoSearch className="absolute left-3 top-2.5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search queries..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-emerald-500 outline-none w-64"
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// // ==================== COMMON PROBLEMS SECTION ====================
// const CommonProblems = () => {
//   const problems = [
//     {
//       icon: '🍂',
//       problem: 'Yellow Leaves',
//       crop: 'Rice/Wheat',
//       solution: 'Nitrogen deficiency. Apply Urea at 50kg/acre.',
//       color: 'from-yellow-500 to-amber-500'
//     },
//     {
//       icon: '🍅',
//       problem: 'Leaf Spots',
//       crop: 'Tomato/Potato',
//       solution: 'Fungal infection. Apply Mancozeb 2g/L water.',
//       color: 'from-red-500 to-pink-500'
//     },
//     {
//       icon: '🥬',
//       problem: 'Wilting',
//       crop: 'Vegetables',
//       solution: 'Check irrigation. May be root rot. Apply Trichoderma.',
//       color: 'from-green-500 to-emerald-500'
//     },
//     {
//       icon: '🌽',
//       problem: 'Stunt Growth',
//       crop: 'Corn/Maize',
//       solution: 'Zinc deficiency. Apply Zinc Sulphate 25kg/hectare.',
//       color: 'from-blue-500 to-cyan-500'
//     },
//     {
//       icon: '🌻',
//       problem: 'Flower Drop',
//       crop: 'Pulses/Oilseeds',
//       solution: 'Boron deficiency. Apply Borax 10kg/hectare.',
//       color: 'from-purple-500 to-indigo-500'
//     },
//     {
//       icon: '🍊',
//       problem: 'Fruit Cracking',
//       crop: 'Citrus/Tomato',
//       solution: 'Irregular watering. Maintain consistent soil moisture.',
//       color: 'from-orange-500 to-red-500'
//     }
//   ]

//   return (
//     <div className="bg-white rounded-3xl shadow-xl p-8">
//       <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
//         <IoMedical className="text-emerald-600" /> Common Problems & Solutions
//       </h2>

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {problems.map((item, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.05 }}
//             whileHover={{ y: -5 }}
//             className={`bg-gradient-to-br ${item.color} bg-opacity-5 rounded-xl p-4 border-2 border-transparent hover:border-${item.color.split('-')[1]}-200 transition`}
//           >
//             <div className="text-3xl mb-2">{item.icon}</div>
//             <h3 className="font-bold text-gray-800">{item.problem}</h3>
//             <p className="text-sm text-gray-500 mb-2">{item.crop}</p>
//             <p className="text-sm text-gray-600">{item.solution}</p>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   )
// }

// // ==================== MAIN COMPONENT ====================
// export default function CropAdvisory() {
//   const [queries, setQueries] = useState([])
//   const [expertTips, setExpertTips] = useState([])
//   const [weatherData, setWeatherData] = useState(null)
//   const [newQuery, setNewQuery] = useState({
//     cropName: '',
//     cropType: 'cereal',
//     problemDescription: '',
//     symptoms: '',
//     severity: 'medium',
//     images: [],
//     location: '',
//     soilType: 'loamy',
//     irrigation: 'drip',
//     previousCrops: ''
//   })
//   const [loading, setLoading] = useState({
//     queries: false,
//     tips: false,
//     weather: false,
//     submitting: false
//   })
//   const [selectedQuery, setSelectedQuery] = useState(null)
//   const [filter, setFilter] = useState('all')
//   const [searchTerm, setSearchTerm] = useState('')
//   const [previewImages, setPreviewImages] = useState([])

//   useEffect(() => {
//     fetchMyQueries()
//     fetchExpertTips()
//     fetchWeatherData()
//   }, [])

//   const fetchMyQueries = async () => {
//     try {
//       setLoading(prev => ({ ...prev, queries: true }))
//       // Mock data for now
//       setQueries([
//         {
//           _id: '1',
//           cropName: 'Tomato',
//           severity: 'high',
//           status: 'in-progress',
//           problemDescription: 'Yellow leaves with brown spots appearing on lower leaves. Spreading rapidly.',
//           symptoms: 'Yellow leaves, brown spots, wilting',
//           createdAt: new Date().toISOString(),
//           images: ['https://images.unsplash.com/photo-1592982537447-6f2a6a0c7e5b?w=100'],
//           adminResponse: {
//             response: 'This appears to be Early Blight. Apply Mancozeb 2g/L water immediately.',
//             recommendation: 'Remove affected leaves, improve air circulation, and maintain proper spacing.'
//           }
//         },
//         {
//           _id: '2',
//           cropName: 'Wheat',
//           severity: 'medium',
//           status: 'pending',
//           problemDescription: 'Rust-colored spots on leaves. Some leaves turning yellow.',
//           symptoms: 'Rust spots, yellowing',
//           createdAt: new Date(Date.now() - 86400000).toISOString(),
//           images: []
//         },
//         {
//           _id: '3',
//           cropName: 'Rice',
//           severity: 'low',
//           status: 'resolved',
//           problemDescription: 'Minor yellowing of leaf tips.',
//           symptoms: 'Yellow tips',
//           createdAt: new Date(Date.now() - 172800000).toISOString(),
//           images: [],
//           adminResponse: {
//             response: 'Minor nitrogen deficiency. Apply urea at 25kg/acre.',
//             recommendation: 'Maintain proper fertilizer schedule.'
//           }
//         }
//       ])
//     } catch (err) {
//       console.error('Error fetching queries:', err)
//     } finally {
//       setLoading(prev => ({ ...prev, queries: false }))
//     }
//   }

//   const fetchExpertTips = async () => {
//     try {
//       setLoading(prev => ({ ...prev, tips: true }))
//       setExpertTips([
//         {
//           id: 1,
//           title: 'Early Blight in Tomatoes',
//           crop: 'Tomato',
//           tip: 'Apply copper-based fungicide at first sign of spots. Ensure proper air circulation.',
//           season: 'Kharif',
//           image: '🍅'
//         },
//         {
//           id: 2,
//           title: 'Wheat Rust Prevention',
//           crop: 'Wheat',
//           tip: 'Use resistant varieties. Apply Propiconazole if rust appears. Maintain field hygiene.',
//           season: 'Rabi',
//           image: '🌾'
//         },
//         {
//           id: 3,
//           title: 'Rice Blast Management',
//           crop: 'Rice',
//           tip: 'Avoid excess nitrogen. Apply Tricyclazole at booting stage. Keep fields clean.',
//           season: 'Kharif',
//           image: '🌾'
//         }
//       ])
//     } catch (err) {
//       console.error('Error fetching tips:', err)
//     } finally {
//       setLoading(prev => ({ ...prev, tips: false }))
//     }
//   }

//   const fetchWeatherData = async () => {
//     try {
//       setLoading(prev => ({ ...prev, weather: true }))
//       setWeatherData({
//         temperature: 32,
//         humidity: 65,
//         rainfall: 120,
//         forecast: 'Sunny',
//         soilMoisture: 45,
//         advisory: 'Good time for irrigation. Watch for pest activity.'
//       })
//     } catch (err) {
//       console.error('Error fetching weather:', err)
//     } finally {
//       setLoading(prev => ({ ...prev, weather: false }))
//     }
//   }

//   const handleSubmitQuery = async (e) => {
//     e.preventDefault()
//     try {
//       setLoading(prev => ({ ...prev, submitting: true }))
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1500))
      
//       alert('✅ Query submitted successfully! Our experts will respond within 24 hours.')
//       setNewQuery({
//         cropName: '',
//         cropType: 'cereal',
//         problemDescription: '',
//         symptoms: '',
//         severity: 'medium',
//         images: [],
//         location: '',
//         soilType: 'loamy',
//         irrigation: 'drip',
//         previousCrops: ''
//       })
//       setPreviewImages([])
//       fetchMyQueries()
//     } catch (err) {
//       alert('Failed to submit query')
//     } finally {
//       setLoading(prev => ({ ...prev, submitting: false }))
//     }
//   }

//   // Filter queries
//   const filteredQueries = queries.filter(query => {
//     if (filter !== 'all' && query.status !== filter) return false
//     if (searchTerm && !query.cropName.toLowerCase().includes(searchTerm.toLowerCase())) return false
//     return true
//   })

//   return (
//     <div className="min-h-screen bg-gray-50" style={{ fontFamily: fontFamily.body }}>
//       {/* Header */}
//       <div className="bg-gradient-to-b from-emerald-900 to-emerald-800 text-white py-16">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center max-w-3xl mx-auto"
//           >
//             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
//               <IoLeaf className="text-emerald-300" />
//               <span className="text-sm font-medium">Expert Crop Advisory Services</span>
//             </div>
//             <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: fontFamily.heading }}>
//               Crop <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">Advisory</span>
//             </h1>
//             <p className="text-xl text-emerald-100">
//               Get expert advice for your crops. Submit your queries and our agronomists will help you within 24 hours.
//             </p>
//           </motion.div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-12">
//         {/* Weather Widget */}
//         <div className="mb-8">
//           <ModernWeatherWidget weatherData={weatherData} loading={loading.weather} />
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Left Column - Query Form */}
//           <div className="lg:col-span-1">
//             <ModernQueryForm
//               onSubmit={handleSubmitQuery}
//               loading={loading}
//               newQuery={newQuery}
//               setNewQuery={setNewQuery}
//               previewImages={previewImages}
//               setPreviewImages={setPreviewImages}
//             />
//           </div>

//           {/* Right Column - Queries and Tips */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Filters */}
//             <ModernQueryFilters
//               filter={filter}
//               setFilter={setFilter}
//               searchTerm={searchTerm}
//               setSearchTerm={setSearchTerm}
//             />

//             {/* My Queries */}
//             <div>
//               <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
//                 <IoLeaf className="text-emerald-600" /> My Queries
//                 <span className="text-sm font-normal text-gray-500 ml-2">
//                   ({filteredQueries.length} {filteredQueries.length === 1 ? 'query' : 'queries'})
//                 </span>
//               </h2>
              
//               {loading.queries ? (
//                 <div className="space-y-4">
//                   {[1, 2, 3].map(i => (
//                     <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
//                       <div className="h-20 bg-gray-200 rounded-xl"></div>
//                     </div>
//                   ))}
//                 </div>
//               ) : filteredQueries.length === 0 ? (
//                 <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
//                   <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <IoLeaf className="text-3xl text-emerald-600" />
//                   </div>
//                   <p className="text-gray-600 text-lg mb-2">No queries found</p>
//                   <p className="text-gray-500">Submit your first crop advisory query using the form!</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <AnimatePresence>
//                     {filteredQueries.map((query) => (
//                       <ModernQueryCard
//                         key={query._id}
//                         query={query}
//                         isSelected={selectedQuery === query._id}
//                         onSelect={() => setSelectedQuery(selectedQuery === query._id ? null : query._id)}
//                       />
//                     ))}
//                   </AnimatePresence>
//                 </div>
//               )}
//             </div>

//             {/* Expert Tips */}
//             <ModernExpertTips tips={expertTips} loading={loading.tips} />
//           </div>
//         </div>

//         {/* Common Problems */}
//         <div className="mt-8">
//           <CommonProblems />
//         </div>
//       </div>
//     </div>
//   )
// }