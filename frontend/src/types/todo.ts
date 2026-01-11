/**
 * TypeScript type definitions for Todo entities.
 */

export enum TodoStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export enum TodoPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export interface Todo {
  id: string; // UUID as string
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority;
  tags: string[];
  created_at: string; // ISO 8601 datetime string
  updated_at: string; // ISO 8601 datetime string
}

export interface TodoCreate {
  title: string;
  description?: string | null;
  status?: TodoStatus;
  priority?: TodoPriority;
  tags?: string[];
}

export interface TodoUpdate {
  title?: string;
  description?: string | null;
  status?: TodoStatus;
  priority?: TodoPriority;
  tags?: string[];
}
