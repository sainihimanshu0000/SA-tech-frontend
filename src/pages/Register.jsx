import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/UI'
import { useAuth } from '../hooks/useAuth'
import { IoPersonCircle, IoMail, IoLockClosed } from 'react-icons/io5'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { register } = useAuth()

  async function handleSubmit(e){
    e.preventDefault()
    if(password !== confirmPassword){
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    
    try {
      const result = await register(name, email, password)
      
      if (result.success) {
        // Registration successful - AuthContext state is updated
        console.log('Registration successful:', result.user)
        navigate('/')
      } else {
        // Registration failed - show error
        setError(result.error)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-agro-primary to-agro-primary-light flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-hover p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-agro-dark mb-2">Join AgroMart</h1>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          {error && (
            <div className="bg-agro-error/10 border-2 border-agro-error text-agro-error px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <IoPersonCircle className="absolute left-4 top-3 text-agro-primary" size={20} />
              <input 
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full name"
                className="w-full pl-12 pr-4 py-3 border-2 border-agro-background rounded-lg focus:border-agro-primary outline-none transition"
                required
              />
            </div>

            <div className="relative">
              <IoMail className="absolute left-4 top-3 text-agro-primary" size={20} />
              <input 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-12 pr-4 py-3 border-2 border-agro-background rounded-lg focus:border-agro-primary outline-none transition"
                required
              />
            </div>

            <div className="relative">
              <IoLockClosed className="absolute left-4 top-3 text-agro-primary" size={20} />
              <input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 border-2 border-agro-background rounded-lg focus:border-agro-primary outline-none transition"
                required
              />
            </div>

            <div className="relative">
              <IoLockClosed className="absolute left-4 top-3 text-agro-primary" size={20} />
              <input 
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full pl-12 pr-4 py-3 border-2 border-agro-background rounded-lg focus:border-agro-primary outline-none transition"
                required
              />
            </div>

            <Button 
              size="lg" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-agro-primary font-semibold hover:text-agro-dark transition">
              Sign in here
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white text-sm mt-8">
          © 2024 AgroMart. All rights reserved.
        </p>
      </div>
    </div>
  )
}
