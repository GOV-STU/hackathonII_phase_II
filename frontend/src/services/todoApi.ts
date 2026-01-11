/**
 * API client for Todo operations.
 * Provides HTTP client functions for interacting with the backend API.
 */

import { Todo, TodoCreate, TodoUpdate, TodoStatus, TodoPriority } from '../types/todo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface FetchTodosParams {
  status?: TodoStatus;
  priority?: TodoPriority;
  search?: string;
  tag?: string;
  sort_by?: 'priority' | 'title' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

/**
 * Fetch all todos with optional filtering and sorting.
 */
export async function fetchTodos(params?: FetchTodosParams): Promise<Todo[]> {
  const queryParams = new URLSearchParams();

  if (params?.status) queryParams.append('status', params.status);
  if (params?.priority) queryParams.append('priority', params.priority);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.tag) queryParams.append('tag', params.tag);
  if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
  if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

  const url = `${API_URL}/todos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch todos: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create a new todo.
 */
export async function createTodo(todoData: TodoCreate): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todoData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create todo');
  }

  return response.json();
}

/**
 * Get a single todo by ID.
 */
export async function getTodo(todoId: string): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos/${todoId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch todo: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update an existing todo.
 */
export async function updateTodo(todoId: string, todoData: TodoUpdate): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos/${todoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todoData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update todo');
  }

  return response.json();
}

/**
 * Delete a todo.
 */
export async function deleteTodo(todoId: string): Promise<void> {
  const response = await fetch(`${API_URL}/todos/${todoId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete todo: ${response.statusText}`);
  }
}

/**
 * Toggle todo completion status.
 */
export async function toggleTodoStatus(todoId: string): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos/${todoId}/toggle`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Failed to toggle todo status: ${response.statusText}`);
  }

  return response.json();
}
