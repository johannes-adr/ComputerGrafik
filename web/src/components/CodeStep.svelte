<script lang="ts">
    export let code: string;
</script>

<li class="mt-5">
    <b><slot name="title" />:</b><br> <slot name="body" />
    <pre><code class="line-numbers lang-java">{code}</code></pre>
</li>