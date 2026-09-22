<script lang="ts">
	let displayNav = $state(false);
	import usericon from '$lib/assets/user/default.svg';
	import favicon from '$lib/assets/image_convertie.svg';
	import homeicon from '$lib/assets/home_icon.svg';
	import gameicon from '$lib/assets/game_icon.svg';
	import profileicon from '$lib/assets/profile_icon.svg';
	import api_down from '$lib/assets/api_download.svg';
	import shopicon from '$lib/assets/shop_icon.svg';

	let screenSize:number = $state();
	let sidebar:any;
	let header:any;
	let mobileSpace:any;
	let chatsContainer:any = $state();

	import { redirect } from '@sveltejs/kit';
	import { browser } from "$app/environment";
	import { chatClient, openedChats, activeChats, addEmptyChat, addChat, updateChatLimit } from '$lib/chat-client.svelte.ts';
	import { formatTime } from "$lib/common";

	$effect(() => {
        if (!browser) return;

        if (data.Token != -1)
            chatClient.connect(data.Token, data.id);
        else
            chatClient.disconnect();
    });

	let { data, children } = $props();

	let mobToolbarEnabled:boolean = $state(false);
	import "../app.css";
	import ChatTab from './ChatTab.svelte';
    import ChatWindow from './ChatWindow.svelte';
	function disableScroll() {
		document.querySelector('body')?.classList.add('overflow-hidden');
		document.querySelector('body')?.classList.add('h-full');
		document.querySelector('html')?.classList.add('overflow-hidden');
		document.querySelector('html')?.classList.add('h-full');
	}
	function enableScroll() {
		document.querySelector('body')?.classList.remove('overflow-hidden');
		document.querySelector('body')?.classList.remove('h-full');
		document.querySelector('html')?.classList.remove('overflow-hidden');
		document.querySelector('html')?.classList.remove('h-full');
	}
	function enableSidebar() {
		displayNav = true;
		disableScroll();
		mobToolbarEnabled = false;
	}
	function disableSidebar() {
		displayNav = false;
		enableScroll();
	}
	function buttonClick() {
		if (!mobToolbarEnabled)
			disableScroll();
		else
			enableScroll();
		mobToolbarEnabled = !mobToolbarEnabled;
	}
	function onClick(e:any) {
		if (displayNav && ((sidebar.contains(e.target) == false && header.contains(e.target) == false) || mobToolbarEnabled))
		{
			displayNav = false;
			if (!mobToolbarEnabled)
				enableScroll();
		}
		if (data.Token !== '-1' && chatsContainer.contains(e.target) == false && mobileSpace.contains(e.target) == false && header.contains(e.target) == false)
		{	
			mobToolbarEnabled = false;
			enableScroll();
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon}/>
	<title>ft_old_internet</title>
</svelte:head>

<svelte:window onclick={onClick} bind:innerWidth={screenSize} onresize={() => (updateChatLimit(Math.max(Math.floor(screenSize / 350), 1)))}/>

<div id="sidebar" class="lg:left-0 lg:fixed lg:z-100">
	<div class="opened-chats-container">
		{#each openedChats as chat, i (chat.id)}
		<ChatWindow index={i} userId={data.id}/>
		{/each}
	</div>
	<div class="mobile-shroud-sidebar {(!displayNav)?"hidden":""}"></div>
	<nav id="sidebar-main-menu" class="ft-sidebar-main-menu flex {(!displayNav)?"max-lg:hidden":""}" bind:this={sidebar} data-sveltekit-reload>
		<a href="/" class="logo-link">
			<img alt="logo" class="col-span-full" src={favicon} height="160px" width="160px"/>
		</a>
		<div id="sidebar-menus-buttons" class="sidebar-buttons-box min-h-0 overflow-hidden shrink h-full">
			<a class="ft-button ft-button-medium sidebar-link hover:bg-[#333131FF]" href="/">
				<img class="ft-icon-img ft-icon-size-24" src={homeicon} alt="icon"/>
				<span class="ft-sidebar-link-text text-2xl/tight text-white">Home</span>
			</a>
			<a class="ft-button ft-button-medium sidebar-link hover:bg-[#333131FF]" href="/game">
				<img class="ft-icon-img ft-icon-size-24" src={gameicon} alt="icon"/>
				<span class="ft-sidebar-link-text text-2xl/tight text-white">Game</span>
			</a>
			<a class="ft-button ft-button-medium sidebar-link hover:bg-[#333131FF]" href="/user/profile">
				<img class="ft-icon-img ft-icon-size-24" src={profileicon} alt="icon"/>
				<span class="ft-sidebar-link-text text-2xl/tight text-white">Profile</span>
			</a>
			<a class="ft-button ft-button-medium sidebar-link hover:bg-[#333131FF]" href="/shop">
				<img class="ft-icon-img ft-icon-size-24" src={shopicon} alt="icon"/>
				<span class="ft-sidebar-link-text text-2xl/tight text-white">Shop</span>
			</a>
		</div>
		<hr class="mt-auto border-none">
		<!-- FULL SCREEN -->
		{#if data.Token === '-1'}
		<div id="sidebar-login-buttons" class="sidebar-buttons-box gap-[1.2rem] mt-[1.2rem]">
			<a id="signup-button" class="ft-button ft-button-medium sidebar-link sidebar-collapse-icon bg-[#1A8A35FF] hover:bg-[#27B849FF]" href="/sign_in">
				<span class="content-center h-8 w-8 xl:hidden max-lg:hidden">
					<svg width="20" height="20" viewBox="0 0 24 24" data-glyph="user-badge-plus" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M0 20.0301C0 18.0301 0.63 17.1301 2.47 16.4001L3.97 15.8001C6.84 14.6701 7.2 14.4301 7.2 13.6701C7.2 11.3701 5.37 11.3701 5.37 7.40008C5.37 4.23008 6.84 1.83008 9.94 1.83008C13.17 1.83008 14.64 4.23008 14.64 7.40008C14.64 7.73008 14.63 8.04008 14.6 8.32008C10.78 9.36008 8.01 12.8301 8.01 17.0001C8.01 18.8601 8.56 20.5701 9.51 22.0001H0.0100002L0 20.0301ZM17 23.9701C13.2 23.9701 10.03 20.8001 10.03 17.0001C10.03 13.1701 13.2 10.0301 17 10.0301C20.83 10.0301 23.97 13.1601 23.97 17.0001C23.97 20.8001 20.84 23.9701 17 23.9701ZM15.97 21.0301C15.97 21.6601 16.3 22.0001 16.9 22.0001H17C17.63 22.0001 17.97 21.6701 17.97 21.0701V18.0001H21.07C21.67 18.0001 22 17.6701 22 17.0301V16.9301C22 16.3301 21.67 16.0001 21.03 16.0001H17.96V12.9701C17.96 12.3401 17.63 12.0001 17.03 12.0001H16.93C16.3 12.0001 15.96 12.3301 15.96 12.9301V16.0001H12.93C12.33 16.0001 12 16.3301 12 16.9701V17.0701C12 17.6701 12.33 18.0001 12.97 18.0001H15.97V21.0301Z"></path></svg>
				</span>
				<span class="lg:max-xl:hidden">Sign up</span>
			</a>
			<a id="login-button" class="ft-button ft-button-medium sidebar-link sidebar-collapse-icon bg-zinc-700 hover:bg-neutral-500" href="/login">
				<span class="content-center h-8 w-8 xl:hidden max-lg:hidden">
					<svg width="20" height="20" viewBox="0 0 24 24" data-glyph="arrow-triangle-enter-right" class="rtl-support" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M13.33 7.67L17.2 11.54C17.53 11.87 17.53 12.14 17.2 12.47L13.33 16.34C12.63 17.04 12.33 16.94 12.33 15.91V8.11C12.33 7.08 12.6 6.94 13.33 7.68V7.67ZM0.83 10.5L13.96 10.53V13.5H0.83C0.23 13.5 0 13.2 0 12.43V11.56C0 10.79 0.23 10.49 0.83 10.49V10.5ZM6 2H18C20.47 2 22 3.53 22 6V18C22 20.47 20.47 22 18 22H6C3.53 22 2 20.47 2 18V16.9C2 16.3 2.33 15.97 2.93 15.97H3.06C3.66 15.97 3.99 16.3 3.99 16.9V17.6C3.99 19.6 4.39 20 6.39 20H17.59C19.59 20 19.99 19.6 19.99 17.6V6.4C19.99 4.4 19.59 4 17.59 4H6.39C4.39 4 3.99 4.4 3.99 6.4V7.03C3.99 7.63 3.66 7.96 3.06 7.96H2.93C2.33 7.96 2 7.63 2 7.03V6C2 3.53 3.53 2 6 2Z"></path></svg>
				</span>
				<span class="lg:max-xl:hidden">Log in</span>
			</a>
		</div>
		{:else}
		<a class="ft-user-profile-button" href="/user/profile">
			<img class="ft-user-avatar" src={!data.icon?usericon:data.icon} alt="your avatar"/>
			<div id="user-info-container">	
				<span class="lg:max-xl:hidden text-white">{data.username.length < 10?data.username:(data.username.slice(0, 7)+"...")}</span><br/>
				<span class="content-center w-5 text-lg hidden xl:block text-white">W: {data.wallet <= 9999?data.wallet:JSON.stringify(data.wallet).slice(0,4) + ".."}$</span>
			</div>
		</a>
		<div class="sidebar-footer-icons mobile-hidden">
			<ChatTab/>
			<div class="ft-sidebar-footing-icon">
				<a class="ft-button ft-button-small sidebar-link hover:bg-white/30" href="/docs/api_doc.pdf">
					<span class="ft-icon-size-20 ft-icon-glyph">
						<img src={api_down} alt="api download doc">
					</span>
				</a>
			</div>
			<div class="ft-sidebar-footing-icon">
				<a class="ft-button ft-button-small sidebar-link hover:bg-white/30" href="/user/logout" aria-label="Log out" data-sveltekit-reload>
					<span class="ft-icon-size-20 ft-icon-glyph">
						<svg width="20" height="20" viewBox="0 0 24 24" data-glyph="local-door-left-exit" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M4.93,16.37 l-4.47,-3.93 c-0.33,-0.3,-0.33,-0.57,0,-0.87 l4.47,-3.93 c0.77,-0.7,1.07,-0.57,1.07,0.47 l0,7.8 c0,1.03,-0.3,1.17,-1.07,0.47 Z M15.13,13.5 l-10.77,-0.03 l0,-2.97 l10.77,0 c0.6,0,0.83,0.3,0.83,1.07 l0,0.87 c0,0.77,-0.23,1.07,-0.83,1.07 Z M10.0,15.43 l0.0,3.9 c0.0,0.67,0.0,0.67,0.67,0.67 l5.3,0.0 l0,2.0 l-5.3,0 c-2.0,0.0,-2.67,-0.67,-2.67,-2.67 l0,-3.9 Z M19.23,20.0 l2.07,-0.03 c0.7,-0.01,0.7,-0.01,0.7,-0.7 l0,-14.6 c-0.0,-0.67,-0.0,-0.67,-0.67,-0.67 l-10.67,-0.0 c-0.67,0.0,-0.67,0.0,-0.67,0.67 l-0.0,3.9 l-2.0,0 l0,-3.9 c0,-2.0,0.67,-2.67,2.67,-2.67 l10.67,0 c2.0,0,2.67,0.67,2.67,2.67 l0,14.6 c0,2.0,-0.67,2.67,-2.67,2.7 l-2.07,0.03 Z M22.67,22.53 l-3.33,1.27 c-0.97,0.4,-1.33,0.13,-1.33,-0.9 l0,-15.47 c0,-1.03,0.37,-1.57,1.33,-1.97 l2.17,-0.83 c1.87,-0.73,2.5,-0.3,2.5,1.7 l0,14.23 c0,1.03,-0.37,1.57,-1.33,1.97 Z M22.67,22.53"></path></svg>
					</span>
				</a>
			</div>
		</div>
		{/if}
		<footer class="px-2 py-2">
			<div class="mx-auto flex w-fit flex-col items-center gap-1 rounded-lg border border-white bg-black/20 px-3 py-2 text-xs xl:flex-row xl:gap-3" >
				<a href="/ToS" class="text-white/70 transition-colors duration-200 hover:text-white" > ToS </a>
				<span class="h-px w-5 bg-white/40 xl:h-3 xl:w-px" aria-hidden="true" ></span>
				<a href="/pp" class="text-white/70 transition-colors duration-200 hover:text-white" > PP </a>
			</div>
		</footer>
	</nav>
</div>
<!-- MOBILE -->
<div class="flex flex-col min-h-dvh">
	<header id="mobile-header" class="bg-[#333131FF] lg:hidden left-0 right-0 top-0 sticky z-100" bind:this={header} data-sveltekit-reload>
		<div class="flex flex-row items-center justify-between py-[0.8rem] px-[0.4rem]">
			<div id="mobile-header-left" class="flex flex-row items-center gap-[0.8rem]">
				<button aria-label="Menu button" type="button" onclick={enableSidebar} class="grid h-[3.2rem] w-[3.2rem] p-[unset] place-items-center cursor-pointer {displayNav?"hidden":""}">
					<svg fill="gray" width="24" height="24" viewBox="0 0 24 24" data-glyph="mark-menu" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
						<path d="M20.07 6.00001H3.94001C2.34001 6.00001 2.01001 5.67001 2.01001 4.07001V3.94001C2.01001 2.34001 2.34001 2.01001 3.94001 2.01001H20.07C21.67 2.01001 22 2.34001 22 3.94001V4.07001C22 5.67001 21.67 6.00001 20.07 6.00001ZM20.07 22H3.94001C2.34001 22 2.01001 21.67 2.01001 20.07V19.94C2.01001 18.34 2.34001 18.01 3.94001 18.01H20.07C21.67 18.01 22 18.34 22 19.94V20.07C22 21.67 21.67 22 20.07 22ZM20.07 14H3.94001C2.34001 14 2.01001 13.67 2.01001 12.07V11.94C2.01001 10.34 2.34001 10.01 3.94001 10.01H20.07C21.67 10.01 22 10.34 22 11.94V12.07C22 13.67 21.67 14 20.07 14Z"></path>
					</svg>
				</button>
				<button aria-label="Close menu" type="button" onclick={disableSidebar} class="grid h-[3.2rem] w-[3.2rem] p-[unset] place-items-center cursor-pointer {(!displayNav)?"hidden":""}">
					<svg width="24" height="24" viewBox="0 0 24 24" data-glyph="mark-menu" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
						<path d="M6.10008 20.77C4.97008 21.9 4.50008 21.9 3.37008 20.77L3.24008 20.64C2.11008 19.51 2.11008 19.04 3.24008 17.91L9.21008 12.01L3.24008 6.01002C2.11008 4.88002 2.11008 4.41002 3.24008 3.28002L3.37008 3.18002C4.50008 2.05002 4.97008 2.05002 6.10008 3.18002L12.0301 9.18002L17.9601 3.21002C19.0901 2.08002 19.5601 2.08002 20.6901 3.21002L20.8201 3.34002C21.9501 4.47002 21.9501 4.94002 20.8201 6.07002L14.8501 12L20.6501 17.9C21.7801 19.03 21.7801 19.5 20.6501 20.63L20.5501 20.76C19.4201 21.89 18.9501 21.89 17.8201 20.76L12.0201 14.83L6.10008 20.77Z"></path>
					</svg>
				</button>
				<a href="/" class="flex">
					<img alt="logo" src={favicon} width="26.75px"/>
				</a>
			</div>
			{#if data.Token === '-1'}
			<div id="mobile-header-auth" class="flex flex-row items-center gap-[0.8rem]">
				<a class="ft-button ft-button-small bg-green-500" href="/sign_in"><span>Sign Up</span></a>
				<a class="ft-button ft-button-small bg-gray-500" href="/login"><span>Log In</span></a>
			</div>
			{:else}
			<div id="mobile-header-buttons" class="flex place-items-center">
				<div class="mobile-toolbar-action" bind:this={chatsContainer}>
					<button id="chats-widget-button" aria-label="Chats" class="mobile-toolbar-action-button ft-button ft-button-small hover:bg-white/30 {mobToolbarEnabled?"bg-white/30":""}" onclick={() => buttonClick()}>
						<span class="ft-icon-size-20 ft-icon-glyph">
							<svg width="20" height="20" viewBox="0 0 24 24" data-glyph="message-envelope-fill" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M19.33 21H4.65999C2.24999 21 0.98999 19.75 0.98999 17.33V8.42997L9.75999 14.16C11.43 15.26 12.56 15.26 14.23 14.16L23 8.44997V17.33C23 19.74 21.75 21 19.33 21ZM1.03999 5.95997C1.25999 3.98997 2.48999 2.96997 4.66999 2.96997H19.34C21.52 2.96997 22.75 3.98997 22.97 5.95997L13.21 12.37C12.34 12.94 11.68 12.94 10.81 12.37L1.03999 5.95997Z"></path></svg>
						</span>
					</button>
				</div>
				<div class="mobile-toolbar-action">
					<a class="ft-button ft-button-small sidebar-link hover:bg-white/30" href="/docs/api_doc.pdf" download="api_doc.pdf">
						<span class="ft-icon-size-20 ft-icon-glyph">
							<img src={api_down} alt="api download doc">
						</span>
					</a>
				</div>
				<div class="mobile-toolbar-action">
					<a id="logout-widget-button" aria-label="Log out" class="mobile-toolbar-action-button ft-button ft-button-small hover:bg-white/30" href="/user/logout" data-sveltekit-reload>
						<span class="ft-icon-size-20 ft-icon-glyph">
							<svg width="20" height="20" viewBox="0 0 24 24" data-glyph="local-door-left-exit" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M4.93,16.37 l-4.47,-3.93 c-0.33,-0.3,-0.33,-0.57,0,-0.87 l4.47,-3.93 c0.77,-0.7,1.07,-0.57,1.07,0.47 l0,7.8 c0,1.03,-0.3,1.17,-1.07,0.47 Z M15.13,13.5 l-10.77,-0.03 l0,-2.97 l10.77,0 c0.6,0,0.83,0.3,0.83,1.07 l0,0.87 c0,0.77,-0.23,1.07,-0.83,1.07 Z M10.0,15.43 l0.0,3.9 c0.0,0.67,0.0,0.67,0.67,0.67 l5.3,0.0 l0,2.0 l-5.3,0 c-2.0,0.0,-2.67,-0.67,-2.67,-2.67 l0,-3.9 Z M19.23,20.0 l2.07,-0.03 c0.7,-0.01,0.7,-0.01,0.7,-0.7 l0,-14.6 c-0.0,-0.67,-0.0,-0.67,-0.67,-0.67 l-10.67,-0.0 c-0.67,0.0,-0.67,0.0,-0.67,0.67 l-0.0,3.9 l-2.0,0 l0,-3.9 c0,-2.0,0.67,-2.67,2.67,-2.67 l10.67,0 c2.0,0,2.67,0.67,2.67,2.67 l0,14.6 c0,2.0,-0.67,2.67,-2.67,2.7 l-2.07,0.03 Z M22.67,22.53 l-3.33,1.27 c-0.97,0.4,-1.33,0.13,-1.33,-0.9 l0,-15.47 c0,-1.03,0.37,-1.57,1.33,-1.97 l2.17,-0.83 c1.87,-0.73,2.5,-0.3,2.5,1.7 l0,14.23 c0,1.03,-0.37,1.57,-1.33,1.97 Z M22.67,22.53"></path></svg>
						</span>
					</a>
				</div>
			</div>
			{/if}
		</div>
		<div id="mobile-toolbar-mount-point" class="left-0 right-0 absolute top-full" bind:this={mobileSpace}>
		{#if mobToolbarEnabled}
			<div class="rounded-none overflow-auto overscroll-contain bg-black/50 text-white">
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
												<p class="message-row-message-content text-small p-0 m-0 overscroll-contain">{contact.message}</p>
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
		{/if}
		</div>
	</header>
	{@render children()}
</div>

