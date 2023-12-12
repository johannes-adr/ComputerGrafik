<script lang="ts">
  import { onMount } from "svelte";
  import createShader from "$lib/shader";
  export let fragmentShader: string;
  export let openModal: undefined | ((glsl:string)=>void) = undefined;
  export let createShaderFn: undefined | ((canv: HTMLCanvasElement)=>string | undefined) = undefined;
  export let renderOnce = false;
  let canvas: HTMLCanvasElement;
  export let width = 200;
  export let height = 200;
  onMount(() => {
    if(createShaderFn !== undefined){
      let ret = createShaderFn(canvas);
      if(ret){
      fragmentShader = ret;

      }
    }else{
      createShader(canvas, fragmentShader,renderOnce);
    }
  });
</script>

<button class=" hover:scale-105 transition-transform" on:click={()=>{
//   let tab = window.open('about:blank', '_blank');
//   tab?.document.write(
// `<pre>${fragmentShader}</pre>`
//   );
//   tab?.document.close();
  if(openModal)openModal(fragmentShader);
}}>
  <canvas class=" bg-black" width="{width}" height="{height}" bind:this={canvas} />
</button>


