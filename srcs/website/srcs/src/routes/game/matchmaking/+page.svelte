<script lang="ts">
  import { onMount } from 'svelte';
  import { initGameClient } from '$lib/game/frontend/pongVariables'
  import { connection, sendInput, ping } from '$lib/game/backend/network'
  import { handleKeyDown, handleKeyUp, updateScale, updateInput } from '$lib/game/frontend/front1';

  const socket = new WebSocket("ws://localhost:3310");
  onMount(() =>
  {
    const game = initGameClient();
    let KeyUp, KeyDown, Resize;
    let keyboardState = { left: false, right: false, special: false };

    connection(socket);
    KeyDown = (event: KeyboardEvent) =>
    {
      handleKeyDown(event, keyboardState);
      updateInput(keyboardState, game.input);
      sendInput(socket, game.input);
    }
    KeyUp = (event: KeyboardEvent) =>
    {
      handleKeyUp(event, keyboardState);
      updateInput(keyboardState, game.input);
      sendInput(socket, game.input);
    }
//     Resize	= ()						=> { updateScale() };
    window.addEventListener('keydown',	KeyDown);
    window.addEventListener('keyup',		KeyUp);
//     window.addEventListener('resize',		Resize);
  })

</script>

<main class="grid w-full max-w-[108.4rem] content-start grow shrink-0 basis-auto gap-[2.4rem] grid-cols-[100%] p-[1.6rem]">
  <div
    id="realbackground"
    class="aspect-[65/73] w-full max-w-[65rem] bg-violet-950 flex justify-center items-center">

    <div
      id="terrain" 
      class="relative w-[97%] h-[97%] bg-blue-700">

      <button onclick={() => {ping(socket)}}>
        {"[Skibiping]"}
      </button>
      <div
        id="racketUp"
        class="bg-yellow-300 absolute"
      ></div>

      <div
        id="racketDown"
        class="bg-yellow-300 absolute"
      ></div>

      <div
        id="ball"
        class="bg-green-500 rounded-[50%] absolute"
      ></div>

      <div
        id="where"
        class="hidden bg-fuchsia-400 rounded-[50%] absolute origin-left"
      ></div>
    </div>
  </div>
</main>
