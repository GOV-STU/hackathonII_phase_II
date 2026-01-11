/**
 * FilterControls component.
 * Dropdowns for filtering todos by status and priority.
 */

'use client';

import { TodoStatus, TodoPriority } from '../types/todo';

interface FilterControlsProps {
  status: TodoStatus | 'all';
  priority: TodoPriority | 'all';
  onStatusChange: (status: TodoStatus | 'all') => void;
  onPriorityChange: (priority: TodoPriority | 'all') => void;
}

export default function FilterControls({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}: FilterControlsProps) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1', minWidth: '200px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
          }}
        >
          Filter by Status
        </label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as TodoStatus | 'all')}
          style={{ width: '100%', padding: '8px 12px' }}
        >
          <option value="all">All</option>
          <option value={TodoStatus.PENDING}>Pending</option>
          <option value={TodoStatus.COMPLETED}>Completed</option>
        </select>
      </div>

      <div style={{ flex: '1', minWidth: '200px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
          }}
        >
          Filter by Priority
        </label>
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value as TodoPriority | 'all')}
          style={{ width: '100%', padding: '8px 12px' }}
        >
          <option value="all">All</option>
          <option value={TodoPriority.HIGH}>High</option>
          <option value={TodoPriority.MEDIUM}>Medium</option>
          <option value={TodoPriority.LOW}>Low</option>
        </select>
      </div>
    </div>
  );
}
