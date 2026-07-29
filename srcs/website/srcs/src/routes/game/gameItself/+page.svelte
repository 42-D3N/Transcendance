<script lang="ts">
    import { onMount } from 'svelte';
    import { initGame } from '$lib/game/p_var';
    import { handleKeyDown, handleKeyUp, updateScale } from '$lib/game/p_game';
    import { new_game, game_loop, stop_game } from '$lib/game/p_misc'

    onMount(() =>
    {
        const game_vars = initGame();
        game_vars.onKeyDown = (event: KeyboardEvent) => { handleKeyDown(game_vars, event); }
        game_vars.onKeyUp = (event: KeyboardEvent) => { handleKeyUp(game_vars, event); }
        game_vars.onResize = () => { updateScale(game_vars) };
        window.addEventListener('keydown', game_vars.onKeyDown);
        window.addEventListener('keyup', game_vars.onKeyUp);
        window.addEventListener('resize', game_vars.onResize);

        updateScale(game_vars);
        new_game(game_vars);
        game_loop(game_vars);

        return () => { stop_game(game_vars); }
    });
</script>

<main class="grid w-full max-w-[108.4rem] content-start grow shrink-0 basis-auto gap-[2.4rem] grid-cols-[100%] p-[1.6rem]">
    <div
        id="realbackground"
        class="aspect-[65/73] w-full max-w-[65rem] bg-violet-950 flex justify-center items-center">

        <div
            id="background"
            class="relative w-[97%] h-[97%] bg-blue-700">

            <div
                id="racketUp"
                class="bg-yellow-300 absolute"
            ></div>

            <div
                id="racketDown"
                class="bg-yellow-300 absolute"
            ></div>

            <div
                id="circle"
                class="bg-green-500 rounded-[50%] absolute"
            ></div>

            <div
                id="where"
                class="hidden bg-fuchsia-400 rounded-[50%] absolute origin-left"
            ></div>
        </div>
    </div>
</main>
