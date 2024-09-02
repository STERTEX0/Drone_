import React, { useRef, useEffect } from "react";
import Hls from "hls.js";
import { useWebSocket } from "../context/WebSocketContext";
import "./VdoFeed.css";

const VdoFeed = () => {
  const videoRef = useRef(null);
  const { ws } = useWebSocket();

  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls();
      hls.loadSource("http://1.4.213.19:1929/live/TV73R-M7-64_872-IPT.stream_720p/playlist.m3u8");
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play().catch(error => {
          console.error('Error playing video:', error);
        });
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = "http://1.4.213.19:1929/live/TV73R-M7-64_872-IPT.stream_720p/playlist.m3u8";
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        // Handle WebSocket messages if needed
        // console.log('WebSocket message received:', event.data);
        // For example, you might use this to control the video stream or handle other data
      };

      return () => {
        ws.onmessage = null;
      };
    }
  }, [ws]);

  return (
    <div className="full-screen-video-container">
      <video className="video-feed" ref={videoRef} autoPlay muted controls></video>
    </div>
  );
};

export default VdoFeed;
