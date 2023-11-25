<!-- <img src="/alltogether/rendered.png" width="100px" alt=""> -->
<script>
    import "../app.css";
    export const prerender = true;
    export const ssr = true;
</script>

<slot />
<span class=" absolute top-2 right-5 text-white text-opacity-70"
    >INF21IN Computergrafik 2023</span
>

<a
    class=" flex flex-row items-center gap-2 fixed bottom-0 right-0 px-3 py-2 border-l border-t bg-white backdrop-blur-sm bg-opacity-70 rounded-tl-xl text-black"
    href="https://github.com/johannes-adr/ComputerGrafik"
    >
    <img width="25px" src="github-mark.svg"/>
    Johannes A.</a
>
