import React, { useEffect, useState } from 'react';
import Log from './Log'; // Import the Log component
import { useWebSocket } from '../context/WebSocketContext';
import './RssiLevel.css';

const RssiLevel = () => {
  const { ws } = useWebSocket(); // Use WebSocket from context
  const [rssi, setRssi] = useState(null);
  const [isLogVisible, setIsLogVisible] = useState(false); // Track hover state

  useEffect(() => {
    if (!ws) return; // Return if WebSocket is not available

    const handleMessage = (event) => {
      try {
        // Remove any unwanted prefixes and replace single quotes with double quotes
        const message = event.data.replace(/^Message: /, '').replace(/'/g, '"');

        // Check if the message looks like JSON by trying to parse it
        const isJSON = message.startsWith('{') && message.endsWith('}');
        if (isJSON) {
          const data = JSON.parse(message);
          
          // Check if `rssi` is a valid number
          if (typeof data.rssi === 'number') {
            setRssi(data.rssi); // Set RSSI value from message data
          }
        }
      } catch (error) {
        // Log and ignore messages that cannot be parsed as JSON
        console.error('Error parsing WebSocket message:', event.data, error);
      }
    };

    ws.addEventListener('message', handleMessage);

    // Cleanup WebSocket listener on component unmount
    return () => {
      ws.removeEventListener('message', handleMessage);
    };
  }, [ws]);

  const getRssiBars = () => {
    if (rssi >= -60) return 5; // Very strong signal
    if (rssi >= -75) return 4; // Strong signal
    if (rssi >= -85) return 3; // Good signal
    if (rssi >= -95) return 2; // Weak signal
    if (rssi > -94) return 1; // Very weak signal
    return 0; // No signal
  };

  const bars = getRssiBars();

  return (
    <div
      className="rssi-container"
      onMouseEnter={() => setIsLogVisible(true)}
      onMouseLeave={() => setIsLogVisible(false)}
    >
      <div className="rssi-bars">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`bar ${i < bars ? 'filled' : ''}`} />
        ))}
      </div>
      {/* Pass visibility state to Log component */}
      <Log isVisible={isLogVisible} />
    </div>
  );
};

export default RssiLevel;
