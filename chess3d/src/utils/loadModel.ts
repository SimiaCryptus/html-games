import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';
import {BufferGeometry, Mesh} from 'three';

const logModelDetails = (model: THREE.Object3D | BufferGeometry) => {
    console.log('[logModelDetails] Starting to log model details');
    if (model instanceof THREE.Object3D) {
        console.log(`[logModelDetails] Object3D details:
 Type: Object3D
 Children: ${model.children.length}
 Meshes: ${model.children.filter(child => child instanceof THREE.Mesh).length}
 Materials: ${new Set(model.children.filter(child => child instanceof THREE.Mesh).map(mesh => (mesh as THREE.Mesh).material)).size}`);
        model.children.forEach((child, index) => {
            console.log(`[logModelDetails] Child ${index}: ${child.type}`);
        });
    } else if (model instanceof BufferGeometry) {
        console.log(`[logModelDetails] BufferGeometry details:
 Type: BufferGeometry
 Vertices: ${model.attributes.position.count}
        - Type: BufferGeometry
        - Vertices: ${model.attributes.position.count}
        - Faces: ${model.index ? model.index.count / 3 : 'N/A'}
        - Attributes: ${Object.keys(model.attributes).join(', ')}`);
    }
    console.log('[logModelDetails] Finished logging model details');
};

export const loadModel = (path: string) => {
    console.log(`[loadModel] Starting to load model from path: ${path}`);
    return new Promise((resolve, reject) => {
        let loader;
        console.log(`[loadModel] Determining loader type for file: ${path}`);
        if (path.endsWith('.stl')) {
            console.log('[loadModel] Detected STL file, using STLLoader');
            loader = new STLLoader();
        } else {
            console.log('[loadModel] Using GLTFLoader for non-STL file (assumed GLTF/GLB)');
            loader = new GLTFLoader();
        }

        console.log(`[loadModel] Initiating model loading process for: ${path}`);
        loader.load(
            path,
            (gltf) => {
                console.log(`[loadModel] Model loaded successfully from path: ${path}`);
                if (path.endsWith('.stl')) {
                    console.log('[loadModel] Processing STL model');
                    console.log('[loadModel] Creating MeshStandardMaterial for STL');
                    const material = new THREE.MeshStandardMaterial({color: 0xcccccc});
                    console.log('[loadModel] Creating Mesh from BufferGeometry and Material');
                    const mesh = new Mesh(gltf as BufferGeometry, material);
                    logModelDetails(gltf as BufferGeometry);
                    console.log('[loadModel] Resolving with created Mesh');
                    resolve(mesh);
                } else {
                    console.log('[loadModel] Processing GLTF model');
                    console.log('[loadModel] GLTF content summary:');
                    console.log(`- Animations: ${gltf.animations.length}`);
                    console.log(`- Cameras: ${gltf.cameras.length}`);
                    console.log(`- Asset Generator: ${gltf.asset?.generator}`);
                    console.log(`- Asset Version: ${gltf.asset?.version}`);
                    logModelDetails(gltf.scene);
                    console.log('[loadModel] Resolving with GLTF scene');
                    resolve(gltf.scene);
                }
            },
            (progress) => {
                const percentComplete = (progress.loaded / progress.total * 100).toFixed(2);
                console.log(`[loadModel] Loading progress: ${percentComplete}% (${progress.loaded} / ${progress.total} bytes)`);
            },
            (error) => {
                console.error(`[loadModel] Error loading model from path: ${path}`, error);
                console.error('[loadModel] Error details:', error.message);
                reject(error);
            }
        );
        console.log(`[loadModel] Load request initiated for: ${path}`);
    });
};