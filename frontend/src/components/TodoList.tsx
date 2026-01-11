/**
 * TodoList component.
 * Displays an array of TodoItem components with loading and error states.
 */

'use client';

import { Todo } from '../types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  onEdit: (todo: Todo) => void;
  onDelete: (todoId: string) => void;
  onToggle: (todoId: string) => void;
}

export default function TodoList({
  todos,
  loading,
  error,
  onEdit,
  onDelete,
  onToggle,
}: TodoListProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        <div style={{ fontSize: '18px' }}>Loading todos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}
      >
        <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
          No todos found. Create your first todo above!
        </p>
      </div>
    );
  }

  return (
    <div>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
