/**
 * TodoForm component.
 * Form for creating and editing todos.
 */

'use client';

import { useState, useEffect } from 'react';
import { Todo, TodoCreate, TodoPriority, TodoStatus } from '../types/todo';

interface TodoFormProps {
  todo?: Todo | null;
  onSubmit: (todoData: TodoCreate) => void;
  onCancel?: () => void;
}

export default function TodoForm({ todo, onSubmit, onCancel }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TodoPriority>(TodoPriority.MEDIUM);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      setPriority(todo.priority);
      setTags(todo.tags);
    }
  }, [todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (title.length > 500) {
      setError('Title must be 500 characters or less');
      return;
    }

    if (description.length > 2000) {
      setError('Description must be 2000 characters or less');
      return;
    }

    if (tags.length > 20) {
      setError('Maximum 20 tags allowed');
      return;
    }

    const todoData: TodoCreate = {
      title: title.trim(),
      description: description.trim() || null,
      priority,
      tags,
    };

    onSubmit(todoData);

    // Reset form
    setTitle('');
    setDescription('');
    setPriority(TodoPriority.MEDIUM);
    setTags([]);
    setTagInput('');
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 20) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: 'white',
        marginBottom: '24px',
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
        {todo ? 'Edit Todo' : 'Create New Todo'}
      </h2>

      {error && (
        <div
          style={{
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo title"
          required
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter todo description (optional)"
          rows={3}
          style={{ width: '100%', resize: 'vertical' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>
          Priority
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TodoPriority)}
          style={{ width: '100%' }}
        >
          <option value={TodoPriority.HIGH}>High</option>
          <option value={TodoPriority.MEDIUM}>Medium</option>
          <option value={TodoPriority.LOW}>Low</option>
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>
          Tags
        </label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag"
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={addTag}
            style={{ backgroundColor: '#6b7280', color: 'white' }}
          >
            Add Tag
          </button>
        </div>
        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0',
                    cursor: 'pointer',
                    fontSize: '16px',
                    lineHeight: '1',
                    color: '#6b7280',
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="submit"
          style={{ backgroundColor: '#10b981', color: 'white', flex: 1 }}
        >
          {todo ? 'Update Todo' : 'Create Todo'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{ backgroundColor: '#6b7280', color: 'white' }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
