import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input } from '../components/UI'
import { createOrder } from '../api/ordersAPI'
import { getCart } from '../api/cartAPI'
import { IoCheckmarkCircle, IoCard, IoCash, IoLocation, IoBagCheck } from 'react-icons/io5'

export default function Checkout(){
  const [step, setStep] = useState(1)
  const [cart, setCart] = useState(null)
  const [cartLoading, setCartLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const [shipping, setShipping] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [payment, setPayment] = useState({ method: 'cod' })

  useEffect(() => {
    loadCart()
    window.scrollTo(0, 0)
  }, [])

  async function loadCart() {
    setCartLoading(true)
    setError('')
    try {
      const data = await getCart()
      setCart(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cart')
    } finally {
      setCartLoading(false)
    }
  }

  const items = cart?.products || []
  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
  const tax = Math.round(subtotal * 0.1)
  const shippingCharge = subtotal >= 500 ? 0 : 40
  const total = subtotal + tax + shippingCharge

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  function validateShipping() {
    const required = ['fullName', 'phoneNumber', 'address', 'city', 'state', 'pincode']
    const missing = required.filter((field) => !shipping[field]?.trim())
    if (missing.length) {
      setError('Please complete all required shipping fields')
      return false
    }
    return true
  }

  async function handlePlaceOrder(){
    if (!validateShipping()) return
    setLoading(true)
    setError('')
    try {
      const data = await createOrder({
        paymentMethod: payment.method,
        shippingAddress: shipping,
      })
      setPlacedOrder(data.order)
      setStep(4)
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-agro-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-agro-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!placedOrder && items.length === 0) {
    return (
      <div className="min-h-screen bg-agro-background flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-hover p-10 text-center max-w-md">
          <IoBagCheck className="text-agro-primary text-6xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-agro-dark mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add products before starting checkout.</p>
          <Link to="/products">
            <Button>Shop Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  if(step === 4 && placedOrder){
    return (
      <div className="min-h-screen bg-agro-background flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-hover p-10 text-center max-w-lg">
          <IoCheckmarkCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-agro-dark mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-4">Thank you for shopping with AgroMart.</p>
          <div className="bg-agro-background rounded-xl p-4 text-left mb-6">
            <p className="text-sm"><span className="font-semibold">Order Number:</span> {placedOrder.orderNumber}</p>
            <p className="text-sm"><span className="font-semibold">Status:</span> {placedOrder.orderStatus}</p>
            <p className="text-sm"><span className="font-semibold">Total:</span> {formatCurrency(placedOrder.totalAmount)}</p>
            <p className="text-sm"><span className="font-semibold">Payment:</span> {placedOrder.paymentMethod?.toUpperCase()}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1" onClick={() => navigate('/profile')}>View My Orders</Button>
            <Button variant="outline" className="flex-1" onClick={() => navigate('/products')}>Continue Shopping</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-agro-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-card p-8">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-agro-dark mb-4 flex items-center gap-2">
                  <IoLocation className="text-agro-primary" /> Shipping Address
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Full Name *" value={shipping.fullName} onChange={e => setShipping({...shipping, fullName: e.target.value})} />
                  <Input label="Phone Number *" value={shipping.phoneNumber} onChange={e => setShipping({...shipping, phoneNumber: e.target.value})} />
                </div>
                <Input label="Address *" value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} />
                <Input label="Landmark" value={shipping.landmark} onChange={e => setShipping({...shipping, landmark: e.target.value})} />
                <div className="grid sm:grid-cols-3 gap-4">
                  <Input label="City *" value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} />
                  <Input label="State *" value={shipping.state} onChange={e => setShipping({...shipping, state: e.target.value})} />
                  <Input label="Pincode *" value={shipping.pincode} onChange={e => setShipping({...shipping, pincode: e.target.value})} />
                </div>
                <Button size="lg" className="w-full" onClick={() => validateShipping() && setStep(2)}>
                  Continue to Payment
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-agro-dark mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { id: 'cod', name: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: IoCash },
                    { id: 'stripe', name: 'Credit Card (Stripe)', desc: 'Online payment setup required', icon: IoCard, disabled: true },
                    { id: 'razorpay', name: 'Razorpay', desc: 'Online payment setup required', icon: IoCard, disabled: true },
                  ].map(({ id, name, desc, icon: Icon, disabled }) => (
                    <button
                      type="button"
                      key={id}
                      disabled={disabled}
                      onClick={() => !disabled && setPayment({...payment, method: id})}
                      className={`w-full text-left p-4 border-2 rounded-lg transition ${
                        payment.method === id ? 'border-agro-primary bg-agro-background' : 'border-gray-300'
                      } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-agro-primary'}`}
                    >
                      <div className="flex items-center">
                        <Icon size={24} className={payment.method === id ? 'text-agro-primary' : 'text-gray-400'} />
                        <div className="ml-3">
                          <p className="font-semibold text-agro-dark">{name}</p>
                          <p className="text-xs text-gray-600">{desc}</p>
                        </div>
                      </div>
                    </button>
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
                  <p className="text-sm"><span className="font-semibold">Ship To:</span> {shipping.fullName}, {shipping.phoneNumber}</p>
                  <p className="text-sm"><span className="font-semibold">Address:</span> {shipping.address}, {shipping.city}, {shipping.state} - {shipping.pincode}</p>
                  <p className="text-sm"><span className="font-semibold">Payment:</span> {payment.method.toUpperCase()}</p>
                  <p className="text-sm"><span className="font-semibold">Total:</span> {formatCurrency(total)}</p>
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

          <aside className="bg-white rounded-xl shadow-card p-6 h-fit">
            <h2 className="text-xl font-bold text-agro-dark mb-4">Order Summary</h2>
            <div className="divide-y divide-gray-100 mb-4">
              {items.map((item) => (
                <div key={item.product?._id} className="py-3 flex gap-3">
                  {item.product?.images?.primary && (
                    <img src={item.product.images.primary} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-sm line-clamp-2">{item.product?.name}</p>
                    <p className="text-xs text-gray-500">Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm">{formatCurrency((item.product?.price || 0) * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(tax)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shippingCharge === 0 ? 'Free' : formatCurrency(shippingCharge)}</span></div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold text-agro-dark">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
