<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>PONG</title>
</svelte:head>

<div class="sidebar">
	<div class="logo">
		<img alt="logo" src={favicon} height="120px" width="120px"/>
	</div>
	<nav>
		<a class="button" href="/">Home</a>
		<a class="button" href="/game">Game</a>
		<a class="button" href="/profile">Profile</a>
		<a class="button" href="/settings">Settings</a>
	</nav>
</div>

<style>
	.sidebar {
		width: 170px;
		height: 100%;
		position: fixed;
        overflow: auto;
		margin: 0;
		padding: 0;
		background-color: cadetblue;
	}
	.logo {
		align-items: center;
		display: flex;
 		justify-content: center;
	}
	nav {
		display: flex;
		flex-direction: column;
        overflow: auto;
	}
	.button {
		text-decoration: none;
		color: black;
		padding: 8px 16px;
		border: none;
		background-color: cadetblue;
	}
	.button:hover {
		background-color: #555555;
		color: white;
	}
</style>

{@render children()}
