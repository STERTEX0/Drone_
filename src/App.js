import React from 'react';
import RssiLevel from './component/RssiLevel';
import ServoControl from './component/ServoControl';
import { WebSocketProvider } from './context/WebSocketContext';
import Log from './component/Log';
// import VdoFeed from './component/VdoFeed';
import './App.css';
import Battery from './component/Battery';

function App() {
  return (
    <WebSocketProvider>
      <div className="app-container">
        
        <div className="main-content">
          <ServoControl />
          <RssiLevel />
          <Log />
          <Battery />
          {/* <VdoFeed /> */}
        </div>
      </div>
    </WebSocketProvider>
  );
}

export default App;
