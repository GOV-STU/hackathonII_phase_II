# Data Model: Full-Stack Todo Web Application

**Feature**: 001-todo-app
**Date**: 2026-01-11
**Phase**: Phase 1 - Data Model Design

## Overview

This document defines the data model for the Todo application. The model is designed to be simple, extensible, and ready for Phase III AI integration without breaking changes.

## Entity: Todo

### Description

Represents a single task or action item that a user wants to track. Each todo has a title, optional description, completion status, priority level, and optional tags for organization.

### Attributes

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| `id` | UUID | Primary Key, Auto-generated | Unique identifier for the todo item |
| `title` | String | Required, Max 500 chars | The main text describing the task |
| `description` | String | Optional, Max 2000 chars | Additional details about the task |
| `status` | Enum | Required, Default: "pending" | Completion status: "pending" or "completed" |
| `priority` | Enum | Required, Default: "medium" | Priority level: "high", "medium", or "low" |
| `tags` | Array[String] | Optional, Max 20 tags, Max 50 chars each | Categories or labels for organization |
| `created_at` | DateTime | Auto-generated, Immutable | Timestamp when the todo was created (UTC) |
| `updated_at` | DateTime | Auto-updated | Timestamp when the todo was last modified (UTC) |

### Enumerations

**Status Enum**:
- `pending`: Task is not yet completed
- `completed`: Task has been finished

**Priority Enum**:
- `high`: Urgent or important task
- `medium`: Normal priority task (default)
- `low`: Less urgent task

### Validation Rules

**Title**:
- MUST NOT be empty or whitespace-only
- MUST be between 1 and 500 characters
- MUST be trimmed of leading/trailing whitespace
- Special characters and Unicode are allowed

**Description**:
- MAY be null or empty
- MUST be at most 2000 characters if provided
- Special characters and Unicode are allowed

**Status**:
- MUST be one of: "pending", "completed"
- Defaults to "pending" if not specified

**Priority**:
- MUST be one of: "high", "medium", "low"
- Defaults to "medium" if not specified

**Tags**:
- MAY be an empty array
- MUST contain at most 20 tags
- Each tag MUST be between 1 and 50 characters
- Each tag MUST be trimmed of leading/trailing whitespace
- Duplicate tags are allowed (backend may deduplicate)
- Tags are case-sensitive

**Timestamps**:
- `created_at` is set automatically on creation and never changes
- `updated_at` is set automatically on creation and updated on every modification
- Both timestamps are stored in UTC

### State Transitions

**Status Transitions**:
```
pending → completed (user marks task as done)
completed → pending (user reopens task)
```

**Priority Transitions**:
```
Any priority → Any priority (user can change priority at any time)
```

No restrictions on state transitions. Users can freely change status and priority.

### Database Schema (PostgreSQL)

```sql
CREATE TYPE todo_status AS ENUM ('pending', 'completed');
CREATE TYPE todo_priority AS ENUM ('high', 'medium', 'low');

CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL CHECK (length(trim(title)) > 0),
    description TEXT CHECK (length(description) <= 2000),
    status todo_status NOT NULL DEFAULT 'pending',
    priority todo_priority NOT NULL DEFAULT 'medium',
    tags TEXT[] DEFAULT '{}' CHECK (array_length(tags, 1) IS NULL OR array_length(tags, 1) <= 20),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_todos_status ON todos(status);
CREATE INDEX idx_todos_priority ON todos(priority);
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
CREATE INDEX idx_todos_title ON todos USING gin(to_tsvector('english', title));
CREATE INDEX idx_todos_description ON todos USING gin(to_tsvector('english', description));
CREATE INDEX idx_todos_tags ON todos USING gin(tags);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todos_updated_at BEFORE UPDATE ON todos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### SQLModel Definition (Python)

```python
from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class TodoStatus(str, Enum):
    """Todo completion status"""
    PENDING = "pending"
    COMPLETED = "completed"


class TodoPriority(str, Enum):
    """Todo priority level"""
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class TodoBase(SQLModel):
    """Base model for Todo with shared fields"""
    title: str = Field(min_length=1, max_length=500)
    description: Optional[str] = Field(default=None, max_length=2000)
    status: TodoStatus = Field(default=TodoStatus.PENDING)
    priority: TodoPriority = Field(default=TodoPriority.MEDIUM)
    tags: list[str] = Field(default_factory=list, max_length=20)


