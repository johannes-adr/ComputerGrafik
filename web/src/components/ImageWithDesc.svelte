<script lang="ts">
    import type ResourceRef from "$lib/resourceref";
    export let imageRef: ResourceRef;
    // export let desc: string | undefined = undefined;
</script>

<div class="flex flex-col mb-7 mx-5" id={imageRef.getFullName()}>
    <div class="flex flex-col items-center">
        <div class="flex">
            <slot />
        </div>
        <span class="break-words max-w-xs">{imageRef.getFullName()}</span>
        <slot name="desc" />
    </div>
</div>

<style>
</style>
