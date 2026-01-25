import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * Task Form Modal Component
 * For creating and editing tasks
 */
function TaskForm({ task, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: ''
  })
  
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  
  // Populate form when editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        due_date: task.due_date ? task.due_date.split('T')[0] : ''
      })
    }
  }, [task])
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }
  
  // Validate form
  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setSaving(true)
    try {
      await onSave({
        ...formData,
        due_date: formData.due_date || null
      })
      onClose()
    } catch (error) {
      setErrors({ submit: 'Failed to save task. Please try again.' })
    } finally {
      setSaving(false)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-200 rounded-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-dark-100 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-dark-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.title ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-dark-300 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Enter task description (optional)"
            />
          </div>
          
          {/* Status and Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-300 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-300 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-300 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {/* Error message */}
          {errors.submit && (
            <p className="text-red-400 text-sm">{errors.submit}</p>
          )}
          
          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-dark-100 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-primary text-dark-300 font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : (task ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm
