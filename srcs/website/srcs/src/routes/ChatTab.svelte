<script lang="ts">
	import "../app.css";
	import { activeChats, addEmptyChat, addChat } from '$lib/chat-client.svelte.ts';
	import usericon from '$lib/assets/user/default.svg';
	import { formatTime } from "$lib/common";
    let show = $state(false);
	let container:any;

	function onTabClick(e:any) {
		if (container.contains(e.target) == false)
			show = false;
	}
</script>

<svelte:window onclick={onTabClick} />

<div class="ft-sidebar-footing-icon" bind:this={container}>
	<button id="chats-widget-button" class="ft-button ft-button-small sidebar-link hover:bg-white/30 {(show)?"bg-white/30":""}" aria-label="Open chats window" onclick={() => (show = !show)}>
		<span class="ft-icon-size-20 ft-icon-glyph">
			<svg width="20" height="20" viewBox="0 0 24 24" data-glyph="message-envelope-fill" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M19.33 21H4.65999C2.24999 21 0.98999 19.75 0.98999 17.33V8.42997L9.75999 14.16C11.43 15.26 12.56 15.26 14.23 14.16L23 8.44997V17.33C23 19.74 21.75 21 19.33 21ZM1.03999 5.95997C1.25999 3.98997 2.48999 2.96997 4.66999 2.96997H19.34C21.52 2.96997 22.75 3.98997 22.97 5.95997L13.21 12.37C12.34 12.94 11.68 12.94 10.81 12.37L1.03999 5.95997Z"></path></svg>
		</span>
	</button>
	{#if show}
	<div id="chats-widget-slot" class="fixed max-xl:left-[52px] left-[8px] pl-[unset] box-content max-h-[calc(100svh - 2 * 0.8rem)] overflow-hidden w-[30rem] z-1 max-xl:bottom-[12px] bottom-[50px]">
		<div class="oveflow-hidden border-white border-[0.1rem] border-solid rounded-lg overscroll-contain box-border h-full cursor-default bg-black text-white">
			<div class="p-0 h-full">
				<div class="sidebar-widget-container">
					<section class="h-full overflow-x-hidden overflow-y-auto overscroll-contain pt-[0.8rem] pr-[0.8rem] pl-[0.8rem] pb-0">
						<div class="items-stretch flex flex-col h-full overscroll-contain">
							{#each activeChats as contact, index}
								<button class="chat-row-wrapper" onclick={() => addChat(index)}>
									<div class="ft-avatar-component ft-avatar-size-32">
										<img class="h-full w-full object-cover overscroll-contain" src={contact.avatar!= null?contact.avatar:usericon} alt="avatar de {contact.name}">
										<span class="status-indicator {contact.online?"bg-green-500":"bg-red-500"}"></span>
									</div>
									<div class="message-row-message overscroll-contain">
										<div class="message-row-row overscroll-contain">
											<div class="ft-user-block-component message-row-text overscroll-contain">
												<div>{contact.name}</div>
											</div>
											<p class="message-row-message-content text-small p-0 m-0 overscroll-contain">{formatTime(contact.time)}</p>
										</div>
										<div class="message-row-row overscroll-contain">
											<p class="text-left message-row-message-content text-small p-0 m-0 overscroll-contain">{contact.message}</p>
										</div>
									</div>
								</button>
							{/each}
						</div>
					</section>
					<footer class="items-center border-t-[0.1rem] border-white border-solid flex justify-between p-[0.8rem]">
						<button class="ft-button-small ft-button" onclick={addEmptyChat}>
							<span class="h-[1.6rem] w-[1.6rem] inline-grid place-content-center">
								<svg data-glyph="mark-plus" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="h-[1.6rem] w-[1.6rem]">
									<path fill="currentColor" d="m12.07 22h-.13c-1.6 0-1.93-.33-1.93-1.93v-6.07h-6.07c-1.6 0-1.93-.33-1.93-1.93v-.13c0-1.6.33-1.93 1.93-1.93h6.07v-6.07c0-1.6.33-1.93 1.93-1.93h.13c1.6 0 1.93.33 1.93 1.93v6.07h6.07c1.6 0 1.93.33 1.93 1.93v.13c0 1.6-.33 1.93-1.93 1.93h-6.07v6.07c0 1.6-.33 1.93-1.93 1.93zm0 0"></path>
								</svg>
							</span>
							<span>Nouveau chat</span>
						</button>
					</footer>
				</div>
			</div>
		</div>
	</div>
    {/if}
</div>