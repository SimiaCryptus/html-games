// webgl-utils.js

    console.log('WebGL context initialized successfully.');
/**
 * Creates and compiles a shader.
 * @param {WebGLRenderingContext} gl - The WebGL context.
 * @param {string} source - The GLSL source code for the shader.
 * @param {number} type - The type of shader (gl.VERTEX_SHADER or gl.FRAGMENT_SHADER).
 * @return {WebGLShader} The compiled shader.
 */
function createShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

/**
 * Creates a WebGL program from vertex and fragment shader sources.
 * @param {WebGLRenderingContext} gl - The WebGL context.
 * @param {string} vertexShaderSource - Vertex shader GLSL source code.
 * @param {string} fragmentShaderSource - Fragment shader GLSL source code.
 * @return {WebGLProgram} The created program.
 */
function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

/**
 * Initializes a WebGL context for a given canvas.
 * @param {HTMLCanvasElement} canvas - The canvas element to get the context from.
 * @return {WebGLRenderingContext} The WebGL context.
 */
function initWebGLContext(canvas) {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        console.error('Unable to initialize WebGL. Your browser may not support it.');
        console.error('Unable to initialize WebGL. Your browser may not support it.');
        return null;
    }
    return gl;
}

/**
 * Loads a texture from a URL.
 * @param {WebGLRenderingContext} gl - The WebGL context.
 * @param {string} url - URL of the image to be used as a texture.
 * @return {WebGLTexture} The WebGL texture.
 */
function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be download over the internet
    // they might take a moment until they are ready.
    const image = new Image();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        console.log('Texture loaded and mipmaps generated.');
    };
    image.src = url;

    return texture;
}

export { createShader, createProgram, initWebGLContext, loadTexture };