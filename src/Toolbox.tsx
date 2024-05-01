import React from 'react';
import DraggableItem from './DraggableItem';

const Toolbox: React.FC = () => {
  return (
    <div style={{ width: '250px', padding: '10px', border: '1px solid black', background: 'lightgray' }}>
      <h2>Toolbox</h2>
      <DraggableItem type="button" name="Button" />
      <DraggableItem type="table" name="Table" />
    </div>
  );
};

export default Toolbox;
