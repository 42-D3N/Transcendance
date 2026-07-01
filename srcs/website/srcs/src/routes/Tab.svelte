<script lang="ts">
	import "../app.css";
	let { name } = $props();
    let show = $state(false);
	let container:any;
	function onTabClick(e:any) {
		if (container.contains(e.target) == false)
			show = false;
	}
</script>

<svelte:window onclick={onTabClick} />

<div class="ft-sidebar-footing-icon" bind:this={container}>
	<button id={name+"-widget-button"} class="sidebar-link ft-button ft-button-small hover:bg-white/30 {(show)?"bg-white/30":""}" onclick={() => (show = !show)}>
		<span class="ft-icon-size-20 ft-icon-glyph">
			{#if name == "friends"}
				<svg width="20" height="20" viewBox="0 0 24 24" data-glyph="users" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M8 18V16.13C8 14.3 8.63 13.43 10.4 12.9L11.78 12.42C11.38 13.94 10.57 14.16 10.57 15.03C10.57 15.63 10.74 15.93 11.3 16.1L13.6 16.9C14.47 17.16 15.06 17.5 15.44 18H8ZM12.07 5.24C12.35 3.14 13.47 2 15.43 2C17.9 2 19 3.57 19 6.4C19 10 17.57 9.8 17.57 11.03C17.57 11.63 17.77 11.93 18.3 12.1L20.63 12.9C22.36 13.43 23 14.3 23 16.13V18H17.61C17.04 16.56 15.86 15.49 14.22 15L13.15 14.63C13.55 13.85 14.01 12.36 14.01 10.4C14.01 8.01 13.29 6.29 12.08 5.24H12.07ZM1 22V20.13C1 18.3 1.63 17.43 3.4 16.9L5.6 16.13C6.13 15.93 6.37 15.66 6.37 15.03C6.37 13.86 5 13.86 5 10.4C5 7.57 6.1 6 8.43 6C10.9 6 12 7.57 12 10.4C12 13.87 10.57 13.87 10.57 15.03C10.57 15.63 10.74 15.93 11.3 16.1L13.6 16.9C15.37 17.43 16 18.3 16 20.13V22H1Z"></path></svg>
			{:else if name == "chats"}
				<svg width="20" height="20" viewBox="0 0 24 24" data-glyph="message-envelope-fill" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M19.33 21H4.65999C2.24999 21 0.98999 19.75 0.98999 17.33V8.42997L9.75999 14.16C11.43 15.26 12.56 15.26 14.23 14.16L23 8.44997V17.33C23 19.74 21.75 21 19.33 21ZM1.03999 5.95997C1.25999 3.98997 2.48999 2.96997 4.66999 2.96997H19.34C21.52 2.96997 22.75 3.98997 22.97 5.95997L13.21 12.37C12.34 12.94 11.68 12.94 10.81 12.37L1.03999 5.95997Z"></path></svg>
			{:else if name == "settings"}
				<svg width="20" height="20" viewBox="0 0 24 24" data-glyph="utility-cogwheel" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M9.57 20.5298L8.4 21.7998C8.03 22.1998 7.73 22.2298 7.27 21.9698L5.74 21.0998C5.27 20.8298 5.17 20.5298 5.31 20.0298L5.84 18.3598C5.97 17.8598 5.94 17.4898 5.67 17.0298L4.5 14.9598C4.23 14.4898 3.93 14.2898 3.43 14.1598L1.7 13.7598C1.2 13.6298 1 13.3898 1 12.8598V11.0898C1 10.5898 1.2 10.3598 1.7 10.2198L3.43 9.81985C3.93 9.68985 4.23 9.48985 4.5 9.01985L5.67 6.94985C5.94 6.47985 5.97 6.11985 5.84 5.61985L5.31 3.94985C5.18 3.44985 5.28 3.14985 5.74 2.87985L7.27 2.00985C7.74 1.73985 8.04 1.77985 8.4 2.17985L9.57 3.44985C9.94 3.84985 10.27 3.97985 10.8 3.97985H13.23C13.73 3.97985 14.06 3.84985 14.43 3.44985L15.6 2.17985C15.97 1.77985 16.27 1.74985 16.73 2.00985L18.26 2.87985C18.73 3.14985 18.83 3.44985 18.69 3.94985L18.16 5.61985C18.03 6.11985 18.06 6.48985 18.33 6.94985L19.5 9.01985C19.77 9.48985 20.07 9.68985 20.57 9.81985L22.3 10.2198C22.8 10.3498 23 10.5898 23 11.0898V12.8598C23 13.3898 22.8 13.6298 22.3 13.7598L20.57 14.1598C20.07 14.2898 19.77 14.4898 19.5 14.9598L18.33 17.0298C18.06 17.4998 18.03 17.8598 18.16 18.3598L18.69 20.0298C18.82 20.5298 18.72 20.8298 18.26 21.0998L16.73 21.9698C16.26 22.2398 15.96 22.1998 15.6 21.7998L14.43 20.5298C14.06 20.1298 13.73 19.9998 13.23 19.9998H10.8C10.27 19.9998 9.93 20.1298 9.57 20.5298ZM12.03 15.4998C13.93 15.4998 15.53 13.9298 15.53 11.9698C15.53 10.0698 13.93 8.49985 12.03 8.49985C10.1 8.49985 8.53 10.0698 8.53 11.9698C8.53 13.9398 10.1 15.4998 12.03 15.4998Z"></path></svg>
			{/if}
		</span>
	</button>
	{#if show}
	<div id={name+"-widget-slot"} class="fixed max-xl:left-[52px] left-[8px] pl-[unset] box-content max-h-[calc(100svh - 2 * 0.8rem)] overflow-hidden w-[30rem] z-1 max-xl:bottom-[12px] bottom-[50px]">
		<div class="oveflow-hidden rounded-lg overscroll-contain box-border h-full cursor-default bg-black/50 text-white">
			<div class="p-0 h-full">
				<div class="grid h-[44rem]">
					{#if name == "friends"}
					<section>
						<div class="flex max-w-full">
							<button id="tab-friends" class="content-center items-center border-none box-border inline-flex flex-[1 1 0] h-[4.8rem] justify-center overflow-hidden flex-nowrap p-[1.2rem] cursor-pointer">
								<span class="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap ft-heading-xxx-small">Amis</span>
							</button>
							<button id="tab-requests" class="content-center items-center border-none box-border inline-flex flex-[1 1 0] h-[4.8rem] justify-center overflow-hidden flex-nowrap p-[1.2rem] cursor-pointer">
								<span class="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap ft-heading-xxx-small">Demandes</span>
							</button>
						</div>
					</section>
					{/if}
				</div>
			</div>
		</div>
	</div>
    {/if}
</div>