class Todo(TodoBase, table=True):
    """Todo database model"""
    __tablename__ = "todos"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TodoCreate(TodoBase):
    """Model for creating a new todo"""
    pass


class TodoUpdate(SQLModel):
    """Model for updating an existing todo (all fields optional)"""
    title: Optional[str] = Field(default=None, min_length=1, max_length=500)
    description: Optional[str] = Field(default=None, max_length=2000)
    status: Optional[TodoStatus] = None
    priority: Optional[TodoPriority] = None
    tags: Optional[list[str]] = Field(default=None, max_length=20)


class TodoRead(TodoBase):
    """Model for reading a todo (includes generated fields)"""
    id: UUID
    created_at: datetime
    updated_at: datetime
```

### TypeScript Type Definition (Frontend)

```typescript
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
```

## Relationships

**Phase II**: No relationships. Single entity model.

**Phase III Considerations**: The model is designed to support future relationships without breaking changes:
- User relationship (for multi-user support)
- AI agent relationship (for tracking AI-generated todos)
- Subtask relationship (for task hierarchies)
- Attachment relationship (for file uploads)

## Query Patterns

### Common Queries

**List all todos**:
```sql
SELECT * FROM todos ORDER BY created_at DESC;
```

**Search by text**:
```sql
SELECT * FROM todos
WHERE to_tsvector('english', title || ' ' || COALESCE(description, ''))
      @@ plainto_tsquery('english', 'search term');
```

**Filter by status**:
```sql
SELECT * FROM todos WHERE status = 'pending';
```

**Filter by priority**:
```sql
SELECT * FROM todos WHERE priority = 'high';
```

**Filter by tag**:
```sql
SELECT * FROM todos WHERE 'work' = ANY(tags);
```

**Combined filters**:
```sql
SELECT * FROM todos
WHERE status = 'pending'
  AND priority = 'high'
  AND 'urgent' = ANY(tags);
```

**Sort by priority**:
```sql
SELECT * FROM todos
ORDER BY
  CASE priority
    WHEN 'high' THEN 1
    WHEN 'medium' THEN 2
    WHEN 'low' THEN 3
  END;
```

**Sort by title**:
```sql
SELECT * FROM todos ORDER BY title ASC;
```

**Sort by creation time**:
```sql
SELECT * FROM todos ORDER BY created_at DESC;
```

## Data Integrity

### Constraints

- Primary key ensures uniqueness
- NOT NULL constraints prevent missing required fields
- CHECK constraints enforce length limits
- ENUM types enforce valid status and priority values
- Array length constraint limits number of tags
- Timestamps are immutable (created_at) or auto-updated (updated_at)

### Validation

- Backend validates all input via Pydantic/SQLModel
- Database enforces constraints as last line of defense
- Frontend provides basic validation for user experience

## Migration Strategy

### Initial Migration

Create the todos table with all fields, indexes, and triggers.

### Future Migrations

- Add new optional fields (backward compatible)
- Add new indexes for performance
- Add new ENUM values (requires careful handling)
- Add new tables for relationships (Phase III)

### Rollback Strategy

- Keep migration scripts versioned
- Test migrations on staging database
- Have rollback scripts ready
- Document breaking changes

## Performance Considerations

### Indexes

- `idx_todos_status`: Fast filtering by completion status
- `idx_todos_priority`: Fast filtering by priority
- `idx_todos_created_at`: Fast sorting by creation time
- `idx_todos_title`: Full-text search on title
- `idx_todos_description`: Full-text search on description
- `idx_todos_tags`: Fast filtering by tags (GIN index)

### Query Optimization

- Use indexes for WHERE clauses
- Limit result sets with pagination
- Avoid SELECT * in production (specify columns)
- Use prepared statements to prevent SQL injection

### Scalability

- UUID primary keys allow distributed ID generation
- No foreign keys in Phase II (simple queries)
- Indexes support 1000+ todos without degradation
- Connection pooling handles concurrent requests

## Summary

The Todo data model is simple, well-constrained, and designed for extensibility. It satisfies all functional requirements from the specification while maintaining a clean schema that can evolve in Phase III without breaking changes.
