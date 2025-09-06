import { Canvas } from "@react-three/fiber";
import React from "react";
import Model from "./components/Model";
import { OrbitControls } from "@react-three/drei";

const App = () => {
  return (
    <div id="CanvasContainer">
      <Canvas style={{ background: "black" }}>
        <Model />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default App;
