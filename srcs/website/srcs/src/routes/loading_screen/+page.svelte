<script lang="ts">
    import { goto } from '$app/navigation';
    import { createScene } from '$lib/scene';
    import * as BABYLON from "@babylonjs/core";
    import earcut from 'earcut';
    import { onMount, onDestroy } from 'svelte';

    let  renderCanvas:HTMLCanvasElement;

    onMount(() =>
    {
        createScene(renderCanvas);
        setTimeout(() => {
            goto('/game');
        }, 5000);
    });
</script>

<div class="w-[min(90%, 480px)] h-[60vh] my-auto mx-10 border-solid border-2 border-pink-400 rounded-xl overflow-hidden resize">
    <canvas bind:this={renderCanvas} class="size-full block"></canvas>
</div>
