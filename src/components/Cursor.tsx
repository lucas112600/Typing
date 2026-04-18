"use client";

import { useEffect, useState } from "react";
import { useConfig } from "@/context/ConfigContext";

export default function Cursor() {
  const { cursorStyle } = useConfig();
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  if (position.x === -100) return null;

  const renderStyle = () => {
    if (cursorStyle === "BLOCK") {
      return (
        <div style={{
          position: "absolute",
          left: position.x - 5,
          top: position.y - 10,
          width: "10px",
          height: "20px",
          backgroundColor: "#fff",
          transform: clicked ? "scale(0.8)" : "scale(1)",
          transition: "transform 0.1s steps(1, end)"
        }} />
      );
    }
    if (cursorStyle === "LINE") {
       return (
         <div style={{
           position: "absolute",
           left: position.x,
           top: position.y - 10,
           width: "2px",
           height: "20px",
           backgroundColor: "#fff",
           transform: clicked ? "scale(0.8)" : "scale(1)",
           transition: "transform 0.1s steps(1, end)"
         }} />
       );
    }
    // CROSSHAIR
    return (
      <>
        <div style={{
          position: "absolute",
          left: position.x - 10,
          top: position.y,
          width: "20px",
          height: "2px",
          backgroundColor: "#fff",
          transform: clicked ? "scale(0.8)" : "scale(1)",
          transition: "transform 0.1s steps(1, end)"
        }} />
        <div style={{
          position: "absolute",
          left: position.x,
          top: position.y - 10,
          width: "2px",
          height: "20px",
          backgroundColor: "#fff",
          transform: clicked ? "scale(0.8)" : "scale(1)",
          transition: "transform 0.1s steps(1, end)"
        }} />
      </>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "difference"
      }}
    >
      {renderStyle()}
    </div>
  );
}
