import React, { useRef, useEffect } from "react";
import { Fragment } from "../shaders/Fragment";
import { Vertex } from "../shaders/Vertex";
import { useFrame, useLoader } from "@react-three/fiber";
import { DoubleSide, TextureLoader } from "three";
import { useAspect } from "@react-three/drei";
import { useControls } from "leva";

const Model = () => {
  const mesh = useRef();
  const texture = useLoader(TextureLoader, "/RippleImage.jpg");
  const { offset, redChannel, blueChannel } = useControls({
    offset: { value: 0.01, min: 0, max: 0.3, step: 0.01 },
    redChannel: { value: true },
    blueChannel: { value: true },
  });

  const scale = useAspect(texture.image.width, texture.image.height, 1);

  const uniforms = useRef({
    u_texture: { value: texture },
    u_time: { value: 0 },
    offset: { value: offset },
    redChannel: { value: redChannel ? 1 : -1 },
    blueChannel: { value: blueChannel ? 1 : -1 },
  });

  useEffect(() => {
    uniforms.current.offset.value = offset;
    uniforms.current.redChannel.value = redChannel ? 1 : -1;
    uniforms.current.blueChannel.value = blueChannel ? 1 : -1;
  }, [offset, redChannel, blueChannel]);

  useFrame((state) => {
    const { clock } = state;
    uniforms.current.u_time.value = clock.getElapsedTime();
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
