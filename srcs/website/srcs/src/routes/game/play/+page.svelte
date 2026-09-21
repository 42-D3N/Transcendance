<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { ClientGameState } from '$lib/game/both/interfaces';
  import { initGameClient } from '$lib/game/frontend/pongVariables'
  import { sendInput } from '$lib/game/backend/network'
  import { handleKeyDown, handleKeyUp, updateScale, updateInput } from '$lib/game/frontend/front';
  import type { AIDifficulty, MatchMode } from '$lib/game/both/interfaces';
  import { afterNavigate, goto } from '$app/navigation'
  import chatData from './chat-data.json';

  type ChatMessage = string;

  let chatMessages = $state<ChatMessage[]>([]);
  let chatInterval: ReturnType<typeof setInterval> | undefined;
  let chatPanelElement: HTMLElement | undefined;
  let chatCapacity = $state(8);
  let chatResizeObserver: ResizeObserver | undefined;
  import {
    bindSocketHandlers,
    clickReady,
    createPointerHandlers,
    sendDirectionalInput,
  } from './game-controller';
  import {
    buildGameUrl,
    getPlayerLabels,
    getRequestedDifficulty,
    getRequestedMode,
    isReadyOverlayVisible,
    type GameUserData,
  } from './play-page';

  let resolveNavReady: (() => void) | undefined;
  const navReady = new Promise<void>((resolve) => {
    resolveNavReady = resolve;
  });

  afterNavigate ((navigation: any) =>
  {
    if (navigation.from === null || (navigation.from.route.id !== "/game" && navigation.from.route.id !== "/game/play"))
    {
      goto('/game');
      return;
    }
    resolveNavReady?.();
    resolveNavReady = undefined;
  });

  let socket			: WebSocket | undefined;
  let connected			= $state(false);
  let localSide			= $state<1 | 2 | null>(null);
  let gameState			= $state<ClientGameState | null>(null);
  let localReady		= $state(false);
  let matchMode			= $state<MatchMode>('pvp');
  let aiDifficulty		= $state<AIDifficulty>('easy');
  let reconnecting		= $state(false);
  let activeMove		= $state<-1 | 0 | 1>(0);
  let currentInstanceId	= $state<string | null>(null);
  let opponentUsername	= $state<string | null>(null);
  let opponentSkinRac	= $state<number | string | null>(null);
  let { data }			= $props();

  const playerLabels = $derived(getPlayerLabels({
    localSide,
    username: data.username,
    opponentUsername,
  }));
  const leftPlayerLabel = $derived(playerLabels.left);
  const rightPlayerLabel = $derived(playerLabels.right);
  const topPlayerLabel = $derived(playerLabels.top);
  const bottomPlayerLabel = $derived(playerLabels.bottom);

  function handleClickReady()
  {
    clickReady(socket, localReady);
    localReady = true;
  }

  function createGameSocketUrl()
  {
    return buildGameUrl({
      host: window.location.host,
      mode: matchMode,
      aiDifficulty,
      currentInstanceId,
      data: data as GameUserData,
    });
  }

  function disconnectSocket()
  {
    if (socket && socket.readyState !== WebSocket.CLOSED)
    {
      socket.close();
      socket = undefined;
    }
  }

  function connectSocket(game: ReturnType<typeof initGameClient>)
  {
    reconnecting = true;
    disconnectSocket();
    localSide = null;
    localReady = false;
    gameState = null;
    activeMove = 0;
    opponentSkinRac = null;
    socket = new WebSocket(createGameSocketUrl());
    socket.onopen  = () => { connected = true;  reconnecting = false; };
    socket.onclose = () => { connected = false; reconnecting = false; };
    bindSocketHandlers({
      socket,
      game,
      getLocalSide: () => localSide,
      setGameState: (state) => { gameState = state; },
      setLocalReady: (value) => { localReady = value; },
      setLocalSide: (side) => { localSide = side; },
      setOpponentUsername: (value) => { opponentUsername = value; },
      setOpponentSkinRac: (value) => { opponentSkinRac = value; },
      setCurrentInstanceId: (value) => { currentInstanceId = value; },
    });
  }

  const showReadyOverlay = $derived(isReadyOverlayVisible(gameState?.status ?? null));
  const isReadyPhase = $derived(isReadyOverlayVisible(gameState?.status ?? null));
  const modeLabel = $derived(matchMode === 'pvp' ? 'PvP' : 'PvE');

  function normalizeSkinId(skin: unknown): number | null {
    if (typeof skin === 'number' && Number.isInteger(skin))
      return skin;
    if (typeof skin === 'string')
    {
      const parsedSkin = Number.parseInt(skin, 10);
      if (Number.isInteger(parsedSkin))
        return parsedSkin;
    }
    return null;
  }

  function getSkinStyle(skin: unknown, is_ball: boolean): string {
    const skinId = normalizeSkinId(skin);

    if (skinId === 1)
      return ('background:#123c52;');
    else if (skinId === 2)
      return ('background:#ba0bf3;');
    else if (skinId === 3)
      return ('background:#c41e3a;');
    else if (skinId === 4)
      return ('background:#1bff00;');
    else if (skinId === 5)
      return ('background:#fff59d;');
    else if (skinId === 6)
      return ('background:linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#8000ff,#f00);');
    else if (skinId === 7)
      return ('background:repeating-linear-gradient(135deg,#ffff00 0px,#ffff00 5px,#000000 5px,#000000 10px);');
    else if (skinId === 8)
      return ('background:#efbf04;');
    if (is_ball)
      return ('background:#ff0000;');
    return ('background:#f4f4f4;');
  }

  const localRacketSkinStyle = $derived(getSkinStyle((data as GameUserData).skin_rac, false));
  const localBallSkinStyle = $derived(getSkinStyle((data as GameUserData).skin_ball, true));
  const opponentRacketSkinStyle = $derived(getSkinStyle(opponentSkinRac, false));
  const topRacketStyle = $derived(localSide === 2 ? localRacketSkinStyle : opponentRacketSkinStyle);
  const bottomRacketStyle = $derived(localSide === 1 ? localRacketSkinStyle : opponentRacketSkinStyle);

  function sendMobileInput(nextMove: -1 | 0 | 1)
  {
    activeMove = nextMove;
    sendDirectionalInput(socket, nextMove);
  }

  function setMove(move: -1 | 0 | 1)
  {
    sendMobileInput(move);
  }

  const pointerHandlers = createPointerHandlers((move) => setMove(move));
  const onTouchMoveStart = pointerHandlers.start;
  const onTouchMoveStop = pointerHandlers.stop;

  onMount(async () =>
  {
    const game = initGameClient();
    let keyboardState = { left: false, right: false };
    const query = new URLSearchParams(window.location.search);
    const requestedDifficulty = query.get('aiDifficulty');

    matchMode = getRequestedMode(query.get('mode'));
    aiDifficulty = getRequestedDifficulty(requestedDifficulty);

    const users = Array.isArray(chatData?.users) ? chatData.users : [];
    const messages = Array.isArray(chatData?.messages) ? chatData.messages : [];

    const makeChatLine = () => {
      if (!users.length || !messages.length) {
        return 'gg ez';
      }
      const user = users[Math.floor(Math.random() * users.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];
      return `${user}: ${message}`;
    };

    const updateChatCapacity = () => {
      if (!chatPanelElement) {
        chatCapacity = 5;
        return;
      }

      const panelHeight = chatPanelElement.clientHeight;
      const messageHeight = 28;
      const gap = 8;
      const nextCapacity = Math.max(4, Math.floor((panelHeight - 36) / (messageHeight + gap)));
      chatCapacity = nextCapacity;

      if (chatMessages.length < chatCapacity) {
        const missing = chatCapacity - chatMessages.length;
        chatMessages = [...chatMessages, ...Array.from({ length: missing }, () => makeChatLine())];
      } else if (chatMessages.length > chatCapacity) {
        chatMessages = chatMessages.slice(-chatCapacity);
      }
    };

    updateChatCapacity();
    chatMessages = Array.from({ length: chatCapacity }, () => makeChatLine());

    chatInterval = setInterval(() => {
      const next = makeChatLine();
      chatMessages = [...chatMessages.slice(-Math.max(0, chatCapacity - 1)), next];
      chatMessages = chatMessages.slice(-chatCapacity);
    }, 4000);

    chatResizeObserver = new ResizeObserver(() => updateChatCapacity());
    if (chatPanelElement) chatResizeObserver.observe(chatPanelElement);

    const cleanup = () => { disconnectSocket(); };
    const KeyDown = (event: KeyboardEvent) =>
    {
      handleKeyDown(event, keyboardState);
      updateInput(keyboardState, game.input);
      if (!(gameState && (gameState.status === "waiting" || gameState.status === "ready_check")))
        sendInput(socket, game.input);
    }
    const KeyUp = (event: KeyboardEvent) =>
    {
      handleKeyUp(event, keyboardState);
      updateInput(keyboardState, game.input);
      if (!(gameState && (gameState.status === "waiting" || gameState.status === "ready_check")))
        sendInput(socket, game.input);
    }
    await navReady;
    connectSocket(game);
    const Resize = () => updateScale(game);
    window.addEventListener('keydown',	KeyDown);
    window.addEventListener('keyup',	KeyUp);
    window.addEventListener('resize',	Resize);
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('pagehide', cleanup);
    document.addEventListener('visibilitychange', () =>
    {
      if (document.visibilityState === 'hidden' && socket)
        cleanup();
    });
    Resize();
    return () =>
    {
      if (chatInterval) clearInterval(chatInterval);
      window.removeEventListener('keydown', KeyDown);
      window.removeEventListener('keyup', KeyUp);
      window.removeEventListener('resize', Resize);
      window.removeEventListener('beforeunload', cleanup);
      window.removeEventListener('pagehide', cleanup);
      document.removeEventListener('visibilitychange', cleanup as EventListener);
      chatResizeObserver?.disconnect();
      cleanup();
    };
  })

  onDestroy(() =>
  {
    if (socket && socket.readyState === WebSocket.OPEN)
      socket.close();
  });

</script>

<main class="flex min-h-screen w-full bg-[#d9d9d9] text-[#111111] antialiased">

  <section class="flex min-h-screen flex-1 items-center justify-center" aria-label="Partie de Pong">
    <div class="flex w-full max-w-[1700px] flex-col items-center justify-center gap-4 px-2 py-4 md:flex-row lg:gap-8 xl:gap-10">
      <div class="min-w-0 w-full max-w-[420px] shrink-0 md:mr-[10px] md:max-w-[500px] lg:max-w-[560px] xl:max-w-[700px] lg:mr-[80px]">
        <div class="mb-2 flex items-center justify-center gap-3 border-[3px] border-[#111111] bg-[#ffffff] px-3 py-1.5 shadow-[3px_3px_0_#111111]" aria-label="Score">
          <span class="font-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#444444] sm:text-[0.8rem]">{leftPlayerLabel}</span>
          <strong id="score" class="min-w-[4.5rem] text-center font-mono text-sm font-extrabold text-[#111111] sm:text-base">0  -  0</strong>
          <span class="font-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#444444] sm:text-[0.8rem]">{rightPlayerLabel}</span>
        </div>
        <div class="mb-2 flex items-center justify-center gap-2 font-mono text-base font-bold uppercase tracking-[0.08em] text-[#111111]" aria-live="polite">
          <span class="h-[0.5rem] w-[0.5rem] rounded-full bg-[#2ecc71] shadow-[0_0_0_2px_#1f7d4d]"></span>
          <span id="game-status" class="text-center text-[clamp(1.2rem,3vw,2.1rem)] font-black leading-none tracking-[0.08em]">Connexion...</span>
        </div>

        <div id="realbackground" class="relative mx-auto w-full max-w-[420px] rounded-none border-[3px] border-[#111111] bg-[#d9d9d9] p-2 shadow-[4px_4px_0_#111111] sm:p-3 lg:max-w-[520px] xl:max-w-[620px]">
          <div class="relative w-full">
            <div class="pointer-events-none mb-2 flex justify-center">
              <div class="border border-[#111111] bg-[#f4f4f4] px-2 py-1 font-mono text-[0.6rem] font-bold uppercase tracking-[0.08em] text-[#111111] sm:text-[0.7rem]">{topPlayerLabel}</div>
            </div>

            <div id="terrain" class="relative h-full w-full overflow-hidden border-[3px] border-[#111111] bg-[#2d2d2d]" style="aspect-ratio: 65 / 73;">
              <div class="absolute left-[3%] right-[3%] top-1/2 border-t-[3px] border-dashed border-[#f4f4f4]/80"></div>
              <div class="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-[#f4f4f4]/80"></div>
              <div id="racketUp" class="absolute z-20 top-[1.7%] h-[1.35%] min-h-[6px] w-[12.3%] rounded-sm border-[2px] border-[#111111] shadow-[2px_2px_0_#111111]" style={topRacketStyle}></div>
              <div id="racketDown" class="absolute z-20 bottom-[1.7%] h-[1.35%] min-h-[6px] w-[12.3%] rounded-sm border-[2px] border-[#111111] shadow-[2px_2px_0_#111111]" style={bottomRacketStyle}></div>
              <div id="ball" class="absolute z-20 aspect-square w-[2.3%] rounded-sm border-[2px] border-[#111111] shadow-[2px_2px_0_#111111]" style={localBallSkinStyle}></div>
              <div id="where" class="absolute z-10 h-[3px] origin-left rounded-none bg-[#ff0000] shadow-[0_0_0.8rem_#ff0000]" style="display:none;"></div>

              {#if showReadyOverlay}
                <div class="absolute inset-0 z-30 grid place-items-center gap-3 bg-[linear-gradient(180deg,rgba(17,17,17,0.84),rgba(0,0,0,0.9))] p-4 text-center" aria-live="polite">
                  <p class="m-0 text-center font-mono text-xl font-black uppercase tracking-[0.08em] text-[#ffffff] sm:text-2xl">Ready check</p>
                  <p class="m-0 text-center font-mono text-sm text-[#f3f3f3] sm:text-base">
                    {#if !connected}
                      Connexion au serveur...
                    {:else if localReady}
                      En attente de l'autre joueur...
                    {:else}
                      Clique sur Ready pour signaler que tu es pret.
                    {/if}
                  </p>
                  {#if isReadyPhase}
                    <button
                      type="button"
                      class="min-h-[3rem] min-w-[9rem] border-[3px] border-[#111111] bg-[#ff0000] px-5 py-3 font-mono text-sm font-black uppercase text-[#ffffff] shadow-[3px_3px_0_#111111] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#111111] disabled:cursor-not-allowed disabled:opacity-70"
                      onclick={handleClickReady}
                      disabled={!connected || localReady}
                    >
                      {localReady ? 'My body is ready!' : 'Let\'s Get Ready To Rumble!'}
                    </button>
                  {/if}
                  {#if gameState}
                    <p class="m-0 font-mono text-[0.7rem] font-bold uppercase text-[#aaa8ef] sm:text-xs">
                      J1: {gameState.ready.p1 ? 'pret' : 'attente'} • J2: {gameState.ready.p2 ? 'pret' : 'attente'}
                    </p>
                  {/if}
                </div>
              {/if}
            </div>

            <div class="pointer-events-none mt-2 flex justify-center">
              <div class="border border-[#111111] bg-[#f4f4f4] px-2 py-1 font-mono text-[0.6rem] font-bold uppercase tracking-[0.08em] text-[#111111] sm:text-[0.7rem]">{bottomPlayerLabel}</div>
            </div>
          </div>
        </div>

        <div class="mt-2 flex w-full max-w-[420px] items-center justify-center gap-3 lg:max-w-[520px] xl:max-w-[620px]" aria-label="Commandes tactiles">
          <button
            type="button"
            aria-label="Deplacer a gauche"
            class="min-h-[2.9rem] flex-1 border-[3px] border-[#111111] bg-[#ff0000] px-3 py-2 font-mono text-sm font-black uppercase text-[#ffffff] shadow-[3px_3px_0_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#111111] lg:min-h-[3.4rem] lg:text-base xl:min-h-[3.8rem] xl:text-lg"
            onpointerdown={(event) => {
              event.preventDefault();
              onTouchMoveStart(event, -1);
            }}
            onpointerup={(event) => {
              event.preventDefault();
              onTouchMoveStop(event);
            }}
            onpointercancel={(event) => {
              event.preventDefault();
              onTouchMoveStop(event);
            }}
            onpointerleave={(event) => {
              event.preventDefault();
              onTouchMoveStop(event);
            }}
          >&lt; LEFT</button>
          <button
            type="button"
            aria-label="Deplacer a droite"
            class="min-h-[2.9rem] flex-1 border-[3px] border-[#111111] bg-[#ff0000] px-3 py-2 font-mono text-sm font-black uppercase text-[#ffffff] shadow-[3px_3px_0_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#111111] lg:min-h-[3.4rem] lg:text-base xl:min-h-[3.8rem] xl:text-lg"
            onpointerdown={(event) => {
              event.preventDefault();
              onTouchMoveStart(event, 1);
            }}
            onpointerup={(event) => {
              event.preventDefault();
              onTouchMoveStop(event);
            }}
            onpointercancel={(event) => {
              event.preventDefault();
              onTouchMoveStop(event);
            }}
            onpointerleave={(event) => {
              event.preventDefault();
              onTouchMoveStop(event);
            }}
          >RIGHT &gt;</button>
        </div>
      </div>

      <aside bind:this={chatPanelElement} class="flex h-[220px] w-full max-w-[420px] shrink-0 flex-col border-[3px] border-[#111111] bg-[#f5f5f5] p-2 shadow-[4px_4px_0_#111111] md:h-[420px] md:max-w-[270px] md:w-[270px] lg:h-[62vh] lg:min-h-[500px] lg:w-[32vw] lg:max-w-[520px] xl:h-[72vh] xl:min-h-[620px] xl:w-[34vw] xl:max-w-[620px]">
        <div class="mb-2 flex items-center justify-between border-b-[2px] border-[#111111] bg-[#e1e1e1] px-2 py-1 text-[0.55rem] font-black uppercase tracking-[0.14em] text-[#111111] lg:text-[0.75rem] xl:text-[0.9rem]">
          <span>Chat</span>
          <span class="text-[#ff0000]">LIVE ?</span>
        </div>

        <div class="flex-1 overflow-y-auto border-[2px] border-[#111111] bg-[#f7f7f7] p-2 lg:p-3 xl:p-4">
          <div class="flex h-full min-h-[150px] flex-col gap-2 xl:gap-3">
            {#if chatMessages.length}
              {#each chatMessages as message}
                <div class="border-[2px] border-[#111111] bg-[#ffffff] p-1.5 text-[0.56rem] font-bold uppercase tracking-[0.05em] text-[#111111] lg:text-[0.72rem] xl:text-[0.9rem]">
                  {message}
                </div>
              {/each}
            {:else}
              <div class="border-[2px] border-[#111111] bg-[#ffffff] p-2 text-[0.6rem] font-bold uppercase tracking-[0.08em] text-[#111111] lg:text-[0.7rem] xl:text-[0.9rem]">
                Waiting for chat...
              </div>
            {/if}
          </div>
        </div>
      </aside>
    </div>
  </section>
</main>

