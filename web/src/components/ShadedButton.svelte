<script lang="ts">
  import { onMount } from "svelte";
  import { PERLIN_NOISE_FRAGMENT } from "$lib/perlinnoise";
  import createShader from "$lib/shader";
  let canvas: HTMLCanvasElement;
  onMount(()=>{
    const shader = `
      precision mediump float;
      uniform float time;
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
          vec2 animated = (coordinates + vec2(time2, time2));
          float noised = noise(animated) * 30.0;
          //+ time * noise(coordinates) * 5.0
          
          float radius = (1.0 + sin(noised)) / 10.0 + 0.5; 
          vec4 color = vec4(circle(coordinates,radius));

          gl_FragColor = color;
      }`;

    createShader(canvas,shader);
  });
</script>
<a class="hover:scale-110 transition-all " href="#Motivation">
  <div class="relative ">
    <div class=" blur-sm opacity-90">
      <canvas width="220px" height="120px" bind:this={canvas} />
    </div>
    <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl">
      Los
      
    </span>
    
  </div>
</a>

