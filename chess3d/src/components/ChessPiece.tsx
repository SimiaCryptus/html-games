import React, {useEffect, useState} from 'react';
import {MeshProps} from '@react-three/fiber';
import {loadModel} from '../utils/loadModel.ts';
import * as THREE from 'three';
import {Box3, Vector3} from 'three';
import {BASE_PATH} from '../config';

interface ChessPieceProps extends MeshProps {
    position: [number, number, number];
    type: 'pawn' | 'bishop' | 'king' | 'knight' | 'queen' | 'rook';
    color: 'white' | 'black';
    onClick: () => void;
    isSelected: boolean;
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

const ChessPiece: React.FC<ChessPieceProps> = ({position, type, color, onClick, isSelected}) => {
    const [model, setModel] = useState(null);
    const [error, setError] = useState(null);

    if (!type) {
        console.error('ChessPiece component requires a type prop');
        return null;
    }

    useEffect(() => {
        console.log(`Loading chess piece of type: ${type}`);
        loadModel(pieceModels[type])
            .then((model) => {
                console.log(`Chess piece of type: ${type} loaded successfully`);
                console.log('Setting model:', model);
                // Measure the bounding box of the model
                const boundingBox = new Box3().setFromObject(model);
                const size = new Vector3();
                boundingBox.getSize(size);
                const maxDimension = Math.max(size.x, size.y, size.z);
                console.log(`Bounding box size: ${size.x}, ${size.y}, ${size.z}`);
                console.log(`Max dimension: ${maxDimension}`);

                model.rotation.x = -Math.PI / 2; // Rotate the model to stand upright
                boundingBox.setFromObject(model);

                const scale = 1 / maxDimension; // Scale to fit within a unit cube
                // Apply additional scaling for pawns
                const finalScale = type === 'pawn' ? scale * PAWN_SCALE_FACTOR : scale;
                model.scale.set(finalScale, finalScale, finalScale); // Scale down the model adaptively
                console.log(`Model scaled to: ${scale}`);
                boundingBox.setFromObject(model);

                const center = new Vector3();
                boundingBox.getCenter(center);
                model.position.set(-center.x, -0.4, -center.z); // Adjust position to sit on the board
                console.log(`Model centered at: ${center.x}, ${center.y}, ${center.z}`);
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
                model.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = material;
                        console.log(`Applied material to child mesh: ${child.name}`);
                    }
                });

                setModel(model);
                console.log(`Model set successfully for type: ${type}`);
            })
            .catch((err) => {
                console.error(`Error loading chess piece of type: ${type}`, err);
                setError(err);
            });
    }, [type, color, isSelected]);

    // ... rest of the component remains unchanged
    if (error) {
        console.warn(`Rendering fallback for chess piece of type: ${type} due to error`);
        return <mesh position={position} onClick={onClick}>
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color="red"/>
        </mesh>;
    }

    if (!model) {
        console.log(`Rendering placeholder for chess piece of type: ${type}`);
        return <mesh position={position} onClick={onClick}>
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color="gray"/>
        </mesh>;
    }

    console.log(`Rendering chess piece of type: ${type}`);
    return (
        <mesh position={position} onClick={onClick}>
            <primitive object={model}/>
        </mesh>
    );
};

export default ChessPiece;