/**
 * TodoItem component.
 * Displays a single todo item with edit, delete, and toggle buttons.
 */

'use client';

import { Todo, TodoStatus, TodoPriority } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (todoId: string) => void;
  onToggle: (todoId: string) => void;
}

export default function TodoItem({ todo, onEdit, onDelete, onToggle }: TodoItemProps) {
  const isCompleted = todo.status === TodoStatus.COMPLETED;

  const getPriorityColor = (priority: TodoPriority) => {
    switch (priority) {
      case TodoPriority.HIGH:
        return '#ef4444';
      case TodoPriority.MEDIUM:
        return '#f59e0b';
      case TodoPriority.LOW:
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        backgroundColor: isCompleted ? '#f9fafb' : 'white',
        opacity: isCompleted ? 0.7 : 1,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggle(todo.id)}
          style={{ marginTop: '4px', cursor: 'pointer', width: '18px', height: '18px' }}
        />

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h3
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 600,
                textDecoration: isCompleted ? 'line-through' : 'none',
                color: isCompleted ? '#6b7280' : '#111827',
              }}
            >
              {todo.title}
            </h3>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 500,
                backgroundColor: getPriorityColor(todo.priority) + '20',
                color: getPriorityColor(todo.priority),
              }}
            >
              {todo.priority}
            </span>
          </div>

          {todo.description && (
            <p
              style={{
                margin: '8px 0',
                fontSize: '14px',
                color: '#6b7280',
                textDecoration: isCompleted ? 'line-through' : 'none',
              }}
            >
              {todo.description}
            </p>
          )}

          {todo.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
              {todo.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    backgroundColor: '#e5e7eb',
                    color: '#374151',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onEdit(todo)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              fontSize: '14px',
            }}
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this todo?')) {
                onDelete(todo.id);
              }
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: '#ef4444',
              color: 'white',
              fontSize: '14px',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
