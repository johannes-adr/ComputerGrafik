import { PERLIN_NOISE_FRAGMENT, SIMPLEX_NOISE_FRAGMENT, VALUE_NOISE_FRAGMENT } from "./perlinnoise";

export const SHADER_VARIABLES = 
`precision mediump float;
uniform float time;
uniform float aspectratio;
uniform float scale;
uniform vec2 mousePos;
varying vec2 coordinates;

`

export const SHADER_PNOISEFUNC =
`/*
Wrapper um Noise Funktion für weniger Repitition im Shadercode (übernimmt berechnung von Zeit und Koordinaten):
speed: Faktor um wie viel schneller die Noise Funktion verschoben wird
localScale: Skalierung (größerer Wert macht mehr vom Noise sichtbar)
offset: Konstante verschiebung der Noisefunktion
*/
float pnoise(float speed, float localScale, float offset){
    vec2 coordWAspect = coordinates;
    coordWAspect.x *= aspectratio;
    return noise((coordWAspect + offset + vec2(time * speed)) * localScale * scale);
}
`


function fragmentShaderUsingNoise(noise: string) {
    return `precision mediump float;
uniform float time;
varying vec2 coordinates;

/*===================
FOLLOWING CODE IS NOT MINE!!!
===================*/
${noise}
/*===================
FOLLOWING CODE IS MINE
===================*/

    
void main(void) {
    float time2 = time / 7.0;
    //lineare x-verschiebung mit zeit, durch sin auf y wert entsteht ein schwingendes Bild
    vec2 animated = (coordinates + vec2(time2, time / 10.0 + sin(time * 2.0) / 5.0)) * 10.0;
    float noised = noise(animated);
    
    // -1 bis 1 wird zu 0 bis 1
    vec4 color = vec4(vec3(noised*.5+.5),1.0);
    gl_FragColor = color;
}`

}




export const FRAGMENT_SHADER_USING_VALUE_NOISE = fragmentShaderUsingNoise(VALUE_NOISE_FRAGMENT);
export const FRAGMENT_SHADER_USING_PERLIN_NOISE = fragmentShaderUsingNoise(PERLIN_NOISE_FRAGMENT);
export const FRAGMENT_SHADER_USING_SIMPLEX_NOISE = fragmentShaderUsingNoise(SIMPLEX_NOISE_FRAGMENT);
export const FRAGMENT_SHADER_USING_PERLIN_COMBINED = 
`${SHADER_VARIABLES}

/*===================
FOLLOWING CODE IS NOT MINE!!!
===================*/
${PERLIN_NOISE_FRAGMENT}
/*===================
FOLLOWING CODE IS MINE!!!
===================*/    

${SHADER_PNOISEFUNC}

void main(void) {
    float noise1 = pnoise(0.1, 2.5,0.0);
    float noise2 = pnoise(0.1, 20.0, 1521.0) / 7.0;
    float noise3 = pnoise(0.1, 10.0, -2320.0) / 7.0;

    float noise = noise1 + noise2 + noise3;
    vec4 color = vec4(vec3(noise*.5+.5),1.0);
    gl_FragColor = color;
}
`;



export const FRAGMENT_SHADER_USING_PERLIN_COMBINED_MAX = 
`${SHADER_VARIABLES}

/*===================
FOLLOWING CODE IS NOT MINE!!!
===================*/
${PERLIN_NOISE_FRAGMENT}
/*===================
FOLLOWING CODE IS MINE!!!
===================*/    
${SHADER_PNOISEFUNC}

void main(void) {
    float noise1 = pnoise(0.1, 2.5,0.0);
    float noise2 = pnoise(0.1, 20.0, 1521.0) / 7.0;
    float noise3 = pnoise(0.1, 10.0, -2320.0) / 7.0;

    float noise = max(max(noise1, noise2), noise3);
    vec4 color = vec4(vec3(noise*.5+.5),1.0);
    gl_FragColor = color;
}
`;

