<script lang="ts">
	let displayNav = $state(false);
	let islogin = $state(false);
	import favicon from '$lib/assets/favicon.svg';
	import homeicon from '$lib/assets/home_icon.svg';
	import gameicon from '$lib/assets/game_icon.svg';
	import profileicon from '$lib/assets/profile_icon.svg';
	import setticon from '$lib/assets/settings_icon.svg';

	let sidebar:any;
	let header:any;
	let { children } = $props();
	import "../app.css";
	import Tab from './Tab.svelte';
	function enableSidebar() {
		displayNav = !displayNav;
		document.querySelector('body')?.classList.add('overflow-hidden');
		document.querySelector('body')?.classList.add('h-full');
		document.querySelector('html')?.classList.add('overflow-hidden');
		document.querySelector('html')?.classList.add('h-full');
	}
	function disableSidebar() {
		displayNav = !displayNav;
		document.querySelector('body')?.classList.remove('overflow-hidden');
		document.querySelector('body')?.classList.remove('h-full');
		document.querySelector('html')?.classList.remove('overflow-hidden');
		document.querySelector('html')?.classList.remove('h-full');
	}
	function onSidebarClick(e:any) {
		if (sidebar.contains(e.target) == false && header.contains(e.target) == false)
			displayNav = false;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>ft_old_internet</title>
</svelte:head>

<svelte:window onclick={onSidebarClick} />

<div id="sidebar" class="lg:left-0 lg:fixed lg:z-100">
	<div id="opened-chats-container"></div>
	<div id="mobile-shroud" class="lg:hidden {(!displayNav)?"hidden":""} inset-0 fixed z-2 bg-black/30"></div>
	<nav id="sidebar-main-menu" class="flex max-lg:fixed flex-col h-svh max-lg:h-[unset] max-lg:top-19 px-[0.8rem] pt-[0.8rem] pb-[1.2rem] max-lg:bottom-0 w-68 lg:max-xl:w-[5.6rem] bg-cyan-600 max-lg:z-100 max-lg:{(!displayNav)?"hidden":""}" bind:this={sidebar}>
		<a href="/" class="items-center grid gap-[1.2rem] relative max-lg:hidden w-full">
			<img alt="logo" class="col-span-full" src={favicon} height="120px" width="120px"/>
		</a>
		<div id="sidebar-menus-buttons" class="min-h-0 overflow-hidden shrink">
			<div class="items-stretch flex flex-col h-full">
				<a class="ft-button ft-button-medium sidebar-link hover:text-white hover:bg-neutral-600" href="/">
					<img class="ft-icon-img ft-icon-size-24" src={homeicon} alt="icon"/>
					<span class="ft-sidebar-link-text text-2xl/tight">Home</span>
				</a>
				<a class="ft-button ft-button-medium sidebar-link hover:text-white hover:bg-neutral-600" href="/game">
					<img class="ft-icon-img ft-icon-size-24" src={gameicon} alt="icon"/>
					<span class="ft-sidebar-link-text text-2xl/tight">Game</span>
				</a>
				<a class="ft-button ft-button-medium sidebar-link hover:text-white hover:bg-neutral-600" href="/profile">
					<img class="ft-icon-img ft-icon-size-24" src={profileicon} alt="icon"/>
					<span class="ft-sidebar-link-text text-2xl/tight">Profile</span>
				</a>
				<a class="ft-button ft-button-medium sidebar-link hover:text-white hover:bg-neutral-600" href="/settings">
					<img class="ft-icon-img ft-icon-size-24" src={setticon} alt="icon"/>
					<span class="ft-sidebar-link-text text-2xl/tight">Settings</span>
				</a>
			</div>
		</div>
		<hr class="mt-auto border-none">
		{#if !islogin}
		<div id="sidebar-login-buttons" class="items-stretch flex flex-col gap-[1.2rem] mt-[1.2rem]">
			<a id="signup-button" class="flex justify-around gap-[0.4rem] text-left items-center overflow-visible relative whitespace-nowrap w-full break-unset border-0 text-[1.4rem]/1.1428 p-[0.8rem] rounded-lg bg-green-500">
				<span class="content-center h-8 w-8 xl:hidden max-lg:hidden">
					<svg width="20" height="20" viewBox="0 0 24 24" data-glyph="user-badge-plus" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M0 20.0301C0 18.0301 0.63 17.1301 2.47 16.4001L3.97 15.8001C6.84 14.6701 7.2 14.4301 7.2 13.6701C7.2 11.3701 5.37 11.3701 5.37 7.40008C5.37 4.23008 6.84 1.83008 9.94 1.83008C13.17 1.83008 14.64 4.23008 14.64 7.40008C14.64 7.73008 14.63 8.04008 14.6 8.32008C10.78 9.36008 8.01 12.8301 8.01 17.0001C8.01 18.8601 8.56 20.5701 9.51 22.0001H0.0100002L0 20.0301ZM17 23.9701C13.2 23.9701 10.03 20.8001 10.03 17.0001C10.03 13.1701 13.2 10.0301 17 10.0301C20.83 10.0301 23.97 13.1601 23.97 17.0001C23.97 20.8001 20.84 23.9701 17 23.9701ZM15.97 21.0301C15.97 21.6601 16.3 22.0001 16.9 22.0001H17C17.63 22.0001 17.97 21.6701 17.97 21.0701V18.0001H21.07C21.67 18.0001 22 17.6701 22 17.0301V16.9301C22 16.3301 21.67 16.0001 21.03 16.0001H17.96V12.9701C17.96 12.3401 17.63 12.0001 17.03 12.0001H16.93C16.3 12.0001 15.96 12.3301 15.96 12.9301V16.0001H12.93C12.33 16.0001 12 16.3301 12 16.9701V17.0701C12 17.6701 12.33 18.0001 12.97 18.0001H15.97V21.0301Z"></path></svg>
				</span>
				<span class="lg:max-xl:hidden">Sign up</span>
			</a>
			<a id="login-button" class="flex justify-around gap-[0.4rem] text-left items-center overflow-visible relative whitespace-nowrap w-full break-unset border-0 text-[1.4rem]/1.1428 p-[0.8rem] rounded-lg bg-gray-500" onclick={() => (islogin = !islogin)}>
				<span class="content-center h-8 w-8 xl:hidden max-lg:hidden">
					<svg width="20" height="20" viewBox="0 0 24 24" data-glyph="arrow-triangle-enter-right" class="rtl-support" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M13.33 7.67L17.2 11.54C17.53 11.87 17.53 12.14 17.2 12.47L13.33 16.34C12.63 17.04 12.33 16.94 12.33 15.91V8.11C12.33 7.08 12.6 6.94 13.33 7.68V7.67ZM0.83 10.5L13.96 10.53V13.5H0.83C0.23 13.5 0 13.2 0 12.43V11.56C0 10.79 0.23 10.49 0.83 10.49V10.5ZM6 2H18C20.47 2 22 3.53 22 6V18C22 20.47 20.47 22 18 22H6C3.53 22 2 20.47 2 18V16.9C2 16.3 2.33 15.97 2.93 15.97H3.06C3.66 15.97 3.99 16.3 3.99 16.9V17.6C3.99 19.6 4.39 20 6.39 20H17.59C19.59 20 19.99 19.6 19.99 17.6V6.4C19.99 4.4 19.59 4 17.59 4H6.39C4.39 4 3.99 4.4 3.99 6.4V7.03C3.99 7.63 3.66 7.96 3.06 7.96H2.93C2.33 7.96 2 7.63 2 7.03V6C2 3.53 3.53 2 6 2Z"></path></svg>
				</span>
				<span class="lg:max-xl:hidden">Log in</span>
			</a>
		</div>
		{:else}
		<div class="sidebar-footer-icons mobile-hidden">
			<Tab name="friends"/>
			<Tab name="chats"/>
			<Tab name="settings"/>
			<div class="ft-sidebar-footing-icon">
				<button class="sidebar-link ft-button ft-button-small hover:bg-white/30" onclick={() => (islogin = !islogin)}>
					<span class="ft-icon-size-20 ft-icon-glyph">
						<!-- This here will change -->
						<svg width="20" height="20" viewBox="0 0 24 24" data-glyph="local-door-left-exit" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M4.93,16.37 l-4.47,-3.93 c-0.33,-0.3,-0.33,-0.57,0,-0.87 l4.47,-3.93 c0.77,-0.7,1.07,-0.57,1.07,0.47 l0,7.8 c0,1.03,-0.3,1.17,-1.07,0.47 Z M15.13,13.5 l-10.77,-0.03 l0,-2.97 l10.77,0 c0.6,0,0.83,0.3,0.83,1.07 l0,0.87 c0,0.77,-0.23,1.07,-0.83,1.07 Z M10.0,15.43 l0.0,3.9 c0.0,0.67,0.0,0.67,0.67,0.67 l5.3,0.0 l0,2.0 l-5.3,0 c-2.0,0.0,-2.67,-0.67,-2.67,-2.67 l0,-3.9 Z M19.23,20.0 l2.07,-0.03 c0.7,-0.01,0.7,-0.01,0.7,-0.7 l0,-14.6 c-0.0,-0.67,-0.0,-0.67,-0.67,-0.67 l-10.67,-0.0 c-0.67,0.0,-0.67,0.0,-0.67,0.67 l-0.0,3.9 l-2.0,0 l0,-3.9 c0,-2.0,0.67,-2.67,2.67,-2.67 l10.67,0 c2.0,0,2.67,0.67,2.67,2.67 l0,14.6 c0,2.0,-0.67,2.67,-2.67,2.7 l-2.07,0.03 Z M22.67,22.53 l-3.33,1.27 c-0.97,0.4,-1.33,0.13,-1.33,-0.9 l0,-15.47 c0,-1.03,0.37,-1.57,1.33,-1.97 l2.17,-0.83 c1.87,-0.73,2.5,-0.3,2.5,1.7 l0,14.23 c0,1.03,-0.37,1.57,-1.33,1.97 Z M22.67,22.53"></path></svg>
					</span>
				</button>
			</div>
		</div>
		{/if}
	</nav>
</div>
<div class="flex flex-col min-h-dvh">
	<header id="mobile-header" class="bg-cyan-600 lg:hidden left-0 right-0 top-0 sticky z-100" bind:this={header}>
		<div class="flex flex-row items-center justify-between py-[.8rem] px-[.4rem]">
			<div id="header-left" class="flex flex-row items-center gap-[.8rem]">
				<button aria-label="Menu button" type="button" onclick={enableSidebar} class="grid h-[3.2rem] w-[3.2rem] p-[unset] place-items-center cursor-pointer {displayNav?"hidden":""}">
					<svg width="24" height="24" viewBox="0 0 24 24" data-glyph="mark-menu" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
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
			<div id="header-right" class="flex flex-row items-center gap-[.8rem]">
				
			</div>
		</div>
	</header>
	{@render children()}
</div>

