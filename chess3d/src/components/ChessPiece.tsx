import React, {useEffect, useState} from 'react';
import {MeshProps} from '@react-three/fiber';
import {loadModel} from '../utils/loadModel.ts';
import * as THREE from 'three';
import {Box3, Vector3} from 'three';
import {BASE_PATH} from '../config.js';
import {animated, useSpring} from '@react-spring/three';

interface ChessPieceProps extends MeshProps {
    position: [number, number, number];
    type: 'pawn' | 'bishop' | 'king' | 'knight' | 'queen' | 'rook';
    color: 'white' | 'black';
    onClick: () => void;
    isSelected: boolean;
    isAnimating: boolean;
    targetPosition: [number, number, number] | null;
}

const pieceModels = {
    pawn: `${BASE_PATH}/assets/pawn.stl`,
    bishop: `${BASE_PATH}/assets/bishop.stl`,
    king: `${BASE_PATH}/assets/king.stl`,
    knight: `${BASE_PATH}/assets/knight.stl`,
    queen: `${BASE_PATH}/assets/queen.stl`,
    rook: `${BASE_PATH}/assets/rook.stl`,
};

const PAWN_SCALE_FACTOR = 0.65;

const ChessPiece: React.FC<ChessPieceProps> = ({
                                                   position,
                                                   type,
                                                   color,
                                                   onClick,
                                                   isSelected,
                                                   isAnimating,
                                                   targetPosition
                                               }) => {
    const [model, setModel] = useState(null);
    const [error, setError] = useState(null);
    console.log(`ChessPiece render - Type: ${type}, Color: ${color}, Position: ${position}, IsSelected: ${isSelected}, IsAnimating: ${isAnimating}, TargetPosition: ${targetPosition}`);

    const {position: animatedPosition} = useSpring({
        position: isAnimating && targetPosition ? targetPosition : position,
        config: {mass: 1, tension: 180, friction: 12}
    });

    console.log(`Animated position: ${JSON.stringify(animatedPosition)}`);

    if (!type) {
        console.error('ChessPiece Error: Component requires a type prop');
        return null;
    }

    useEffect(() => {
        console.log(`ChessPiece useEffect - Loading model for type: ${type}`);
        loadModel(pieceModels[type])
            .then((model) => {
                console.log(`ChessPiece: Model loaded successfully for type: ${type}`);
                
                // Measure the bounding box of the model
                const boundingBox = new Box3().setFromObject(model);
                const size = new Vector3();
                boundingBox.getSize(size);
                const maxDimension = Math.max(size.x, size.y, size.z);
                console.log(`ChessPiece: Bounding box size: (${size.x.toFixed(2)}, ${size.y.toFixed(2)}, ${size.z.toFixed(2)})`);
                console.log(`ChessPiece: Max dimension: ${maxDimension.toFixed(2)}`);

                model.rotation.x = -Math.PI / 2; // Rotate the model to stand upright
                console.log(`ChessPiece: Model rotated to stand upright`);
                boundingBox.setFromObject(model);

                const scale = 1 / maxDimension; // Scale to fit within a unit cube
                // Apply additional scaling for pawns
                const finalScale = type === 'pawn' ? scale * PAWN_SCALE_FACTOR : scale;
                model.scale.set(finalScale, finalScale, finalScale); // Scale down the model adaptively
                console.log(`ChessPiece: Model scaled to: ${finalScale.toFixed(4)}`);
                boundingBox.setFromObject(model);

                const center = new Vector3();
                boundingBox.getCenter(center);
                model.position.set(-center.x, -0.4, -center.z); // Adjust position to sit on the board
                console.log(`ChessPiece: Model centered at: (${center.x.toFixed(2)}, ${center.y.toFixed(2)}, ${center.z.toFixed(2)})`);
                boundingBox.setFromObject(model);

                // Apply color material
                const material = new THREE.MeshPhysicalMaterial({
                    color: isSelected ? '#ffd700' : color === 'white' ? '#e6d0b1' : '#b48764',
                    metalness: 0.5,
                    roughness: 0.5,
                    clearcoat: 1.0,
                    envMapIntensity: 0.8,
                    emissive: isSelected ? '#ffd700' : '#000000',
                    emissiveIntensity: isSelected ? 0.2 : 0
                });
                console.log(`ChessPiece: Material created - Color: ${material.color.getHexString()}, Metalness: ${material.metalness}, Roughness: ${material.roughness}`);

                model.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = material;
                        console.log(`ChessPiece: Applied material to child mesh: ${child.name || 'unnamed'}`);
                    }
                });

                setModel(model);
                console.log(`ChessPiece: Model set successfully for type: ${type}`);
            })
            .catch((err) => {
                console.error(`ChessPiece Error: Failed to load model for type: ${type}`, err);
                setError(err);
            });
    }, [type, color, isSelected]);

    if (error) {
        console.warn(`ChessPiece: Rendering fallback for type: ${type} due to error`);
        return <mesh position={position} onClick={onClick}>
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color="red"/>
        </mesh>;
    }

    if (!model) {
        console.log(`ChessPiece: Rendering placeholder for type: ${type}`);
        return <mesh position={position} onClick={onClick}>
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color="gray"/>
        </mesh>;
    }

    console.log(`ChessPiece: Rendering model for type: ${type}`);
    return (
        <animated.mesh position={animatedPosition} onClick={onClick}>
            <primitive object={model}/>
        </animated.mesh>
    );
};

export default ChessPiece;