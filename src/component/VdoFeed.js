import React, { useEffect, useRef } from "react";
import JSMpeg from "@cycjimmy/jsmpeg-player";
import "./VdoFeed.css"; // Ensure you import the CSS file

const VdoFeed = () => {
  const canvasRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Start the video stream when the component mounts
    playerRef.current = new JSMpeg.Player('ws://10.8.8.41:9999', {
      canvas: canvasRef.current,
    });

    return () => {
      // Stop the video stream when the component unmounts
      if (playerRef.current) {
        playerRef.current.stop();
      }
    };
  }, []);

  // Method to refresh (stop and start) the video stream
  const refreshVideo = () => {
    if (playerRef.current) {
      playerRef.current.stop(); // Stop the current stream
      playerRef.current.play(); // Immediately start it again
    }
  };

  return (
    <div className="full-screen-video-container">
      <canvas ref={canvasRef} id="canvas"></canvas>
    
      <div className="controls">
        <button onClick={refreshVideo}>Refresh</button>
      </div>
    </div>
  );
};

export default VdoFeed;
