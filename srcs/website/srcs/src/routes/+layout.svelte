<script lang="ts">
	let displayNav = $state(false);
	import usericon from '$lib/assets/user/default.svg';
	import favicon from '$lib/assets/favicon.svg';
	import homeicon from '$lib/assets/home_icon.svg';
	import gameicon from '$lib/assets/game_icon.svg';
	import profileicon from '$lib/assets/profile_icon.svg';
	import setticon from '$lib/assets/settings_icon.svg';
	import shopicon from '$lib/assets/shop_icon.svg';

	let sidebar:any;
	let header:any;
	let mobileSpace:any;
	let friendsContainer:any;
	let chatsContainer:any;
	let settingsContainer:any;
	import { redirect } from '@sveltejs/kit';

	let { data, children } = $props();

	let mobToolbarEnabled = $state("none");
	import "../app.css";
    import { GridBlock } from '@babylonjs/core';
	import SidebarTab from './SidebarTab.svelte';
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
		mobToolbarEnabled = "none";
	}
	function disableSidebar() {
		displayNav = false;
		enableScroll();
	}
	function buttonClick(button:any) {
		if (mobToolbarEnabled !== button)
		{
			disableScroll();
			mobToolbarEnabled = button;
		}
		else
		{
			enableScroll();
			mobToolbarEnabled = "none";
		}
	}
	function onClick(e:any) {
		if (displayNav && ((sidebar.contains(e.target) == false && header.contains(e.target) == false) || mobToolbarEnabled !== "none"))
		{
			displayNav = false;
			if (mobToolbarEnabled === "none")
				enableScroll();
		}
		if (data.Token !== '-1' && friendsContainer.contains(e.target) == false && chatsContainer.contains(e.target) == false && settingsContainer.contains(e.target) == false && mobileSpace.contains(e.target) == false && header.contains(e.target) == false)
		{	
			mobToolbarEnabled = "none";
			enableScroll();
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>ft_old_internet</title>
</svelte:head>

<svelte:window onclick={onClick} />

<div id="sidebar" class="lg:left-0 lg:fixed lg:z-100">
	<div id="opened-chats-container"></div>
	<div id="mobile-shroud-sidebar" class="lg:hidden {(!displayNav)?"hidden":""} inset-0 fixed z-2 bg-black/30"></div>
	<nav id="sidebar-main-menu" class="flex max-lg:fixed flex-col h-svh max-lg:h-[unset] max-lg:top-19 px-[0.8rem] pt-[0.8rem] pb-[1.2rem] max-lg:bottom-0 w-68 lg:max-xl:w-[5.6rem] bg-[#292626FF] max-lg:z-100 max-lg:{(!displayNav)?"hidden":""}" bind:this={sidebar} data-sveltekit-reload>
		<a href="/" class="items-center grid gap-[1.2rem] relative max-lg:hidden w-full">
			<img alt="logo" class="col-span-full" src={favicon} height="120px" width="120px"/>
		</a>
		<div id="sidebar-menus-buttons" class="min-h-0 overflow-hidden shrink">
			<div class="items-stretch flex flex-col h-full">
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
				<a class="ft-button ft-button-medium sidebar-link hover:bg-[#333131FF]" href="/settings">
					<img class="ft-icon-img ft-icon-size-24" src={setticon} alt="icon"/>
					<span class="ft-sidebar-link-text text-2xl/tight text-white">Settings</span>
				</a>
			</div>
		</div>
		<hr class="mt-auto border-none">
		{#if data.Token === '-1'}
		<div id="sidebar-login-buttons" class="items-stretch flex flex-col gap-[1.2rem] mt-[1.2rem]">
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
		<a class="flex justify-around gap-[0.4rem] text-left items-center overflow-visible relative whitespace-nowrap w-full break-unset border-0 text-[1.4rem]/1.1428 p-[0.8rem] rounded-lg bg-[#292626FF] hover:bg-[#333131FF]" href="/user/profile">
			{#if !data.icon}
				<img class="upload block lg:h-[3.6rem] lg:w-[3.6rem] h-[3.6rem] w-[3.6rem] border-solid rounded-md bg-amber-50" src={usericon} alt=""/>
			{:else}
				<img class="upload block lg:h-[3.6rem] lg:w-[3.6rem] h-[3.6rem] w-[3.6rem] border-solid rounded-md bg-amber-50" src={data.icon} alt={data.icon}/>
			{/if}
			<div id="user-info-container">	
				<span class="lg:max-xl:hidden text-white">{data.username}</span><br>
				<span class="content-center w-5 text-lg hidden xl:block text-white">wallet: {data.wallet}</span>
			</div>
		</a>
		<div class="sidebar-footer-icons mobile-hidden">
			<SidebarTab name="friends"/>
			<SidebarTab name="chats"/>
			<SidebarTab name="settings"/>
			<div class="ft-sidebar-footing-icon">
				<a class="ft-button ft-button-small sidebar-link hover:bg-white/30" href="/user/logout">
					<span class="ft-icon-size-20 ft-icon-glyph">
						<svg width="20" height="20" viewBox="0 0 24 24" data-glyph="local-door-left-exit" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M4.93,16.37 l-4.47,-3.93 c-0.33,-0.3,-0.33,-0.57,0,-0.87 l4.47,-3.93 c0.77,-0.7,1.07,-0.57,1.07,0.47 l0,7.8 c0,1.03,-0.3,1.17,-1.07,0.47 Z M15.13,13.5 l-10.77,-0.03 l0,-2.97 l10.77,0 c0.6,0,0.83,0.3,0.83,1.07 l0,0.87 c0,0.77,-0.23,1.07,-0.83,1.07 Z M10.0,15.43 l0.0,3.9 c0.0,0.67,0.0,0.67,0.67,0.67 l5.3,0.0 l0,2.0 l-5.3,0 c-2.0,0.0,-2.67,-0.67,-2.67,-2.67 l0,-3.9 Z M19.23,20.0 l2.07,-0.03 c0.7,-0.01,0.7,-0.01,0.7,-0.7 l0,-14.6 c-0.0,-0.67,-0.0,-0.67,-0.67,-0.67 l-10.67,-0.0 c-0.67,0.0,-0.67,0.0,-0.67,0.67 l-0.0,3.9 l-2.0,0 l0,-3.9 c0,-2.0,0.67,-2.67,2.67,-2.67 l10.67,0 c2.0,0,2.67,0.67,2.67,2.67 l0,14.6 c0,2.0,-0.67,2.67,-2.67,2.7 l-2.07,0.03 Z M22.67,22.53 l-3.33,1.27 c-0.97,0.4,-1.33,0.13,-1.33,-0.9 l0,-15.47 c0,-1.03,0.37,-1.57,1.33,-1.97 l2.17,-0.83 c1.87,-0.73,2.5,-0.3,2.5,1.7 l0,14.23 c0,1.03,-0.37,1.57,-1.33,1.97 Z M22.67,22.53"></path></svg>
					</span>
				</a>
			</div>
		</div>
		{/if}
	</nav>
</div>
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
				<div class="mobile-toolbar-action" bind:this={friendsContainer}>
					<button id="friends-widget-button" class="mobile-toolbar-action-button ft-button ft-button-small hover:bg-white/30 {(mobToolbarEnabled === "friends")?"bg-white/30":""}" onclick={() => buttonClick("friends")}>
						<span class="ft-icon-size-20 ft-icon-glyph">
							<svg width="20" height="20" viewBox="0 0 24 24" data-glyph="users" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M8 18V16.13C8 14.3 8.63 13.43 10.4 12.9L11.78 12.42C11.38 13.94 10.57 14.16 10.57 15.03C10.57 15.63 10.74 15.93 11.3 16.1L13.6 16.9C14.47 17.16 15.06 17.5 15.44 18H8ZM12.07 5.24C12.35 3.14 13.47 2 15.43 2C17.9 2 19 3.57 19 6.4C19 10 17.57 9.8 17.57 11.03C17.57 11.63 17.77 11.93 18.3 12.1L20.63 12.9C22.36 13.43 23 14.3 23 16.13V18H17.61C17.04 16.56 15.86 15.49 14.22 15L13.15 14.63C13.55 13.85 14.01 12.36 14.01 10.4C14.01 8.01 13.29 6.29 12.08 5.24H12.07ZM1 22V20.13C1 18.3 1.63 17.43 3.4 16.9L5.6 16.13C6.13 15.93 6.37 15.66 6.37 15.03C6.37 13.86 5 13.86 5 10.4C5 7.57 6.1 6 8.43 6C10.9 6 12 7.57 12 10.4C12 13.87 10.57 13.87 10.57 15.03C10.57 15.63 10.74 15.93 11.3 16.1L13.6 16.9C15.37 17.43 16 18.3 16 20.13V22H1Z"></path></svg>
						</span>
					</button>
				</div>
				<div class="mobile-toolbar-action" bind:this={chatsContainer}>
					<button id="chats-widget-button" class="mobile-toolbar-action-button ft-button ft-button-small hover:bg-white/30 {(mobToolbarEnabled === "chats")?"bg-white/30":""}" onclick={() => buttonClick("chats")}>
						<span class="ft-icon-size-20 ft-icon-glyph">
							<svg width="20" height="20" viewBox="0 0 24 24" data-glyph="message-envelope-fill" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M19.33 21H4.65999C2.24999 21 0.98999 19.75 0.98999 17.33V8.42997L9.75999 14.16C11.43 15.26 12.56 15.26 14.23 14.16L23 8.44997V17.33C23 19.74 21.75 21 19.33 21ZM1.03999 5.95997C1.25999 3.98997 2.48999 2.96997 4.66999 2.96997H19.34C21.52 2.96997 22.75 3.98997 22.97 5.95997L13.21 12.37C12.34 12.94 11.68 12.94 10.81 12.37L1.03999 5.95997Z"></path></svg>
						</span>
					</button>
				</div>
				<div class="mobile-toolbar-action" bind:this={settingsContainer}>
					<button id="settings-widget-button" class="mobile-toolbar-action-button ft-button ft-button-small hover:bg-white/30 {(mobToolbarEnabled === "settings")?"bg-white/30":""}" onclick={() => buttonClick("settings")}>
						<span class="ft-icon-size-20 ft-icon-glyph">
							<svg width="20" height="20" viewBox="0 0 24 24" data-glyph="utility-cogwheel" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M9.57 20.5298L8.4 21.7998C8.03 22.1998 7.73 22.2298 7.27 21.9698L5.74 21.0998C5.27 20.8298 5.17 20.5298 5.31 20.0298L5.84 18.3598C5.97 17.8598 5.94 17.4898 5.67 17.0298L4.5 14.9598C4.23 14.4898 3.93 14.2898 3.43 14.1598L1.7 13.7598C1.2 13.6298 1 13.3898 1 12.8598V11.0898C1 10.5898 1.2 10.3598 1.7 10.2198L3.43 9.81985C3.93 9.68985 4.23 9.48985 4.5 9.01985L5.67 6.94985C5.94 6.47985 5.97 6.11985 5.84 5.61985L5.31 3.94985C5.18 3.44985 5.28 3.14985 5.74 2.87985L7.27 2.00985C7.74 1.73985 8.04 1.77985 8.4 2.17985L9.57 3.44985C9.94 3.84985 10.27 3.97985 10.8 3.97985H13.23C13.73 3.97985 14.06 3.84985 14.43 3.44985L15.6 2.17985C15.97 1.77985 16.27 1.74985 16.73 2.00985L18.26 2.87985C18.73 3.14985 18.83 3.44985 18.69 3.94985L18.16 5.61985C18.03 6.11985 18.06 6.48985 18.33 6.94985L19.5 9.01985C19.77 9.48985 20.07 9.68985 20.57 9.81985L22.3 10.2198C22.8 10.3498 23 10.5898 23 11.0898V12.8598C23 13.3898 22.8 13.6298 22.3 13.7598L20.57 14.1598C20.07 14.2898 19.77 14.4898 19.5 14.9598L18.33 17.0298C18.06 17.4998 18.03 17.8598 18.16 18.3598L18.69 20.0298C18.82 20.5298 18.72 20.8298 18.26 21.0998L16.73 21.9698C16.26 22.2398 15.96 22.1998 15.6 21.7998L14.43 20.5298C14.06 20.1298 13.73 19.9998 13.23 19.9998H10.8C10.27 19.9998 9.93 20.1298 9.57 20.5298ZM12.03 15.4998C13.93 15.4998 15.53 13.9298 15.53 11.9698C15.53 10.0698 13.93 8.49985 12.03 8.49985C10.1 8.49985 8.53 10.0698 8.53 11.9698C8.53 13.9398 10.1 15.4998 12.03 15.4998Z"></path></svg>
						</span>
					</button>
				</div>
				<div class="mobile-toolbar-action">
					<a id="logout-widget-button" class="mobile-toolbar-action-button ft-button ft-button-small hover:bg-white/30" href="/user/logout">
						<span class="ft-icon-size-20 ft-icon-glyph">
							<svg width="20" height="20" viewBox="0 0 24 24" data-glyph="local-door-left-exit" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M4.93,16.37 l-4.47,-3.93 c-0.33,-0.3,-0.33,-0.57,0,-0.87 l4.47,-3.93 c0.77,-0.7,1.07,-0.57,1.07,0.47 l0,7.8 c0,1.03,-0.3,1.17,-1.07,0.47 Z M15.13,13.5 l-10.77,-0.03 l0,-2.97 l10.77,0 c0.6,0,0.83,0.3,0.83,1.07 l0,0.87 c0,0.77,-0.23,1.07,-0.83,1.07 Z M10.0,15.43 l0.0,3.9 c0.0,0.67,0.0,0.67,0.67,0.67 l5.3,0.0 l0,2.0 l-5.3,0 c-2.0,0.0,-2.67,-0.67,-2.67,-2.67 l0,-3.9 Z M19.23,20.0 l2.07,-0.03 c0.7,-0.01,0.7,-0.01,0.7,-0.7 l0,-14.6 c-0.0,-0.67,-0.0,-0.67,-0.67,-0.67 l-10.67,-0.0 c-0.67,0.0,-0.67,0.0,-0.67,0.67 l-0.0,3.9 l-2.0,0 l0,-3.9 c0,-2.0,0.67,-2.67,2.67,-2.67 l10.67,0 c2.0,0,2.67,0.67,2.67,2.67 l0,14.6 c0,2.0,-0.67,2.67,-2.67,2.7 l-2.07,0.03 Z M22.67,22.53 l-3.33,1.27 c-0.97,0.4,-1.33,0.13,-1.33,-0.9 l0,-15.47 c0,-1.03,0.37,-1.57,1.33,-1.97 l2.17,-0.83 c1.87,-0.73,2.5,-0.3,2.5,1.7 l0,14.23 c0,1.03,-0.37,1.57,-1.33,1.97 Z M22.67,22.53"></path></svg>
						</span>
					</a>
				</div>
			</div>
			{/if}
		</div>
		<div id="mobile-toolbar-mount-point" class="left-0 right-0 absolute top-full" bind:this={mobileSpace}>
		{#if mobToolbarEnabled !== "none"}
			<div class="rounded-none overflow-auto overscroll-contain bg-black/50 text-white">
				<div class="p-0 h-full">
					<div class="grid h-[44rem]">
						{#if mobToolbarEnabled === "friends"}
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
		{/if}
		</div>
	</header>
	{@render children()}
</div>

