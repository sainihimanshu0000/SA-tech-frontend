import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowForward, IoCheckmarkCircle, IoPeople, IoCall, IoMail, IoLocation, IoClose } from 'react-icons/io5'
import { createServiceRequest } from '../api/servicesAPI'
import { Button } from '../components/UI'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-hot-toast'

export default function Services() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serviceType, setServiceType] = useState('installation')
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', message: '' })

  const services = [
    { id: 'installation', title: 'Installation & Setup', desc: 'Site survey, system design and professional installation', features: ['Site survey', 'Custom design', 'Professional install', 'Testing & training'] },
    { id: 'maintenance', title: 'Maintenance & Support', desc: 'Scheduled maintenance and emergency repairs', features: ['Periodic checkups', 'Spare parts', 'Emergency repair', 'Remote support'] },
    { id: 'iot', title: 'IoT Monitoring', desc: 'Sensor installation and remote monitoring', features: ['Soil & moisture sensors', 'Remote alerts', 'Dashboard access', 'Automation rules'] },
    { id: 'advisory', title: 'Crop Advisory & Training', desc: 'Expert agronomy guidance and on-field training', features: ['Soil testing', 'Crop planning', 'Pest management', 'On-field workshops'] }
  ]

  const openBooking = (serviceId) => {
    if (!isAuthenticated) {
      toast.error('Please login to request a service')
      navigate('/login', { state: { from: '/services' } })
      return
    }
    const initial = { ...form }
    if (user) {
      initial.name = user.name || ''
      initial.email = user.email || ''
      initial.phone = user.phoneNumber || user.phone || ''
    }
    setForm(initial)
    setServiceType(serviceId)
    setShowModal(true)
  }

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.phone || !form.address) return toast.error('Please fill required fields')
    setLoading(true)
    try {
      await createServiceRequest({
        serviceType,
        description: form.message || `${serviceType} request from ${form.name}`,
        location: { address: form.address },
        estimatedBudget: null
      })
      toast.success('Service request submitted — we will contact you soon')
      setShowModal(false)
      setForm({ name: '', email: '', phone: '', address: '', message: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="relative bg-gradient-to-r from-green-800 via-green-600 to-yellow-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Services & Install</h1>
          <p className="max-w-2xl mx-auto text-lg opacity-90">Professional installation, maintenance and smart farming services for your farm.</p>
          <div className="mt-6 flex justify-center gap-4">
            <Button onClick={() => openBooking('installation')}>Book Installation</Button>
            <Button variant="outline" onClick={() => document.getElementById('services-list')?.scrollIntoView({ behavior: 'smooth' })}>Explore Services</Button>
          </div>
        </div>
      </div>

      <section id="services-list" className="py-12 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(s => (
            <div key={s.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{s.title}</h3>
                <div className="text-green-600 text-2xl"><IoPeople /></div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{s.desc}</p>
              <ul className="text-sm text-gray-600 mb-4 space-y-2">
                {s.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2"><IoCheckmarkCircle className="text-green-600 mt-0.5" />{f}</li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Button onClick={() => openBooking(s.id)} size="md">Book Now</Button>
                <Button variant="ghost" onClick={() => toast('More details coming soon')}>Learn More <IoArrowForward /></Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Installation Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: 1, title: 'Site Survey', desc: 'Engineer visit to assess requirements' },
              { step: 2, title: 'Design & Quotation', desc: 'Customized solution and cost estimate' },
              { step: 3, title: 'Install & Test', desc: 'Professional installation and commissioning' }
            ].map(item => (
              <div key={item.step} className="p-6 bg-green-50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold mb-3">{item.step}</div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Request Service</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full"><IoClose /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" className="w-full p-3 border rounded" required />
                <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border rounded" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full p-3 border rounded" required />
                <input name="address" value={form.address} onChange={handleChange} placeholder="Farm address" className="w-full p-3 border rounded" required />
              </div>

              <div>
                <label className="block text-sm mb-1">Service</label>
                <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full p-3 border rounded">
                  {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>

              <div>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Describe your requirement" rows={4} className="w-full p-3 border rounded" />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Submit Request'}</Button>
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
