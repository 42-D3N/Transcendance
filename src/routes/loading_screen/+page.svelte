<script lang="ts">
    import { onMount } from 'svelte';
    import { createScene } from '$lib/scene';

    let  renderCanvas:HTMLCanvasElement;

    onMount(() => {
        createScene(renderCanvas);
    });
</script>

<div class="w-[min(90%, 480px)] h-[60vh] my-auto mx-10 border-solid border-2 border-pink-400 rounded-xl overflow-hidden resize">
    <canvas bind:this={renderCanvas} class="size-full block"></canvas>
</div>