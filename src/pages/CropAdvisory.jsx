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