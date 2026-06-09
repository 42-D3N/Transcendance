<script lang="ts">
    import { onMount } from 'svelte';
    import { initGame } from '$lib/game/p_var';
    import { core } from '$lib/game/p_game';

    onMount(() => {
        const game_vars = initGame();
        core(game_vars);
    });
</script>

<main class="grid w-full max-w-[108.4rem] content-start grow shrink-0 basis-auto gap-[2.4rem] grid-cols-[100%] p-[1.6rem]">
    <div id="realbackground" class="w-[33rem] h-[40rem] md:w-[65rem] md:h-[73rem] bg-violet-950 flex justify-center items-center">
        <div id="background" class="bg-blue-700 w-[90%] h-[90%] relative">
            <div id="racketUp" class="w-33 h-4 bg-yellow-300 top-0 absolute"></div>
            <div id="racketDown" class="w-33 h-4 bg-yellow-300 bottom-0 absolute"></div>
            <div id="circle" class="bg-green-500 rounded-[50%] w-15 h-15 absolute"></div>
            <div id="where" class="bg-fuchsia-400 rounded-[50%] w-80 h-2 absolute origin-[left center]"></div>
        </div>
    </div>
</main>
