// Get the canvas element and set up the WebGL context
const canvas = document.getElementById('particleCanvas');
import { initWebGLContext, createProgram } from './webgl-utils.js';
const mat4 = glMatrix.mat4;
console.log('Initializing WebGL context...');
const gl = initWebGLContext(canvas);

// Check if WebGL is available
if (!gl) {
    alert('WebGL is not supported by your browser.');
    console.error('WebGL is not supported by your browser.');
}

// Vertex shader program
const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;

    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
`;

// Fragment shader program
const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
        gl_FragColor = vColor;
    }
`;

// Function to initialize shaders
console.log('Creating shader program...');
const shaderProgram = createProgram(gl, vsSource, fsSource);
if (!shaderProgram) {
    console.error('Shader program failed to initialize.');
    return; // Stop further execution if shader program is not valid
}
if (!shaderProgram) {
    console.error('Shader program failed to initialize.');
}

// Function to create a shader
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

const programInfo = {
    program: shaderProgram,
    attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
};

console.log('Program Info:', programInfo);
if (programInfo.attribLocations.vertexPosition === -1 || programInfo.attribLocations.vertexColor === -1) {
    console.error('Shader attribute locations are invalid.');
    return; // Stop further execution if attribute locations are not valid
}
if (!programInfo.uniformLocations.projectionMatrix || !programInfo.uniformLocations.modelViewMatrix) {
    console.error('Shader uniform locations are invalid.');
    return; // Stop further execution if uniform locations are not valid
}

console.log('Program Info:', programInfo);
// Function to draw the scene
function drawScene(gl, programInfo) {
    console.log('Drawing scene...');
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it
    if (!gl) {
        console.error('WebGL context is lost or not initialized.');
        return;
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create perspective matrix
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    // Set the drawing position to the "identity" point, which is the center of the scene
    const modelViewMatrix = mat4.create();

    // Move the drawing position a bit to where we want to start drawing the square
    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

    const positions = [
        1.0,  1.0,  0.0,
       -1.0,  1.0,  0.0,
        1.0, -1.0,  0.0,
       -1.0, -1.0,  0.0,
    ];
    const colors = [
        1.0, 0.0, 0.0, 1.0,  // Red
        0.0, 1.0, 0.0, 1.0,  // Green
        0.0, 0.0, 1.0, 1.0,  // Blue
        1.0, 1.0, 0.0, 1.0,  // Yellow
    ];
    const buffers = { position: gl.createBuffer() }; // Create a buffer for the positions
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position); // Bind the position buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    // Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute
    {
        if (programInfo.attribLocations.vertexPosition < 0) {
            console.error('Vertex position attribute location is not valid.');
            return;
        }
        const numComponents = 3;  // pull out 3 values per iteration
        const type = gl.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = false;  // don't normalize
        const stride = 0;         // how many bytes to get from one set of values to the next
        const offset = 0;         // how many bytes inside the buffer to start from
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    // Create a buffer for the colors and bind it
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // Tell WebGL how to pull out the colors from the color buffer into the vertexColor attribute
    {
        if (programInfo.attribLocations.vertexColor < 0) {
            console.error('Vertex color attribute location is not valid.');
            return;
        }
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    }

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

    {
        const offset = 0;
        const vertexCount = 4;
        console.log('Drawing arrays...');
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}

// Main animation loop
function mainLoop() {
    console.log('Running main loop...');
    drawScene(gl, programInfo);
    requestAnimationFrame(mainLoop);
}

mainLoop();