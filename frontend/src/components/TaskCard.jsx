import { Clock, Flag, Trash2, Edit, Check } from 'lucide-react'

/**
 * Task Card Component
 * Displays a single task with actions
 */
function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  // Priority color mapping
  const priorityColors = {
    high: 'text-red-400 bg-red-400/10',
    medium: 'text-yellow-400 bg-yellow-400/10',
    low: 'text-green-400 bg-green-400/10'
  }
  
  // Status color mapping
  const statusColors = {
    todo: 'bg-gray-500',
    in_progress: 'bg-blue-500',
    completed: 'bg-green-500'
  }
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }
  
  // Check if task is overdue
  const isOverdue = () => {
    if (!task.due_date || task.status === 'completed') return false
    return new Date(task.due_date) < new Date()
  }
  
  return (
    <div className={`bg-dark-200 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-all ${
      task.status === 'completed' ? 'opacity-60' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {/* Status indicator */}
          <span className={`w-2 h-2 rounded-full ${statusColors[task.status]}`}></span>
          
          {/* Title */}
          <h3 className={`font-medium ${
            task.status === 'completed' ? 'line-through text-gray-500' : ''
          }`}>
            {task.title}
          </h3>
        </div>
        
        {/* Priority badge */}
        <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      
      {/* Description */}
      {task.description && (
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Due date */}
        <div className="flex items-center space-x-2">
          {task.due_date && (
            <span className={`flex items-center text-xs ${
              isOverdue() ? 'text-red-400' : 'text-gray-500'
            }`}>
              <Clock className="w-3 h-3 mr-1" />
              {formatDate(task.due_date)}
            </span>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Mark complete/incomplete */}
          <button
            onClick={() => onStatusChange(
              task.id,
              task.status === 'completed' ? 'todo' : 'completed'
            )}
            className="p-1 rounded hover:bg-dark-100 text-gray-400 hover:text-green-400 transition-colors"
            title={task.status === 'completed' ? 'Mark as todo' : 'Mark as complete'}
          >
            <Check className="w-4 h-4" />
          </button>
          
          {/* Edit */}
          <button
            onClick={() => onEdit(task)}
            className="p-1 rounded hover:bg-dark-100 text-gray-400 hover:text-primary transition-colors"
            title="Edit task"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          {/* Delete */}
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 rounded hover:bg-dark-100 text-gray-400 hover:text-red-400 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
