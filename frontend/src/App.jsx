import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'

/**
 * Main App Component
 * Handles routing and authentication state
 */
function App() {
  const { user, loading } = useAuth()
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-dark-300">
      {user && <Navbar />}
      
      <Routes>
        {/* Protected Route - Dashboard */}
        <Route 
          path="/" 
          element={user ? <Dashboard /> : <Navigate to="/login" />} 
        />
        
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/" /> : <Register />} 
        />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
