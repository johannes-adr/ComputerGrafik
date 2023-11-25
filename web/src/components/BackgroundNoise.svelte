<script lang="ts">
    import { onMount } from "svelte";
    import { PERLIN_NOISE_FRAGMENT } from "$lib/perlinnoise";
    import createShader from "$lib/shader";
    let canvas: HTMLCanvasElement;
    onMount(() => {
        const shader = `
        precision mediump float;
        uniform float time;
        uniform float scrolly;
        varying vec2 coordinates;
  
        ${PERLIN_NOISE_FRAGMENT}
  
        float circle(in vec2 _st, in float _radius){
            vec2 dist = _st-vec2(0.5);
              return 1.-smoothstep(_radius-(_radius*0.01),
                           _radius+(_radius*0.01),
                           dot(dist,dist)*4.0);
        }
  
        void main(void) {
            float time2 = time / 7.0;
            // Use the noise function
            vec2 animated = (coordinates + vec2(0.0,-scrolly / 700.0)) * 5.0;
            float noised = noise(animated);
            vec4 color = vec4(vec3(noised*.5+.5),0.5);
            gl_FragColor = color;
        }`;

        //createShader(canvas, shader);
    });
</script>

<canvas class="w-screen h-screen fixed -z-10" bind:this={canvas} />
