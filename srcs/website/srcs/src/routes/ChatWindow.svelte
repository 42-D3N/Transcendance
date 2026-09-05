<script lang="ts">
    import { chatClient } from "$lib/chat-client.svelte.ts";

	let { chat, index } = $props();
	let avatar:string = "https://www.chess.com/bundles/web/images/noavatar_l.84a92436.gif";
	let chatMessage:string = $state();
	let userNewChat:string = $state();

	function close() {
		chat.splice(index, 1);
	}
	function handleUsernameInput(event: any) {
		if (event.key === "Enter")
			chatClient.checkUserExists(userNewChat, index);
	}
	function handleChatInput(event: any) {
		if (event.key === "Enter" && chatMessage != "" && chat[index].id != -1) {
			chatClient.sendMessage(chatMessage, chat[index].name);
			chatMessage = "";
		}
	}
	function onKeyDown(event: any) {
		return event.keyCode != 13;
	}
</script>

<div class="h-[332px] w-[350px] ml-[0.5rem] flex flex-col relative bg-black/50">
	<div class="items-start flex basis-[3rem] grow shrink-0 justify-between relative">
		<div class="rounded-tl-sm items-center flex overflow-hidden text-ellipsis whitespace-nowrap">
			{#if chat[index].id === -1}
			<div>
				<span></span>
				<span>
					<input class="send-message-field send-message-editor" onkeydown={onKeyDown} onkeyup={handleUsernameInput} bind:value={userNewChat} data-no-scrollbar/>
				</span>
			</div>
			{#if chat[index].hasError}
			<p class="error">{chat[index].error}</p>
			{/if}
			{:else}
			<span class="flex shrink-0 text-[2.5rem] relative text-center">
				<img class="h-[30px] w-[30px]" src={avatar}>
			</span>
			<span class="ml-[1rem] items-center flex text-[1.4rem]">
				<a class="text-white">{chat[index].name}</a>
			</span>
			{/if}
		</div>
		<div class="flex g-[0.2rem] whitespace-nowrap">
			<button class="ft-icon-button ft-icon-button-small" onclick={close}>
				<span class="h-[2rem] w-[2rem] place-content-center inline-grid">
					<svg data-glyph="mark-cross" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="h-[2rem] w-[2rem]">
						<path fill="currentColor" d="m6.1 20.77c-1.13 1.13-1.6 1.13-2.73 0l-.13-.13c-1.13-1.13-1.13-1.6 0-2.73l5.97-5.9-5.97-6c-1.13-1.13-1.13-1.6 0-2.73l.13-.1c1.13-1.13 1.6-1.13 2.73 0l5.93 6 5.93-5.97c1.13-1.13 1.6-1.13 2.73 0l.13.13c1.13 1.13 1.13 1.6 0 2.73l-5.97 5.93 5.8 5.9c1.13 1.13 1.13 1.6 0 2.73l-.1.13c-1.13 1.13-1.6 1.13-2.73 0l-5.8-5.93zm0 0"></path>
					</svg>
				</span>
			</button>
		</div>
	</div>
	<div class="basis-full grow-2 shrink overflow-hidden relative"></div>
	<div>
		<div class="border-t-[0.1rem] border-solid border-white flex max-w-full relative">
			<div class="send-message-field send-message-editor" data-placeholder="Envoyer un message..." contenteditable="true" onkeydown={onKeyDown} onkeyup={handleChatInput} bind:innerText={chatMessage} data-no-scrollbar></div>
		</div>
	</div>
</div>