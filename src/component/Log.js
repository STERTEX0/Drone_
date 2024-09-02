import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import './Log.css';

const formatMessage = (message) => {
  try {
    const jsonString = message
      .replace(/^Message: /, '') // Remove the "Message: " prefix
      .replace(/'/g, '"'); // Replace single quotes with double quotes

    const jsonObject = JSON.parse(jsonString);

    for (const key in jsonObject) {
      if (jsonObject[key] === null) {
        return ''; // Return an empty string if any value is null
      }
    }

    return jsonObject;
  } catch (error) {
    return null; // Return null to indicate invalid JSON message
  }
};

const Log = ({ isVisible }) => {
  const { ws } = useWebSocket();
  const [message, setMessage] = useState(null); // Track single message

  useEffect(() => {
    const handleMessage = (event) => {
      const newMessage = formatMessage(event.data);

      if (newMessage) {
        setMessage(newMessage); // Update the single message
      }
    };

    if (ws) {
      ws.addEventListener('message', handleMessage);
      return () => {
        ws.removeEventListener('message', handleMessage);
      };
    }
  }, [ws]);

  return (
    <div className={`log-container ${isVisible ? 'visible' : 'hidden'}`}>
      {message && (
        <div className="log-card">
          <div><b>mcc:</b> {message.mcc}</div>
          <div><b>mnc:</b> {message.mnc}</div>
          <div><b>cellID:</b> {message.cellID}</div>
          <div><b>pcid:</b> {message.pcid}</div>
          <div><b>earfcn:</b> {message.earfcn}</div>
          <div><b>freq_band_ind:</b> {message.freq_band_ind}</div>
          <div><b>ul_bandwidth:</b> {message.ul_bandwidth}</div>
          <div><b>dl_bandwidth:</b> {message.dl_bandwidth}</div>
          <div><b>tac:</b> {message.tac}</div>
          <div><b>rsrp:</b> {message.rsrp}</div>
          <div><b>rsrq:</b> {message.rsrq}</div>
          <div><b>rssi:</b> {message.rssi}</div>
          <div><b>sinr:</b> {message.sinr}</div>
          <div><b>latitude:</b> {message.latitude}</div>
          <div><b>longitude:</b> {message.longitude}</div>
          <div><b>time:</b> {message.time}</div> 
          <div><b>battery:</b> {message.total_voltage_percentage}</div> 
        </div>
      )}
    </div>
  );
};

export default Log;
