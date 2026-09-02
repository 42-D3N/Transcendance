<script>
  import { onMount } from 'svelte';

  let { message = '', duration = 5000, onClose } = $props();

  let visible = $state(true);
  let timer;

  function startTimer() {
    visible = true;

    clearTimeout(timer);

    timer = setTimeout(() => {
      visible = false;
      onClose?.();
    }, duration);
  }

  onMount(() => {
    startTimer();

    return () => clearTimeout(timer);
  });
</script>

{#if visible}
  <div class="popup">
    <span>{message}</span>

    <button
      type="button"
      onclick={() => {
        visible = false;
        onClose?.();
      }}
      aria-label="Close popup"
    >
      ×
    </button>
  </div>
{/if}

<style>
  .popup {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;

    display: flex;
    align-items: center;
    gap: 16px;

    padding: 12px 18px;
    background: #222;
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  button {
    border: none;
    background: transparent;
    color: white;
    font-size: 24px;
    cursor: pointer;
  }
</style>