export const FRAGMENT_SHADER_USING_PERLIN_COMPLEX_ISLANDS = 
`${SHADER_VARIABLES}

/*===================
FOLLOWING CODE IS NOT MINE!!!
===================*/
${PERLIN_NOISE_FRAGMENT}
/*===================
FOLLOWING CODE IS MINE!!!
===================*/    
float pnoise(float localScale, float offset){
    vec2 coordWAspect = coordinates + mousePos / 30.0;
    coordWAspect.x *= aspectratio;
    return noise((coordWAspect + offset) * localScale * scale);
}

float heightAtCoord(vec2 coordinates){
    float dist_to_center = distance(coordinates,vec2(0.5,0.5));
    float noise1 = pnoise( 10.0,50.0) - 0.7 - dist_to_center * 1.5;
    float noise2 = pnoise( 7.0, 1521.0) / 2.0;
    float noise3 = pnoise( 2.0, -2320.0);
    float noise4 = pnoise( 15.0, -2320.0) /2.0 - dist_to_center * 2.5;
    float combined = noise1 + noise2 + noise3 + noise4;
    combined *= 0.4;
    if(combined<-1.0){
        combined = -1.0;
    }
    combined += 1.0;
    combined = log(combined + 0.1) + 1.0;
    if(combined > 1.0){
        combined = 1.0;
    }
    return combined;
}

void main(void) {
    vec2 sunPos2D = vec2(sin(time/2.0),cos(time/2.0)) / 0.5 + 1.0;
    vec3 sunPos = vec3(sunPos2D,7.5);
    float height_at_here = heightAtCoord(coordinates);
   
    vec3 pixelPos = vec3(coordinates,height_at_here + 0.3);
    vec3 rayDir = normalize(sunPos-pixelPos);

    for (float t = 0.01; t < 1.0; t += 0.025) {
        vec3 currentRayPos = pixelPos + t * rayDir;
        float heightAtCurrentRayPos = heightAtCoord(currentRayPos.xy);
        if(currentRayPos.z > 1.0){
            break;
        }
        if(distance(currentRayPos, sunPos) < 0.1){
            break;
        }

        if (heightAtCurrentRayPos > currentRayPos.z) {
            gl_FragColor = vec4(vec3(t),1.0);
            return;
            break;
        }
            
    }


    vec3 color;
    if(height_at_here <= 0.1){
        color = vec3(0.435,0.682,0.698);
        float fac = 10.0;
        color += pnoise(12.0,time / 20.0) / fac - pnoise(20.0,0.0) / fac / 2.0;    
    }else if(height_at_here < 0.4){
        color = vec3(0.859,0.741,0.651);
    }else if(height_at_here < 0.7){
        color = vec3(0.631,0.71,0.408);
    }
    else{
       // vec4 color = vec4(vec3(height_at_here*.5+.5),1.0);
        color = vec3(0.314,0.502,0.31);
        color -= height_at_here / 3.0;
    }
    color += height_at_here / 10.0;
   
    gl_FragColor = vec4(color,1.0);
}
`;



export const FRAGMENT_SHADER_RESULTING_IN_WATER_ETC = 
`
${SHADER_VARIABLES}
/*===================
FOLLOWING CODE IS NOT MINE!!!
===================*/
${PERLIN_NOISE_FRAGMENT}
/*===================
FOLLOWING CODE IS MINE!!!
===================*/    
${SHADER_PNOISEFUNC}


//Ziel ist es, durch Anwendung eines Fractal Noise 
//wellenähnliche Strukturen zu schaffen
void drawWater(float superfast){
    float noise1 = pnoise(0.15, 2.5,0.0);
    
    float noise3 = pnoise(0.3, 10.0, -2320.0) / 7.0;

    float noise = noise1 + superfast + noise3;
    float color = noise+.7;
    gl_FragColor = vec4(color / 7.0,color / 3.0,color,1.0);
}


void main(void) {
    float superfast = pnoise(0.1, 25.0, 1521.0) / 4.0;

    float flat_y = pnoise(0.1, 1.0,0.0) + 0.2;
    float hilly_y = pnoise(0.1,4.0,1521.0);
    float water_noise = pnoise(0.1, 2.0, -2320.0);

  
    if(flat_y < hilly_y){
        //Do Hill
        gl_FragColor = vec4(vec3(hilly_y / 2.0 + 0.1),1.0);
    }else if(water_noise > -0.2){
        //Do grass
        gl_FragColor = vec4(0.0,flat_y + superfast / 5.0 + 0.5,0.0,1.0);
    }else if(water_noise > -0.4){
        //Do sand
        gl_FragColor = vec4(1.0,1.0,0.5,1.0);
    }else{
        //Do water
        drawWater(superfast);
    }
}



`;

export const FRAGMENT_SHADER_FOR_CIRCLE = 
`${SHADER_VARIABLES}
/*===================
FOLLOWING CODE IS NOT MINE!!!
===================*/
${PERLIN_NOISE_FRAGMENT}
/*===================
FOLLOWING CODE IS MINE
===================*/

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);  
    return 1.-smoothstep(_radius-(_radius*0.01),
                   _radius+(_radius*0.01),
                   dot(dist,dist)*4.0);
}

void main(void) {
    float time2 = time / 7.0;
    vec2 animated = (coordinates + vec2(time2, time2));
    float noised = noise(animated) * 30.0;
    
    float angle = atan(coordinates.y/coordinates.x);
    float radius1 = noise((vec2(angle) + vec2(time2))) + 0.5;

    float radius2 = (noise(((vec2(angle) + vec2(-time) + 10000.0) * 4.0)) + 0.5) / 5.0;
    float radius = (1.0 + sin(time) / 2.0) * radius1 - radius2;
    if(radius <= 0.0){radius = 0.01;}

    vec4 color = vec4(circle(coordinates,radius));

    gl_FragColor = color;
}`