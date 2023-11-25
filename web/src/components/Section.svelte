<script lang="ts">
    export let title: string;
</script>



<section class="scroll-smooth mb-8">
    <h1 class="text-2xl my-3" id={title}>{title}</h1>
    <slot />
</section>

