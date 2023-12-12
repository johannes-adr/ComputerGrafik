import { SHADER_PNOISEFUNC, SHADER_VARIABLES } from "./fragmentshaders";
import { PERLIN_NOISE_FRAGMENT } from "./perlinnoise";
import { renders } from "./shader";
export function generateMesh(size: number) {
    let vertices = [];



    for (let y = 0; y < size - 1; y++) {
        if (y % 2 == 0) { // even rows
            for (let x = 0; x < size; x++) {
                vertices.push(x, y);
                vertices.push(x, y + 1);
            }
        } else { // odd rows
            for (let x = size - 1; x >= 0; x--) {
                vertices.push(x, y + 1);
                vertices.push(x, y);
            }
  
        }
    }

    for (let i = 0; i < vertices.length; i++) {
        vertices[i] /= size - 1;
    }

    return vertices;
}
export namespace Shader3D {
    export const ROTATION_MATRIX_SHADERCODE = `
// Rotation matrices not by me
// Rotation matrix around the X axis.
mat3 rotateX(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(1, 0, 0),
        vec3(0, c, -s),
        vec3(0, s, c)
    );
}

// Rotation matrix around the Y axis.
mat3 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, 0, s),
        vec3(0, 1, 0),
        vec3(-s, 0, c)
    );
}

// Rotation matrix around the Z axis.
mat3 rotateZ(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, -s, 0),
        vec3(s, c, 0),
        vec3(0, 0, 1)
    );
}`;


    export const vertex = `//========
//Vertex Shader
//========
${PERLIN_NOISE_FRAGMENT}
${ROTATION_MATRIX_SHADERCODE}

attribute vec4 pos;
uniform float time;
varying vec3 coords;
varying float height;
varying vec3 vNormal;

float vnoise(vec2 pos){
    return 0.4 * noise(pos.xy*3.0 + time / 3.0) + 0.15 * noise(pos.xy*8.0 + time / 3.0 + 1000.0);
}

void main() {
    mat3 rot = mat3(rotateX(radians(45.0)) * rotateY(radians(20.0))) * rotateZ(radians(-10.0));

    vec3 pos2 = pos.xyz;
    height = vnoise(pos.xy);
    pos2.z +=height; // noise
    pos2.xy *= 0.7; // Scale down the x and y coordinates

    // The reason for this is that we dont know based on the other vertices how the gradient will be
    // => because we dont know the other vertices. However we can calculate the 
    //    local gradient using partial derivatives
    float delta = 0.01; // Small delta for derivative approximation
    float dzdx = (vnoise(vec2(pos2.x + delta, pos2.y)) - vnoise(vec2(pos2.x - delta, pos2.y))) / (2.0 * delta);
    float dzdy = (vnoise(vec2(pos2.x, pos2.y + delta)) - vnoise(vec2(pos2.x, pos2.y - delta))) / (2.0 * delta);

    // The normal is perpendicular to the gradient
    vec3 normal = normalize(vec3(-dzdx, -dzdy, 1.0));

    // Apply the same rotations to the normal
    normal = rot * normal;
    vNormal = normal;

    pos2 *= rot;
    coords = pos2;
    gl_Position = vec4(pos2, pos.w);
}

`;

    export const fragment = `//========
//Fragment Shader
//========
precision mediump float;
varying vec3 coords;
varying vec3 vNormal;
varying float height;
void main(void) {
    // Define a light source direction (normalized)
    vec3 lightDirection = normalize(vec3(1.0,1.0,1.0)); // Example directional light

    // Calculate the diffuse component
    float diffuse = max(dot(vNormal, lightDirection), 0.0);

    // Set the color based on the diffuse component
    vec3 color = vec3(diffuse, diffuse, diffuse); // Grayscale based on light intensity
    color = -vec3(height);
    color += 0.5;
    color /= 1.2;
    gl_FragColor = vec4(color, 1.0);
}
`;
}
const size = 100;



export default function createShaderFractalNoise(canvas: HTMLCanvasElement) {
    // let ctx = canvas.getContext("2d")!;
    // let vertices = generateMesh(size).map(v=>v*200);
    // ctx.strokeStyle = "red";
    // ctx.moveTo(vertices[0],vertices[1]);
    // console.log(vertices);
    // //vertices.length / 2
    // for(let i = 1;i<24;i++){
    //     let x = vertices[i*2];
    //     let y = vertices[i*2+1];
    //     ctx.lineTo(x,y);
    // }
    // ctx.stroke();
    // return;
    let gl = canvas.getContext('webgl', { depth: true })!;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);



    //
    // Create shaders
    // 
    var vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;

    gl.shaderSource(vertexShader, Shader3D.vertex);
    gl.shaderSource(fragmentShader, Shader3D.fragment);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    let program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }

    let vertices = generateMesh(size).map(v =>(v - 0.5) * 2);


    // Vertex-Buffer
    var posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'pos');
    gl.vertexAttribPointer(
        positionAttribLocation, 
        2, 
        gl.FLOAT,
        false,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0 
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.useProgram(program);
    let startTime = Date.now();
    let attribLocTime = gl.getUniformLocation(program,"time");
    function render() {
        let currentTime = Date.now();
        let time = (currentTime - startTime) / 1000; // Zeit in Sekunden
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(attribLocTime,time);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 2);
    }
    render();
    renders.push({render: render, canvas: canvas});
    return Shader3D.vertex + Shader3D.fragment;
}