import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IntegrationProvider } from './IntegrationManager';
import Toolbox from './Toolbox';
import Canvas from './Canvas';

const App: React.FC = () => {
  const devMode = new URLSearchParams(window.location.search).get('devmode') === 'true';

  return (
    <IntegrationProvider>
      <DndProvider backend={HTML5Backend}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {devMode && <Toolbox />}
          <Canvas devMode={devMode} storageMode={'local'} />
        </div>
      </DndProvider>
    </IntegrationProvider>
  );
};

export default App;
