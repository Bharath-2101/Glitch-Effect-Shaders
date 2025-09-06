import { useEffect, useState } from "react";

export function useMouse() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const updateMousePositions = (e) => {
    setMouse({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePositions);
    return () => window.removeEventListener("mousemove", updateMousePositions);
  }, []);

  return mouse;
}
