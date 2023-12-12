import { SHADER_PNOISEFUNC, SHADER_VARIABLES } from "./fragmentshaders";
import { PERLIN_NOISE_FRAGMENT } from "./perlinnoise";
import { renders } from "./shader";
import { Shader3D as S3D, generateMesh} from "./shader3d";
export let rotationsValues = {
    x: 45,
    y: 20,
    z: -10,
    scale: 0.5
}

export namespace Shader3D {



    export const vertex = `//========
//Vertex Shader
//========
${PERLIN_NOISE_FRAGMENT}
${S3D.ROTATION_MATRIX_SHADERCODE}

attribute vec4 pos;
uniform float time;
varying vec3 coords;
varying float height;
varying vec3 vNormal;

uniform vec4 rotAndScale;


struct NoiseData{
    float superfast;
    float flat_y;
    float hilly_y;
    float water_noise;
};

varying float superfast;
varying float flat_y;
varying float hilly_y;
varying float water_noise;


/*
Wrapper um Noise Funktion für weniger Repitition im Shadercode (übernimmt berechnung von Zeit und Koordinaten):
speed: Faktor um wie viel schneller die Noise Funktion verschoben wird
localScale: Skalierung (größerer Wert macht mehr vom Noise sichtbar)
offset: Konstante verschiebung der Noisefunktion
*/
float pnoise(float speed, float localScale, vec2 offset){
    return noise((coords.xy + offset + vec2(time * speed)) * localScale);
}



NoiseData genNoise(vec2 offset){
    NoiseData noiseData;
    noiseData.superfast = pnoise(0.1, 25.0, 1521.0 + offset) / 4.0;
    noiseData.flat_y = pnoise(0.1, 1.0,0.0 + offset) + 0.2;
    noiseData.hilly_y = pnoise(0.1,4.0,1521.0 + offset);
    noiseData.water_noise = pnoise(0.1, 2.0, -2320.0 + offset);
    return noiseData;
}



float vnoise(vec2 offset){
    NoiseData n = genNoise(offset);
    if(n.flat_y < n.hilly_y){
        //Do Hill

        return  -n.hilly_y / 2.0;
    }else if(n.water_noise > -0.2){
        //Do grass
        return -n.flat_y / 2.0;
    }else if(n.water_noise > -0.4){
        //Do sand
        return -n.flat_y / 2.0;
    }else{
        //Do water
        return -n.flat_y / 2.0 + n.superfast / 5.0;
    }
}

void main() {
    mat3 rot = mat3(rotateX(radians(rotAndScale.x)) * rotateY(radians(rotAndScale.y))) * rotateZ(radians(-10.0));

    vec3 pos2 = pos.xyz;
    height = vnoise(pos.xy);
    NoiseData n = genNoise(pos.xy);
    superfast = n.superfast;
    flat_y = n.flat_y;
    hilly_y = n.hilly_y;
    water_noise = n.water_noise;

    pos2.z +=height; // noise
    pos2.xy *= rotAndScale.w; // Scale down the x and y coordinates

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

varying float superfast;
varying float flat_y;
varying float hilly_y;
varying float water_noise;



void main(void) {
    // Define a light source direction (normalized)
    vec3 lightDirection = normalize(vec3(1.0,1.0,1.0)); // Example directional light

    // Calculate the diffuse component
    float diffuse = max(dot(vNormal, lightDirection), 0.0);

    // Set the color based on the diffuse component
    vec3 shadow = vec3(diffuse, diffuse, diffuse); // Grayscale based on light intensity
    shadow = -vec3(height) + 0.4;

    vec3 color;
    if(flat_y < hilly_y){
        //Do Hill
        color = vec3(vec3(hilly_y / 2.0 + 0.1));
    }else if(water_noise > -0.2){
        //Do grass
        color = vec3(0.0,flat_y + superfast / 5.0 + 0.5,0.0);
    }else if(water_noise > -0.4){
        //Do sand
        color = vec3(1.0,1.0,0.5);
    }else{
        //Do water
        color = vec3(0.0,0.0,1.0);
    }

    gl_FragColor = vec4(shadow * color + 0.1, 1.0);
}
`;
}
const size = 500;



export default function createShaderWorldSimulation(canvas: HTMLCanvasElement) {
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
    let uniformLocTime = gl.getUniformLocation(program,"time");
    let uniformRotAndScale = gl.getUniformLocation(program,"rotAndScale");
    function render() {
        let currentTime = Date.now();
        let time = (currentTime - startTime) / 1000; // Zeit in Sekunden
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uniformLocTime,time);
        gl.uniform4f(uniformRotAndScale,rotationsValues.x,rotationsValues.y,rotationsValues.z,rotationsValues.scale)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 2);
    }
    render();
    renders.push({render: render, canvas: canvas});
    return Shader3D.vertex + Shader3D.fragment;
}