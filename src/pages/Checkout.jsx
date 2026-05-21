import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../components/UI'
import API from '../api/axios'
import { IoCheckmarkCircle, IoCard } from 'react-icons/io5'

export default function Checkout(){
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const navigate = useNavigate()

  const [shipping, setShipping] = useState({ address: '', city: '', zipcode: '' })
  const [payment, setPayment] = useState({ method: 'stripe', token: '' })

  async function handlePlaceOrder(){
    setLoading(true)
    try {
      await API.post('/orders', {
        paymentMethod: payment.method,
        paymentToken: payment.token,
        shippingAddress: {
          address: shipping.address,
          city: shipping.city,
          pincode: shipping.zipcode,
        },
      })
      setOrderPlaced(true)
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      alert('Order failed: ' + (err.response?.data?.message || 'Try again'))
    } finally {
      setLoading(false)
    }
  }

  if(orderPlaced){
    return (
      <div className="min-h-screen bg-agro-background flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-hover p-12 text-center max-w-md">
          <IoCheckmarkCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-agro-dark mb-2">Order Placed!</h1>
          <p className="text-gray-600 mb-6">Your order has been successfully placed. Redirecting home...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-agro-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-agro-dark mb-8">Checkout</h1>

        {/* Step Indicator */}
        <div className="flex gap-4 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${step >= s ? 'bg-agro-primary' : 'bg-gray-300'}`}>
                {s}
              </div>
              <div className={`flex-1 h-1 ${step > s ? 'bg-agro-primary' : 'bg-gray-300'}`}></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-card p-8">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-agro-dark mb-4">Shipping Address</h2>
              <input 
                type="text" 
                placeholder="Full Address" 
                value={shipping.address}
                onChange={e => setShipping({...shipping, address: e.target.value})}
                className="w-full p-3 border-2 border-agro-background rounded-lg focus:border-agro-primary outline-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="City" 
                  value={shipping.city}
                  onChange={e => setShipping({...shipping, city: e.target.value})}
                  className="p-3 border-2 border-agro-background rounded-lg focus:border-agro-primary outline-none"
                />
                <input 
                  type="text" 
                  placeholder="ZIP Code" 
                  value={shipping.zipcode}
                  onChange={e => setShipping({...shipping, zipcode: e.target.value})}
                  className="p-3 border-2 border-agro-background rounded-lg focus:border-agro-primary outline-none"
                />
              </div>
              <Button size="lg" className="w-full" onClick={() => setStep(2)}>
                Continue to Payment
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-agro-dark mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { id: 'stripe', name: 'Credit Card (Stripe)', desc: 'Secure payment' },
                  { id: 'razorpay', name: 'Razorpay', desc: 'Indian payment gateway' }
                ].map(m => (
                  <div 
                    key={m.id}
                    onClick={() => setPayment({...payment, method: m.id})}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${payment.method === m.id ? 'border-agro-primary bg-agro-background' : 'border-gray-300'}`}
                  >
                    <div className="flex items-center">
                      <IoCard size={24} className={payment.method === m.id ? 'text-agro-primary' : 'text-gray-400'} />
                      <div className="ml-3">
                        <p className="font-semibold text-agro-dark">{m.name}</p>
                        <p className="text-xs text-gray-600">{m.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1" onClick={() => setStep(3)}>Review Order</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-agro-dark mb-4">Order Review</h2>
              <div className="bg-agro-background p-4 rounded-lg space-y-2">
                <p className="text-sm"><span className="font-semibold">Address:</span> {shipping.address}, {shipping.city} {shipping.zipcode}</p>
                <p className="text-sm"><span className="font-semibold">Payment:</span> {payment.method.toUpperCase()}</p>
                <p className="text-sm"><span className="font-semibold">Total:</span> Calculated at checkout</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                <Button 
                  className="flex-1" 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
