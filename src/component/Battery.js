import React, { useEffect, useState } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import "./Battery.css";

const Battery = () => {
  const { ws } = useWebSocket();
  const [batteryPercentage, setBatteryPercentage] = useState(100); // Default to 100%
  const [batteryCells, setBatteryCells] = useState([]); // To hold battery cell data
  const [hoveredCell, setHoveredCell] = useState(null); // Track which cell is hovered
  const [totalVoltage, setTotalVoltage] = useState(0); // New state for total voltage
  const [hasLowPercentageCell, setHasLowPercentageCell] = useState(false); // Track if there's a low percentage cell

  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const message = event.data.replace(/^Message: /, "").replace(/'/g, '"');
        if (message.startsWith("{") && message.endsWith("}")) {
          const data = JSON.parse(message);

          // Handle battery data
          if (data.total_voltage_percentage !== null) {
            setBatteryPercentage(data.total_voltage_percentage);
            setBatteryCells(data.battery || []); // Update battery cells data
            setTotalVoltage(data.total_voltage || 0); // Update total voltage

            // Check for percentage deviations in cells
            const lowPercentageCells = data.battery
              .filter(cell => cell.percentage < 5)
              .map(cell => `Cell ${cell.cell} is below 5%`);

            setHasLowPercentageCell(lowPercentageCells.length > 0); // Update the state based on low percentage cells
          }
        }
      } catch (error) {
        console.error("Invalid message format:", event.data, error);
      }
    };

    if (ws) {
      ws.addEventListener("message", handleMessage);
      return () => {
        ws.removeEventListener("message", handleMessage);
      };
    }
  }, [ws]);

  return (
    <div className="battery-container">
      <span className="total-voltage">
        {totalVoltage}V
      </span>
      <div
        className={`battery-icon ${hasLowPercentageCell ? "battery-icon-warning" : ""}`}
        onMouseEnter={() => setHoveredCell(true)}
        onMouseLeave={() => setHoveredCell(false)}
      >
        <div
          className="battery-level"
          style={{ width: `${batteryPercentage}%` }}
        ></div>
        {hoveredCell && (
          <div className="battery-tooltip">
            {batteryCells.map(cell => (
              <div key={cell.cell} className="battery-tooltip-cell">
                <div>Cell {cell.cell}:
                Voltage: {cell.voltage}V
                Percentage: {cell.percentage}%</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <span className="battery-percentage">
        {Math.floor(batteryPercentage)}%
      </span>
    </div>
  );
};

export default Battery;
