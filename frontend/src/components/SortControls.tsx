/**
 * SortControls component.
 * Dropdown for sorting todos by field and order.
 */

'use client';

interface SortControlsProps {
  sortBy: 'priority' | 'title' | 'created_at';
  sortOrder: 'asc' | 'desc';
  onSortByChange: (sortBy: 'priority' | 'title' | 'created_at') => void;
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
}

export default function SortControls({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: SortControlsProps) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
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
          Sort by
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as 'priority' | 'title' | 'created_at')}
          style={{ width: '100%', padding: '8px 12px' }}
        >
          <option value="created_at">Creation Time</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
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
          Sort Order
        </label>
        <select
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
          style={{ width: '100%', padding: '8px 12px' }}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
}
