import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  IoArrowForward, IoSunny, IoWater, IoFlash, IoBatteryFull,
  IoCheckmarkCircle, IoCalculator, IoDocument, IoCall,
  IoMail, IoLocation, IoTime, IoShield, IoRocket,
  IoLeaf, IoClose, IoChevronDown, IoChevronUp
} from 'react-icons/io5'
import { createServiceRequest } from '../api/servicesAPI'
import { Button, Badge } from '../components/UI'

export default function SolarServices() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pump')
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [showFaq, setShowFaq] = useState({})
  const [loading, setLoading] = useState(false)
  const [quote, setQuote] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceType: 'solar-pump',
    capacity: '',
    landArea: '',
    budget: '',
    message: ''
  })

  const [savings, setSavings] = useState({
    monthlyBill: 5000,
    systemSize: 5,
    calculatedSavings: null
  })

  // FAQ data
  const faqs = [
    {
      question: 'How much does a solar pump cost?',
      answer: 'Solar pump costs vary based on capacity. A 5 HP system typically costs ₹3-4 lakhs before subsidies. With government subsidies up to 90%, you can get it for as low as ₹40,000-50,000.'
    },
    {
      question: 'What is the payback period?',
      answer: 'Typically 3-5 years for solar pumps and 7-9 years for grid-connected systems. With rising electricity costs, payback periods are getting shorter.'
    },
    {
      question: 'Do I get government subsidy?',
      answer: 'Yes! Under PM-KUSUM scheme, farmers can get up to 90% subsidy for solar pumps. We handle all paperwork for subsidy applications.'
    },
    {
      question: 'What maintenance is required?',
      answer: 'Solar panels require minimal maintenance - just cleaning every few months. We provide 5 years free maintenance with all installations.'
    }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setQuote(prev => ({ ...prev, [name]: value }))
  }

  const handleSavingsChange = (e) => {
    const { name, value } = e.target
    setSavings(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
  }

  const calculateSavings = () => {
    const monthlyUnits = savings.monthlyBill / 8 // Assuming ₹8 per unit
    const annualUnits = monthlyUnits * 12
    const solarGeneration = savings.systemSize * 4 * 365 // 4 units per kW per day
    const unitsSaved = Math.min(annualUnits, solarGeneration)
    const annualSavings = unitsSaved * 8
    const co2Reduction = (unitsSaved * 0.85).toFixed(2) // kg CO2 per unit
    
    setSavings(prev => ({
      ...prev,
      calculatedSavings: {
        annualSavings: annualSavings.toFixed(0),
        paybackYears: ((savings.systemSize * 70000) / annualSavings).toFixed(1),
        co2Reduction
      }
    }))
  }

  const handleRequestQuote = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createServiceRequest({
        serviceType: quote.serviceType,
        description: `Quote request from ${quote.name} for ${quote.serviceType}. Capacity: ${quote.capacity}, Land Area: ${quote.landArea} acres, Budget: ${quote.budget}, Message: ${quote.message}`,
        location: {
          address: quote.address,
          state: '',
          district: ''
        },
        pumpCapacity: {
          hp: parseInt(quote.capacity) || 0,
          pumpType: quote.serviceType
        },
        landSize: {
          value: parseFloat(quote.landArea) || 0,
          unit: 'acres'
        },
        estimatedBudget: parseFloat(quote.budget) || 0
      })
      alert('Quote request sent successfully! Our team will contact you within 24 hours.')
      setQuote({
        name: '',
        email: '',
        phone: '',
        address: '',
        serviceType: 'solar-pump',
        capacity: '',
        landArea: '',
        budget: '',
        message: ''
      })
      setShowQuoteForm(false)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to request quote')
    } finally {
      setLoading(false)
    }
  }

  const toggleFaq = (index) => {
    setShowFaq(prev => ({ ...prev, [index]: !prev[index] }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-800 via-green-600 to-yellow-500 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl animate-float">☀️</div>
          <div className="absolute bottom-10 right-10 text-8xl animate-float" style={{ animationDelay: '1s' }}>🌊</div>
          <div className="absolute top-1/2 left-1/4 text-7xl animate-float" style={{ animationDelay: '2s' }}>⚡</div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="success" className="mb-6 bg-white/20 text-white border-0 px-4 py-2">
              <span className="flex items-center gap-2">
                <IoSunny /> Sustainable Farming Solutions
              </span>
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Solar & Pump Solutions
            </h1>
            <p className="text-2xl mb-8 text-yellow-100">
              Harness the power of sun for your farm. Save up to 90% on electricity bills.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setShowQuoteForm(true)}
                className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition flex items-center gap-2 text-lg"
              >
                Get Free Quote <IoArrowForward />
              </button>
              <button
                onClick={() => document.getElementById('savings').scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition border-2 border-white"
              >
                Calculate Savings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Tabs */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 mb-8 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('pump')}
            className={`pb-4 px-6 font-semibold text-lg flex items-center gap-2 transition-all ${
              activeTab === 'pump'
                ? 'border-b-4 border-green-600 text-green-600 -mb-0.5'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <IoWater /> Solar Pump
          </button>
          <button
            onClick={() => setActiveTab('ongrid')}
            className={`pb-4 px-6 font-semibold text-lg flex items-center gap-2 transition-all ${
              activeTab === 'ongrid'
                ? 'border-b-4 border-green-600 text-green-600 -mb-0.5'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <IoFlash /> On-Grid System
          </button>
          <button
            onClick={() => setActiveTab('offgrid')}
            className={`pb-4 px-6 font-semibold text-lg flex items-center gap-2 transition-all ${
              activeTab === 'offgrid'
                ? 'border-b-4 border-green-600 text-green-600 -mb-0.5'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <IoBatteryFull /> Off-Grid System
          </button>
        </div>

        {/* Solar Pump Section */}
        {activeTab === 'pump' && (
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Solar Pump <span className="text-green-600">Installation</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Convert your agricultural pumps to solar power and reduce electricity bills by up to 80%. 
                Get government subsidy up to 90% under PM-KUSUM scheme.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="font-bold text-green-700">90% Subsidy</div>
                  <div className="text-sm text-gray-600">Government support</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="font-bold text-green-700">80% Savings</div>
                  <div className="text-sm text-gray-600">On electricity bills</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="text-3xl mb-2">🌱</div>
                  <div className="font-bold text-green-700">25 Years</div>
                  <div className="text-sm text-gray-600">System lifespan</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="text-3xl mb-2">🔄</div>
                  <div className="font-bold text-green-700">5 Years ROI</div>
                  <div className="text-sm text-gray-600">Quick payback</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <IoSunny className="text-yellow-500" /> Available Capacities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['2 HP', '3 HP', '5 HP', '7.5 HP', '10 HP', '15 HP', '20 HP', '25 HP'].map(cap => (
                    <div key={cap} className="border rounded-lg p-3 text-center hover:border-green-500 cursor-pointer transition">
                      <div className="font-semibold">{cap}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Installation Process</h3>
                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Site Survey', desc: 'Engineer visits to assess water source and power needs' },
                    { step: 2, title: 'System Design', desc: 'Customized design based on pump capacity and water depth' },
                    { step: 3, title: 'Subsidy Application', desc: 'Complete documentation for PM-KUSUM subsidy' },
                    { step: 4, title: 'Installation', desc: 'Professional installation in 3-5 days' },
                    { step: 5, title: 'Testing & Training', desc: 'System testing and farmer training' }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 bg-white p-4 rounded-xl shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-green-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-lg">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{item.title}</h4>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-400">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🏆</div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">PM-KUSUM Scheme Benefits</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircle className="text-green-600" /> Up to 90% subsidy on solar pumps
                      </li>
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircle className="text-green-600" /> Free feasibility study
                      </li>
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircle className="text-green-600" /> 5 years free maintenance
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* On-Grid Section */}
        {activeTab === 'ongrid' && (
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                On-Grid Solar <span className="text-green-600">System</span>
              </h2>
              <p className="text-lg text-gray-600">
                Generate your own electricity and sell excess to the grid. Earn money while saving on bills.
              </p>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Key Benefits</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <IoCheckmarkCircle className="text-green-600 text-xl" />
                    <span>Net metering facility with electricity board</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <IoCheckmarkCircle className="text-green-600 text-xl" />
                    <span>Sell excess power at ₹4-6 per unit</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <IoCheckmarkCircle className="text-green-600 text-xl" />
                    <span>No battery required - lower initial cost</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <IoCheckmarkCircle className="text-green-600 text-xl" />
                    <span>Accelerated depreciation for businesses</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-600">5-100 kW</div>
                  <div className="text-sm">System Size</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-600">₹4-6/unit</div>
                  <div className="text-sm">Selling Price</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Investment Calculator</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">System Size (kW)</label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={savings.systemSize}
                    onChange={(e) => setSavings(prev => ({ ...prev, systemSize: e.target.value }))}
                    className="w-full"
                  />
                  <div className="text-center font-bold mt-2">{savings.systemSize} kW</div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Investment</div>
                    <div className="text-xl font-bold">₹{(savings.systemSize * 50000).toLocaleString()}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Yearly Income</div>
                    <div className="text-xl font-bold text-green-600">
                      ₹{(savings.systemSize * 6000).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowQuoteForm(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Get Detailed Quote
              </button>
            </div>
          </div>
        )}

        {/* Off-Grid Section */}
        {activeTab === 'offgrid' && (
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Off-Grid Solar <span className="text-green-600">System</span>
              </h2>
              <p className="text-lg text-gray-600">
                Complete energy independence with battery storage. Perfect for remote farms and areas with unreliable grid.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">24/7</div>
                  <div className="text-sm">Power Supply</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">10-20 kWh</div>
                  <div className="text-sm">Battery Storage</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">100%</div>
                  <div className="text-sm">Grid Independence</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">10 Years</div>
                  <div className="text-sm">Battery Warranty</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6">System Components</h3>
              <div className="space-y-4">
                {[
                  { component: 'Solar Panels', desc: 'High-efficiency monocrystalline', price: '₹40-50/W' },
                  { component: 'Lithium Battery', desc: '10-20 kWh capacity', price: '₹8-10 Lakhs' },
                  { component: 'Hybrid Inverter', desc: '5-10 kW with MPPT', price: '₹1-2 Lakhs' },
                  { component: 'Charge Controller', desc: 'MPPT technology', price: '₹50-80k' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <div className="font-semibold">{item.component}</div>
                      <div className="text-sm text-gray-500">{item.desc}</div>
                    </div>
                    <div className="font-bold text-green-600">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Savings Calculator Section */}
        <div id="savings" className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Solar Savings Calculator</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Electricity Bill (₹)
                </label>
                <input
                  type="number"
                  name="monthlyBill"
                  value={savings.monthlyBill}
                  onChange={handleSavingsChange}
                  className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposed System Size (kW)
                </label>
                <input
                  type="number"
                  name="systemSize"
                  value={savings.systemSize}
                  onChange={handleSavingsChange}
                  className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                  placeholder="Enter kW"
                />
              </div>
              <button
                onClick={calculateSavings}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Calculate Savings
              </button>
            </div>
            
            {savings.calculatedSavings && (
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Your Savings</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded">
                    <span>Annual Savings</span>
                    <span className="font-bold text-green-600">₹{savings.calculatedSavings.annualSavings}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded">
                    <span>Payback Period</span>
                    <span className="font-bold">{savings.calculatedSavings.paybackYears} years</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded">
                    <span>CO₂ Reduction/year</span>
                    <span className="font-bold">{savings.calculatedSavings.co2Reduction} kg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded">
                    <span>25 Year Savings</span>
                    <span className="font-bold text-green-600">
                      ₹{(savings.calculatedSavings.annualSavings * 25).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  {showFaq[index] ? <IoChevronUp /> : <IoChevronDown />}
                </button>
                {showFaq[index] && (
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote Request Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Request Free Quote</h3>
                <button
                  onClick={() => setShowQuoteForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <IoClose className="text-2xl" />
                </button>
              </div>

              <form onSubmit={handleRequestQuote} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={quote.name}
                      onChange={handleChange}
                      className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={quote.phone}
                      onChange={handleChange}
                      className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={quote.email}
                    onChange={handleChange}
                    className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Farm Address *</label>
                  <textarea
                    name="address"
                    value={quote.address}
                    onChange={handleChange}
                    rows="2"
                    className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
                    <select
                      name="serviceType"
                      value={quote.serviceType}
                      onChange={handleChange}
                      className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                      required
                    >
                      <option value="solar-pump">Solar Pump</option>
                      <option value="on-grid">On-Grid System</option>
                      <option value="off-grid">Off-Grid System</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (HP/kW)</label>
                    <input
                      type="text"
                      name="capacity"
                      value={quote.capacity}
                      onChange={handleChange}
                      className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                      placeholder="e.g., 5 HP"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Land Area (acres)</label>
                    <input
                      type="text"
                      name="landArea"
                      value={quote.landArea}
                      onChange={handleChange}
                      className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range (₹)</label>
                    <select
                      name="budget"
                      value={quote.budget}
                      onChange={handleChange}
                      className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                    >
                      <option value="">Select range</option>
                      <option value="1-3">1-3 Lakhs</option>
                      <option value="3-5">3-5 Lakhs</option>
                      <option value="5-10">5-10 Lakhs</option>
                      <option value="10+">10+ Lakhs</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements</label>
                  <textarea
                    name="message"
                    value={quote.message}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                    placeholder="Tell us about your specific requirements..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Submit Quote Request'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EMI Calculator CTA */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 text-white py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Calculate Your Solar EMI</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Zero down payment options available with flexible tenure up to 5 years.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/emi-calculator')}
              className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2 text-lg"
            >
              <IoCalculator /> Use EMI Calculator
            </button>
            <button
              onClick={() => window.location.href = 'tel:+919876543210'}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition flex items-center gap-2 text-lg"
            >
              <IoCall /> Call Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}