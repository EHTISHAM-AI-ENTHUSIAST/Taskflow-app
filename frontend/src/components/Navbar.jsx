import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CheckSquare, LogOut, User } from 'lucide-react'

/**
 * Navigation Bar Component
 */
function Navbar() {
  const { user, logout } = useAuth()
  
  return (
    <nav className="bg-dark-200 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <CheckSquare className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">TaskTracker</span>
          </Link>
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <User className="w-5 h-5" />
              <span>{user?.name}</span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-dark-100 hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
