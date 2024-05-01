import React, { useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { styled } from '@mui/system';
import CanvasItemComponent from './CanvasItemComponent';
import { Button } from '@mui/material';

interface CanvasItem {
  id: string;
  type: string;
  name: string;
  left: number;
  top: number;
}

const StyledCanvas = styled('div')({
  flex: 1,
  minHeight: '500px',
  position: 'relative',
  border: '1px solid grey',
  overflow: 'auto',
  marginBottom: '20px'
});

const Canvas: React.FC<{ devMode: boolean, storageMode: 'local' | 'api' }> = ({ devMode, storageMode }) => {
  const [components, setComponents] = useState<CanvasItem[]>([]);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (storageMode === 'local') {
      const savedComponents = localStorage.getItem('canvasComponents');
      if (savedComponents) {
        setComponents(JSON.parse(savedComponents));
      }
    }
  }, [storageMode]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (storageMode === 'local') {
        localStorage.setItem('canvasComponents', JSON.stringify(components));
      } else if (storageMode === 'api') {
        // API logic here
      }
    }
  }, [components, storageMode]);

  const [, drop] = useDrop({
    accept: ['button', 'table'],
    drop: (item: CanvasItem, monitor) => {
      if (!monitor.didDrop()) {
        const delta = monitor.getDifferenceFromInitialOffset();
        if (delta) {
          const left = Math.round(item.left + delta.x);
          const top = Math.round(item.top + delta.y);
          updateOrAddItem(item, left, top);
        }
      }
    },
  });

  const handleSaveToAPI = () => {
    fetch('your-api-endpoint.com/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(components),
    });
  };

  const generateCode = () => {
    const code = components.map(comp => `<div style={{ position: 'absolute', left: ${comp.left}px, top: ${comp.top}px }}>${comp.type}</div>`).join('\n');
    console.log(code);
  };

  const updateOrAddItem = (item: CanvasItem, left: number, top: number) => {
    setComponents(prev => {
      const existingIndex = prev.findIndex(comp => comp.id === item.id);
      if (existingIndex >= 0) {
        const newItems = [...prev];
        newItems[existingIndex] = { ...newItems[existingIndex], left, top };
        return newItems;
      } else {
        return [...prev, { ...item, id: crypto.randomUUID(), left, top }];
      }
    });
  };

  const moveItem = (id: string, left: number, top: number) => {
    setComponents(prev => prev.map(item => item.id === id ? { ...item, left, top } : item));
  };

  const deleteItem = (id: string) => {
    setComponents(prev => prev.filter(item => item.id !== id));
  };

  const updateItem = (id: string, updates: any) => {
    setComponents(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  return (
    <>
      <StyledCanvas ref={drop}>
        {components.map(comp => (
          <CanvasItemComponent
            key={comp.id}
            item={comp}
            moveItem={moveItem}
            deleteItem={deleteItem}
            updateItem={updateItem}
          />
        ))}
      </StyledCanvas>
      {devMode && (
        <>
          <Button variant="contained" color="primary" onClick={handleSaveToAPI}>
            Save to API
          </Button>
          <Button variant="contained" color="secondary" onClick={generateCode} style={{ marginLeft: '10px' }}>
            Generate Code
          </Button>
        </>
      )}
    </>
  );
};

export default Canvas;
