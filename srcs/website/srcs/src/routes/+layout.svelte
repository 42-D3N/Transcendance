<script lang="ts">
	let displayNav = $state(false);
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
	import "../app.css";
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
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>PONG</title>
</svelte:head>

<div id="sidebar" class="lg:left-0 lg:fixed lg:z-100">
	<div id="mobile-shroud" class="lg:hidden {(!displayNav)?"hidden":""} inset-0 fixed z-2 bg-black/30"></div>
	<nav class="flex max-lg:fixed flex-col h-svh max-lg:h-[unset] max-lg:top-19 px-[0.8rem] pt-[0.8rem] pb-[1.2rem] max-lg:bottom-0 w-68 lg:max-xl:w-[5.6rem] bg-cyan-600 max-lg:z-100 max-lg:{(!displayNav)?"hidden":""}">
		<div class="items-center grid gap-[1.2rem] relative max-lg:hidden">
			<img alt="logo" src={favicon} height="120px" width="120px"/>
		</div>
		<a class="py-2 px-4 hover:text-white hover:bg-neutral-600" href="/">Home</a>
		<a class="py-2 px-4 hover:text-white hover:bg-neutral-600" href="/game">Game</a>
		<a class="py-2 px-4 hover:text-white hover:bg-neutral-600" href="/profile">Profile</a>
		<a class="py-2 px-4 hover:text-white hover:bg-neutral-600" href="/settings">Settings</a>
	</nav>
</div>
<div class="flex flex-col min-h-dvh">
	<header id="mobile-header" class="bg-cyan-600 lg:hidden left-0 right-0 top-0 sticky z-100">
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

