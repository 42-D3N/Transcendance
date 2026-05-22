<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>PONG</title>
</svelte:head>

<nav class="nav">
	<button class="button">Home</button>
	<button class="button">Game</button>
	<button class="button">Profile</button>
	<button class="button">Settings</button>
</nav>

<style>
	.nav {
		display: flex;
		flex-direction: column;
		width: 200px;
		height: 100%;
		position: fixed;
		overflow: auto;
		margin: 0;
		padding: 0;
	}
	.button {
		text-decoration: none;
		color: black;
		padding: 8px 16px;
		border: none;
		background-color: white;
	}
	.button:hover {
		background-color: #555555;
		color: white;
	}
</style>

{@render children()}
