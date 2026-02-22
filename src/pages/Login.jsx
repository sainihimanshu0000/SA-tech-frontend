import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/UI'
import { useAuth } from '../hooks/useAuth'
import { IoMail, IoLockClosed } from 'react-icons/io5'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const result = await login(email, password)
      
      if (result.success) {
        // Login successful - AuthContext state is updated
        console.log('Login successful:', result.user)
        navigate('/')
      } else {
        // Login failed - show error
        setError(result.error)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Login error:', err)
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
            <h1 className="text-4xl font-bold text-agro-dark mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your AgroMart account</p>
          </div>

          {error && (
            <div className="bg-agro-error/10 border-2 border-agro-error text-agro-error px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button 
              size="lg" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 text-center text-gray-500 text-sm">
            or
          </div>

          {/* Links */}
          <div className="space-y-3">
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-agro-primary font-semibold hover:text-agro-dark transition">
                Sign up here
              </Link>
            </p>
            <a href="#" className="block text-center text-agro-primary text-sm hover:text-agro-dark transition">
              Forgot password?
            </a>
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
