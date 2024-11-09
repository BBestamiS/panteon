import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableColumnProps {
  column: { id: string; title: string };
}

const SortableColumn: React.FC<SortableColumnProps> = ({ column }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: column.id });

  const style: React.CSSProperties = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition: transition || 'transform 250ms ease',
    padding: '10px',
    border: '1px solid #555',
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center' as React.CSSProperties['textAlign'], 
    cursor: 'grab',
  };

  return (
    <th ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {column.title}
    </th>
  );
};

export default SortableColumn;
