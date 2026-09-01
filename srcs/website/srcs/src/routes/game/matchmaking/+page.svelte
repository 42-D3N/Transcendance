<script lang="ts">
  import { onMount } from 'svelte';
  import { initGameClient } from '$lib/game/frontend/pongVariables'
  import { connection, sendInput } from '$lib/game/backend/network'
  import { handleKeyDown, handleKeyUp, updateScale, updateInput, renderGameState } from '$lib/game/frontend/front1';

  let socket: WebSocket;

  function setMove(move: -1 | 0 | 1)
  {
    if (socket?.readyState !== WebSocket.OPEN)
      return;
    socket.send(JSON.stringify({ type: "input", input: { move, special: false } }));
  }

  onMount(() =>
  {// c2r7p6
    socket = new WebSocket("wss://localhost:8081/api/game_server");// ws://localhost:3310
    const game = initGameClient();
    let keyboardState = { left: false, right: false, special: false };

    const KeyDown = (event: KeyboardEvent) =>
    {
      handleKeyDown(event, keyboardState);
      updateInput(keyboardState, game.input);
      sendInput(socket, game.input);
    }
    const KeyUp = (event: KeyboardEvent) =>
    {
      handleKeyUp(event, keyboardState);
      updateInput(keyboardState, game.input);
      sendInput(socket, game.input);
    }
    connection(socket, state => renderGameState(game, state));
    const Resize = () => updateScale(game);
    window.addEventListener('keydown',	KeyDown);
    window.addEventListener('keyup',		KeyUp);
    window.addEventListener('resize', Resize);
    Resize();
    return () =>
    {
      window.removeEventListener('keydown', KeyDown);
      window.removeEventListener('keyup', KeyUp);
      window.removeEventListener('resize', Resize);
      socket.close();
    };
  })

</script>

<main class="pong-page">
  <section class="portal" aria-label="Partie de Pong">
    <div class="portal-topline">ARMORED ARCADE // ONLINE GAME ROOM // PLAYER 01</div>
    <header class="portal-header">
      <div class="brand-lockup">
        <div class="brand-mark">P</div>
        <div>
          <p class="eyebrow">THE CLASSIC BATTLE</p>
          <h1>PONG <span>ARENA</span></h1>
        </div>
      </div>
      <div class="scoreboard" aria-label="Score">
        <span class="player-label">PLAYER 1</span>
        <strong id="score">0  -  0</strong>
        <span class="player-label">PLAYER 2</span>
      </div>
    </header>

    <div class="portal-body">
      <aside class="side-panel left-panel">
        <span class="panel-title">GAME INFO</span>
        <div class="info-row"><span>MODE</span><b>ARCADE</b></div>
        <div class="info-row"><span>ROUND</span><b>01</b></div>
        <div class="pixel-divider"></div>
        <p class="tip">READY PLAYER ONE?</p>
        <p class="small-copy">Use the arrow keys or the buttons below to move your paddle.</p>
      </aside>

      <div class="game-column">
        <div class="status-line" aria-live="polite">
          <span class="status-dot"></span>
          <span id="game-status">Connexion...</span>
        </div>

        <div id="realbackground" class="board-frame">
          <div id="terrain" class="terrain">
            <div class="center-line"></div>
            <div class="center-mark"></div>
            <div id="racketUp" class="racket racket-up"></div>
            <div id="racketDown" class="racket racket-down"></div>
            <div id="ball" class="ball"></div>
            <div id="where" class="trajectory"></div>
          </div>
        </div>

        <div class="touch-controls" aria-label="Commandes tactiles">
          <button type="button" aria-label="Deplacer a gauche" onpointerdown={() => setMove(-1)} onpointerup={() => setMove(0)} onpointerleave={() => setMove(0)}>&lt; LEFT</button>
          <span>MOVE PADDLE</span>
          <button type="button" aria-label="Deplacer a droite" onpointerdown={() => setMove(1)} onpointerup={() => setMove(0)} onpointerleave={() => setMove(0)}>RIGHT &gt;</button>
        </div>
      </div>

      <aside class="side-panel right-panel">
        <span class="panel-title">STATUS</span>
        <div class="signal"><i></i><span>SERVER ONLINE</span></div>
        <div class="signal"><i></i><span>60 FPS LINK</span></div>
        <div class="pixel-divider"></div>
        <p class="tip">HIGH SCORE</p>
        <strong class="high-score">15 POINTS</strong>
      </aside>
    </div>
    <footer class="portal-footer">[ PONG ARENA ] &nbsp; BEST VIEWED IN FULL SCREEN &nbsp; // &nbsp; INSERT COIN: FREE PLAY</footer>
  </section>
</main>

