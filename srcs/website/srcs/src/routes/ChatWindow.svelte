<script lang="ts">
    import { chatClient, openedChats } from "$lib/chat-client.svelte.ts";
	import usericon from '$lib/assets/user/default.svg';

	let { index, userId } = $props();
	let chatMessage:string = $state();
	let userNewChat:string = $state();
	let messagesBox:HTMLElement;

	const scrollToBottom = async (node) => {
		node.scroll({ top: node.scrollHeight, behavior: 'instant' });
	};

	$effect(() => {
		if (openedChats[index].update)
		{
			scrollToBottom(messagesBox);
			openedChats[index].update = false;
		}
    });

	function close() {
		openedChats.splice(index, 1);
	}
	function handleUsernameInput(event: any) {
		if (event.key === "Enter") {
			let isIn = false;
			openedChats.forEach((chat) => {
				if (chat.name === userNewChat)
					isIn = true;
			});
			if (isIn)
			{
				userNewChat = "";
				close();
			}
			else
				chatClient.checkUserExists(userNewChat, index);
		}
	}
	function handleChatInput(event: any) {
		if (event.key === "Enter" && !event.shiftKey && chatMessage != "" && openedChats[index].id != -1) {
			chatMessage = chatMessage.trim();
			if (chatMessage == "")
				return ;
			if (chatMessage.length > 2048)
			{
				chatMessage = "No.";
				return ;
			}
			chatClient.sendMessage(chatMessage, openedChats[index].id);
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
			{#if openedChats[index].id === -1}
			<div class="text-white">
				<span class="ml-[0.8rem] mr-[0.2rem]">À: </span>
				<span class="border-white border-[0.1rem] border-solid">
					<input class="send-message-field send-message-editor min-w-[9rem]" onkeydown={onKeyDown} onkeyup={handleUsernameInput} bind:value={userNewChat} data-no-scrollbar/>
				</span>
			</div>
			{#if openedChats[index].hasError}
			<p class="error">{openedChats[index].error}</p>
			{/if}
			{:else}
			<span class="flex shrink-0 text-[2.5rem] relative text-center">
				<img class="h-[30px] w-[30px]" src={openedChats[index].avatar != null?openedChats[index].avatar:usericon}>
			</span>
			<span class="ml-[1rem] items-center flex text-[1.4rem]">
				<a class="text-white">{openedChats[index].name}</a>
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
	<div class="basis-full grow-2 shrink overflow-hidden relative">
		<div class="h-full overflow-auto overscroll-y-contain" bind:this={messagesBox}>
			{#each openedChats[index].history as message}
				<div class="text-[1.3rem] relative rounded-lg m-[0.6rem] p-[0.5rem] break-all text-wrap whitespace-pre-wrap {userId === message.author?'bg-green-500 ml-[4rem]':'bg-yellow-400 mr-[4rem]'}">
					{message.message}
				</div>
			{/each}
		</div>
	</div>
	<div>
		<div class="border-t-[0.1rem] border-solid border-white flex max-w-full relative text-white">
			<textarea class="send-message-field send-message-editor" disabled={openedChats[index].id === -1} placeholder="Envoyer un message..." onkeydown={onKeyDown} onkeyup={handleChatInput} bind:value={chatMessage}></textarea>
		</div>
	</div>
</div>