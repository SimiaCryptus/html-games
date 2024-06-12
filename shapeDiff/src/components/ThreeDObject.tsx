import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
 import * as THREE from 'three';


interface ThreeDObjectProps {
  shape: number[][];
}

export const ThreeDObject: React.FC<ThreeDObjectProps> = ({ shape }) => {

  return (
    <Canvas style={{ height: '400px' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {shape.map((pos, index) => (
       <mesh key={index} position={new THREE.Vector3(...pos)}>
         <boxGeometry args={[1, 1, 1]} />
         <meshStandardMaterial color="orange" />
       </mesh>
     ))}
      <OrbitControls autoRotate />
    </Canvas>
  );
};

export default ThreeDObject;