import { useState, useEffect } from 'react'
import { Plus, ListTodo, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import api from '../services/api'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'

/**
 * Dashboard Page Component
 * Main task management interface
 */
function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState('all')
  
  // Fetch tasks and stats on mount
  useEffect(() => {
    fetchData()
  }, [])
  
  // Fetch all data
  const fetchData = async () => {
    try {
      const [tasksRes, statsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/tasks/stats/summary')
      ])
      setTasks(tasksRes.data)
      setStats(statsRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Create or update task
  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      // Update existing task
      await api.put(`/tasks/${editingTask.id}`, taskData)
    } else {
      // Create new task
      await api.post('/tasks', taskData)
    }
    fetchData()
    setEditingTask(null)
  }
  
  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    await api.delete(`/tasks/${taskId}`)
    fetchData()
  }
  
  // Update task status
  const handleStatusChange = async (taskId, newStatus) => {
    await api.put(`/tasks/${taskId}`, { status: newStatus })
    fetchData()
  }
  
  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    return task.status === filter
  })
  
  // Open edit form
  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowForm(true)
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <button
          onClick={() => {
            setEditingTask(null)
            setShowForm(true)
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-dark-300 font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>
      
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-dark-200 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center space-x-3">
              <ListTodo className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-gray-500 text-sm">Total Tasks</p>
              </div>
            </div>
          </div>
          
          <div className="bg-dark-200 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold">{stats.in_progress}</p>
                <p className="text-gray-500 text-sm">In Progress</p>
              </div>
            </div>
          </div>
          
          <div className="bg-dark-200 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-gray-500 text-sm">Completed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-dark-200 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.completion_rate}%</p>
                <p className="text-gray-500 text-sm">Completion Rate</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6">
        {['all', 'todo', 'in_progress', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-primary text-dark-300'
                : 'bg-dark-200 text-gray-400 hover:text-white'
            }`}
          >
            {status === 'all' ? 'All' : 
             status === 'in_progress' ? 'In Progress' :
             status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Tasks Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ListTodo className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-400">No tasks found</h3>
          <p className="text-gray-500 mt-2">
            {filter === 'all' 
              ? "Create your first task to get started!"
              : `No ${filter.replace('_', ' ')} tasks`}
          </p>
        </div>
      )}
      
      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => {
            setShowForm(false)
            setEditingTask(null)
          }}
        />
      )}
    </div>
  )
}

export default Dashboard
