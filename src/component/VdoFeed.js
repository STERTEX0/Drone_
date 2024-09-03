import React, { useEffect, useRef, useState } from "react";
import JSMpeg from "@cycjimmy/jsmpeg-player";
import ServoControl from "./ServoControl";
import "./VdoFeed.css";

const VdoFeed = () => {
  const canvasRef = useRef(null);
  const playerRef = useRef(null);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    // เริ่มสตรีมวิดีโอเมื่อคอมโพเนนต์ถูกติดตั้ง
    playerRef.current = new JSMpeg.Player('ws://10.8.8.41:9999', {
      canvas: canvasRef.current,
    });

    return () => {
      // หยุดสตรีมวิดีโอเมื่อคอมโพเนนต์ถูกลบ
      if (playerRef.current) {
        playerRef.current.stop();
      }
    };
  }, []);

  const refreshVideo = () => {
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.play(); // เริ่มเล่นใหม่ทันที
    }
    setBlink(true);
    setTimeout(() => setBlink(false), 500); // ลบคลาส blink หลังจาก 0.5 วินาที
  };

  return (
    <div className={`full-screen-video-container ${blink ? 'blink' : ''}`}>
      <canvas ref={canvasRef} id="canvas"></canvas>
      <ServoControl onRefresh={refreshVideo} />
    </div>
  );
};

export default VdoFeed;
