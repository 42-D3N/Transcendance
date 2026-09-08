<script>
  import { onMount } from 'svelte';

  let {
    message = '',
    image = '',
    duration = 5000,
    onClose,
    class: customClass = ''
  } = $props();

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
  {#if customClass !== ''}
  <div class={customClass}>
        {#if image}
      <img
        src={image}
        alt=""
        class="h-40 w-full object-cover"
      />
    {/if}
    <div class="flex items-center gap-4 p-4">
      <span>{message}</span>

      <button
        type="button"
        class="cursor-pointer text-2xl text-black"
        onclick={() => {
          visible = false;
          onClose?.();
        }}
      >
        ⨯
      </button>
    </div>
  </div>
  {:else}
  <div class="fixed top-5 left-1/2 z-[1000] -translate-x-1/2 overflow-hidden rounded-xl text-white shadow-xl">
    {#if image}
      <img
        src={image}
        alt=""
        class="h-40 w-full object-cover"
      />
    {/if}

    <div class="flex items-center gap-4 p-4">
      <span>{message}</span>

      <button
        type="button"
        class="cursor-pointer text-2xl text-black"
        onclick={() => {
          visible = false;
          onClose?.();
        }}
      >
        ⨯
      </button>
    </div>
  </div>
  {/if}
{/if}
