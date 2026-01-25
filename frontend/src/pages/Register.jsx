import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CheckSquare, Mail, Lock, User, AlertCircle } from 'lucide-react'

/**
 * Register Page Component
 */
function Register() {
  const { register } = useAuth()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    
    try {
      await register(name, email, password)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <CheckSquare className="w-10 h-10 text-primary" />
            <span className="text-2xl font-bold">TaskTracker</span>
          </div>
          <p className="text-gray-500">Create your account to get started</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-dark-200 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-6">Create Account</h2>
          
          {/* Error */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}
          
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-300 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>
          
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-300 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          
          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-300 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Create a password"
                required
              />
            </div>
          </div>
          
          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-300 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>
          
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary text-dark-300 font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          {/* Login link */}
          <p className="text-center text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
