<script lang="ts">
    import { onMount } from 'svelte';
    import { initGame } from '$lib/game/p_var';
    import { handleKeyDown, handleKeyUp, updateScale } from '$lib/game/p_game';
    import { new_game, game_loop } from '$lib/game/p_misc'

    onMount(() =>
    {
        const game_vars = initGame();
        const onKeyDown = (event: KeyboardEvent) => { handleKeyDown(game_vars, event); }
        const onKeyUp = (event: KeyboardEvent) => { handleKeyUp(game_vars, event); }
        const onResize = () => { updateScale(game_vars) };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        window.addEventListener('resize', onResize);

        updateScale(game_vars);
        new_game(game_vars);
        game_loop(game_vars);

        return () =>
        {
            game_vars.close_game = true;
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(game_vars.animationFrameID);
        }
    });
</script>

<main class="grid w-full max-w-[108.4rem] content-start grow shrink-0 basis-auto gap-[2.4rem] grid-cols-[100%] p-[1.6rem]">
    <div
        id="realbackground"
        class="aspect-[65/73] w-full max-w-[65rem] bg-violet-950 flex justify-center items-center"
    >
        <div
            id="background"
            class="relative w-[97%] h-[97%] bg-blue-700"
        >
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
