<script lang="ts">
    export let directory: string;

    export let width: number = 300;
</script>


<model-viewer
    id="world_solid"
    alt="3D Object of Perlin noise combined world"
    style="height: {width}px;width: {width}px;"
    class="rounded-md"
    src="/{directory}/out.gltf"
    auto-rotate
    camera-controls
    shadow-intensity="2" exposure="0" shadow-softness="0.65" tone-mapping="commerce" environment-image="legacy"
/>

<style>
model-viewer{
    border: solid 1px rgba(0, 0, 0, 0.2);
    /* height: 300px; */
}
</style>
    <!-- camera-controls -->
