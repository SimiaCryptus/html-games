import React from 'react';
 import { Canvas } from '@react-three/fiber';
 import { OrbitControls } from '@react-three/drei';
 import * as THREE from 'three';

interface ChoicesListProps {
  choices: string[];
  shapes: number[][][];
  onSelect: (choice: string) => void;
}


export const ChoicesList: React.FC<ChoicesListProps> = ({ choices, shapes, onSelect }) => {

  return (
    <div className="choices-container">
     {shapes.map((positions, index) => (
       <div key={index} className="choice-item" onClick={() => onSelect(choices[index])}>
         <Canvas style={{ height: '100px', width: '100px' }}>
           <ambientLight intensity={0.5} />
           <pointLight position={[10, 10, 10]} />
           {positions.map((pos, i) => (
             <mesh key={i} position={new THREE.Vector3(...pos)}>
               <boxGeometry args={[0.5, 0.5, 0.5]} />
               <meshStandardMaterial color="orange" />
             </mesh>
           ))}
          <OrbitControls enableZoom={false} autoRotate />
         </Canvas>
       </div>
      ))}
    </div>
  );
};

export default ChoicesList;