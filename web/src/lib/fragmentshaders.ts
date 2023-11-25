import { PERLIN_NOISE_FRAGMENT, SIMPLEX_NOISE_FRAGMENT, VALUE_NOISE_FRAGMENT } from "./perlinnoise";

const SHADER_VARIABLES = 
`precision mediump float;
uniform float time;
uniform float aspectratio;
uniform float scale;
varying vec2 coordinates;
`

const SHADER_PNOISEFUNC =
`float pnoise(float speed, float localScale, float offset){
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
    vec2 animated = (coordinates + vec2(time2, time / 10.0 + sin(time * 2.0) / 5.0)) * 10.0;
    float noised = noise(animated);
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