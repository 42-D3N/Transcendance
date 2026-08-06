<script lang="ts">
  import { connection, sendInput, ping } from '$lib/game/backend/network'

  const socket = new WebSocket("ws://localhost:3310");
  connection(socket);
</script>

<main class="grid w-full max-w-[108.4rem] content-start grow shrink-0 basis-auto gap-[2.4rem] grid-cols-[100%] p-[1.6rem]">
  <div
    id="realbackground"
    class="aspect-[65/73] w-full max-w-[65rem] bg-violet-950 flex justify-center items-center">

    <div
      id="terrain"
      class="relative w-[97%] h-[97%] bg-blue-700">

      <button onclick={() => {ping(socket)}}>
        {"[Ping]"}
      </button>
      <button onclick={() => {sendInput(socket, {move: -1, special: false})}}>
        {"[GAUCHE]"}
      </button>
      <button onclick={() => {sendInput(socket, {move: 0, special: false})}}>
        {"[PAS BOUGER]"}
      </button>
      <button onclick={() => {sendInput(socket, {move: 1, special: false})}}>
        {"[DROITE]"}
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
