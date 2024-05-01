import React from 'react';
import { useDrag } from 'react-dnd';

interface DraggableItemProps {
  type: string;
  name: string;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ type, name }) => {
  const [, drag] = useDrag(() => ({
    type: type,
    item: { type, name, left: 100, top: 100 },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ padding: '8px', border: '1px dashed navy', marginBottom: '5px', cursor: 'pointer' }}>
      {name}
    </div>
  );
};

export default DraggableItem;
