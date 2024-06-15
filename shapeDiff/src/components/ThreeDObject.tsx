import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeDObjectProps {
    shape: number[][];
}

const colors = ['orange', 'blue', 'green', 'red', 'purple'];

const TumblingMesh: React.FC<{ position: number[]; color: string }> = ({ position, color }) => {
    return (
        <mesh position={new THREE.Vector3(...position)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} />
            <lineSegments>
                <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, 1, 1)]} />
                <lineBasicMaterial attach="material" color="black" />
            </lineSegments>
        </mesh>
    );
};

const RotatingGroup: React.FC<{ positions: number[][]; color: string }> = ({ positions, color }) => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.x += 0.01;
            groupRef.current.rotation.y += 0.02;
        }
    });
    return (
        <group ref={groupRef}>
            {positions.map((pos, i) => (
                <TumblingMesh key={i} position={pos} color={color} />
            ))}
        </group>
    );
};

export const ThreeDObject: React.FC<ThreeDObjectProps> = ({ shape }) => {
    const backgroundColors = ['#FFDDC1', '#C1FFD7', '#D1C1FF', '#FFC1E3', '#C1E3FF'];
    return (
        <Canvas className="main-canvas"
                style={{ backgroundColor: backgroundColors[Math.floor(Math.random() * backgroundColors.length)] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <RotatingGroup positions={shape} color={colors[0]} />
            <OrbitControls enableRotate enablePan={false} maxPolarAngle={Math.PI} minPolarAngle={0} />
        </Canvas>
    );
};

export default ThreeDObject;
