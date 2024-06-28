import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';
import {Mesh} from 'three';

export const loadModel = (path: string) => {
    console.log(`Loading model from path: ${path}`);
    return new Promise((resolve, reject) => {
        let loader;
        if (path.endsWith('.stl')) {
            loader = new STLLoader();
        } else {
            loader = new GLTFLoader();
        }

        loader.load(
            path,
            (gltf) => {
                console.log(`Model loaded successfully from path: ${path}`);
                if (path.endsWith('.stl')) {
                    const material = new THREE.MeshStandardMaterial({color: 'white'});
                    const mesh = new Mesh(gltf, material);
                    resolve(mesh);
                } else {
                    console.log('GLTF content:', gltf);
                    resolve(gltf.scene);
                }
            },
            undefined,
            (error) => {
                console.error(`Error loading model from path: ${path}`, error);
                reject(error);
            }
        );
    });
};