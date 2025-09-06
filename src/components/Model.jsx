import React, { useRef } from "react";
import { Fragment } from "../shaders/Fragment";
import { Vertex } from "../shaders/Vertex";
import { useFrame, useLoader } from "@react-three/fiber";
import { DoubleSide, TextureLoader } from "three";
import { useAspect } from "@react-three/drei";

const Model = () => {
  const mesh = useRef();
  const texture = useLoader(TextureLoader, "/RippleImage.jpg");

  const scale = useAspect(texture.image.width, texture.image.height, 1);
  const uniforms = useRef({
    u_texture: { value: texture },
    u_time: { value: 0 },
  });
  useFrame((state) => {
    const { clock } = state;
    mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
  });
  return (
    <group>
      <mesh ref={mesh} scale={scale}>
        <planeGeometry args={[1, 1, 1, 50]} />
        <shaderMaterial
          vertexShader={Vertex}
          fragmentShader={Fragment}
          uniforms={uniforms.current}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default Model;