<style>
  .pong-page {
    min-height: 100vh;
    width: 100%;
    box-sizing: border-box;
    display: grid;
    place-items: start center;
    padding: 0;
    background: #302e78;
    color: #fff8da;
    font-family: Verdana, Geneva, sans-serif;
  }

  .portal {
    width: 100%;
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 0;
    background: #302e78;
    border: 0;
    box-shadow: none;
  }

  .portal-topline, .portal-footer {
    display: none;
    background: #08081d;
    color: #aaa8ef;
    font: 700 1.2rem/1.2 monospace;
    letter-spacing: .08em;
    text-align: center;
  }

  .portal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: .35rem clamp(.8rem, 3vw, 2rem);
    background: linear-gradient(180deg, #45419e, #2c2a72);
    border-bottom: 3px solid #0b0b24;
  }

  .brand-lockup { display: flex; align-items: center; gap: .6rem; }
  .brand-mark {
    display: grid;
    place-items: center;
    width: 2.7rem;
    height: 2.7rem;
    color: #20204f;
    background: #f8dd45;
    border: 3px solid #10102e;
    box-shadow: 3px 3px 0 #10102e;
    font: 900 2rem/1 Georgia, serif;
    transform: rotate(-5deg);
  }

  .eyebrow {
    margin: 0 0 .25rem;
    color: #ffdf4b;
    font: 700 1.4rem/1 monospace;
    letter-spacing: .14em;
  }

  h1 {
    margin: 0;
    color: #fff8da;
    text-shadow: 3px 3px 0 #191846;
    font: 900 clamp(1.6rem, 5vw, 3.2rem)/.9 Georgia, serif;
    letter-spacing: 0;
  }

  h1 span { color: #ff668d; }

  .scoreboard {
    display: flex;
    align-items: center;
    gap: .7rem;
    padding: .45rem .7rem;
    border: 3px solid #111131;
    background: #171744;
    box-shadow: 3px 3px 0 #111131;
  }

  .scoreboard strong {
    min-width: 5rem;
    color: #ffdf4b;
    font: 800 1.2rem/1 monospace;
    text-align: center;
  }

  .player-label { color: #aaa8ef; font: 700 1.4rem/1 monospace; }
  .portal-body { display: grid; grid-template-columns: 20rem minmax(0, 1fr) 20rem; gap: clamp(.75rem, 1.5vw, 1.5rem); align-items: center; padding: clamp(.8rem, 2vw, 1.5rem) clamp(1rem, 2vw, 2rem); background: #302e78; }
  .game-column { min-width: 0; display: flex; flex-direction: column; align-items: center; }
  .side-panel { width: 100%; box-sizing: border-box; align-self: stretch; padding: .8rem .65rem; background: #211f5a; border: 2px solid #6b63bb; box-shadow: 3px 3px 0 #171642; }
  .panel-title { display: block; padding-bottom: .5rem; color: #ffdf4b; font: 900 1.6rem/1 monospace; border-bottom: 2px solid #ff668d; }
  .info-row { display: flex; justify-content: space-between; gap: .4rem; padding: .55rem 0; color: #aaa8ef; font: 1.4rem/1 monospace; }
  .info-row b, .high-score { color: #fff8da; }
  .pixel-divider { height: 5px; margin: .7rem 0; background: repeating-linear-gradient(90deg, #ff668d 0 5px, transparent 5px 9px); }
  .tip { color: #ff668d; font: 900 1.4rem/1.3 monospace; }
  .small-copy { color: #aaa8ef; font: 1.4rem/1.5 Verdana, sans-serif; }
  .signal { display: flex; gap: .4rem; align-items: center; padding: .55rem 0; color: #aaa8ef; font: 1.3rem/1 monospace; }
  .signal i, .status-dot { width: .55rem; height: .55rem; flex: 0 0 auto; border-radius: 50%; background: #62e6a8; box-shadow: 0 0 0 2px #235f55; }
  .high-score { display: block; font: 900 1.5rem/1 monospace; }
  .status-line { display: flex; align-items: center; gap: .5rem; margin-bottom: .6rem; color: #fff8da; font: 700 1.4rem/1 monospace; }

  .board-frame {
    width: min(100%, calc((100vh - 10rem) * .84));
    aspect-ratio: 65 / 73;
    padding: clamp(.45rem, 1.5vw, .8rem);
    background: #0b1722;
    border: 2px solid #111131;
    box-shadow: 3px 3px 0 #111131;
  }

  .terrain {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #123c52;
    border: 1px solid #5a9a9c;
  }

  .terrain::before, .terrain::after { content: ''; position: absolute; inset: 0; pointer-events: none; }
  .terrain::before { background: none; }
  .terrain::after { box-shadow: inset 0 0 2rem #06192388; }
  .center-line { position: absolute; top: 50%; left: 3%; right: 3%; border-top: 3px dashed #d2ffe777; }
  .center-mark { position: absolute; width: 5rem; height: 5rem; top: calc(50% - 2.5rem); left: calc(50% - 2.5rem); border: 2px solid #d2ffe755; border-radius: 50%; }
  .racket, .ball, .trajectory { position: absolute; z-index: 2; }
  .racket { width: 12.3%; height: 1.35%; min-height: 6px; background: #ffdf4b; border: 2px solid #9b641d; border-radius: 2px; box-shadow: 3px 3px 0 #172b36; }
  .racket-up { top: 1.7%; }
  .racket-down { bottom: 1.7%; }
  .ball { width: 2.3%; aspect-ratio: 1; background: #ff668d; border: 2px solid #8d3156; border-radius: 2px; box-shadow: 3px 3px 0 #172b36; }
  .trajectory { height: 3px; transform-origin: left center; background: #ffdf4b; box-shadow: 0 0 .8rem #ffdf4b; border-radius: 0; }
  .touch-controls { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: .9rem; color: #aaa8ef; font: 1.3rem/1 monospace; }
  .touch-controls button { min-height: 3.2rem; padding: 0 1rem; border: 3px solid #111131; background: #ff668d; color: #211f5a; box-shadow: 3px 3px 0 #111131; font: 900 1.4rem/1 monospace; touch-action: none; }
  .touch-controls button:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 #111131; }

  @media (min-width: 700px) { .touch-controls { display: none; } }
  @media (max-width: 760px) { .portal-body { grid-template-columns: 1fr; } .side-panel { display: none; } .board-frame { width: 100%; } }
  @media (max-width: 480px) { .pong-page { padding: .5rem; } .portal-header { align-items: flex-start; flex-direction: column; } .scoreboard { align-self: stretch; justify-content: center; } .portal-footer { font-size: .52rem; } }
</style>
