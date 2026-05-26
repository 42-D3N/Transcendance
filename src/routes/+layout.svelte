<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
	import "../app.css";
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>PONG</title>
</svelte:head>

<div class="w-42.5 h-full fixed overflow-auto m-0 p-0 bg-cyan-600">
	<div class="items-center flex justify-center">
		<img alt="logo" src={favicon} height="120px" width="120px"/>
	</div>
	<nav class="flex flex-col overflow-auto text-center">
		<a class="py-2 px-4 hover:text-white hover:bg-neutral-600" href="/">Home</a>
		<a class="py-2 px-4 hover:text-white hover:bg-neutral-600" href="/game">Game</a>
		<a class="py-2 px-4 hover:text-white hover:bg-neutral-600" href="/profile">Profile</a>
		<a class="py-2 px-4 hover:text-white hover:bg-neutral-600" href="/settings">Settings</a>
	</nav>
</div>

{@render children()}
