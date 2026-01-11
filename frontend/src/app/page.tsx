/**
 * Home page - Main todo application interface.
 * Integrates TodoList and TodoForm with state management for CRUD operations.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Todo, TodoCreate, TodoStatus, TodoPriority } from '../types/todo';
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus,
} from '../services/todoApi';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import SearchBar from '../components/SearchBar';
import FilterControls from '../components/FilterControls';
import SortControls from '../components/SortControls';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Filter and sort state
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<TodoStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TodoPriority | 'all'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'title' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load todos with filters
  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodos({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        search: searchText || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [searchText, statusFilter, priorityFilter, sortBy, sortOrder]);

  // Load todos when filters change
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleCreateTodo = async (todoData: TodoCreate) => {
    try {
      setError(null);
      const newTodo = await createTodo(todoData);
      setTodos([newTodo, ...todos]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    }
  };

  const handleUpdateTodo = async (todoData: TodoCreate) => {
    if (!editingTodo) return;

    try {
      setError(null);
      const updatedTodo = await updateTodo(editingTodo.id, todoData);
      setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
      setEditingTodo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      setError(null);
      await deleteTodo(todoId);
      setTodos(todos.filter((t) => t.id !== todoId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  const handleToggleTodo = async (todoId: string) => {
    try {
      setError(null);
      const updatedTodo = await toggleTodoStatus(todoId);
      setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle todo status');
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  return (
    <main>
      <h1>Todo App - Phase II</h1>

      <TodoForm
        todo={editingTodo}
        onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
        onCancel={editingTodo ? handleCancelEdit : undefined}
      />

      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: 'white',
          marginBottom: '24px',
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
          Search & Filter
        </h2>

        <SearchBar onSearch={setSearchText} />

        <FilterControls
          status={statusFilter}
          priority={priorityFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
        />

        <SortControls
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
        />
      </div>

      <TodoList
        todos={todos}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteTodo}
        onToggle={handleToggleTodo}
      />
    </main>
  );
}
