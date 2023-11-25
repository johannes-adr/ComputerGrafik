<script lang="ts">
    import type ResourceRef from "$lib/resourceref";
    import Link from "./Link.svelte";
    export let reference: ResourceRef;
    export let showFullName: boolean | undefined = undefined;
</script>

{#if showFullName === undefined}
    <Link href="#{reference.getFullName()}"
        >[{reference.getIndex()}]</Link>
{:else if showFullName == true}
    <Link href="#{reference.getFullName()}"
        >{reference.getFullName()}</Link
    >
{:else if showFullName == false}
    <Link href="#{reference.getFullName()}"
        >{reference.getPrefixWithIndex()}</Link
    >
{/if}
