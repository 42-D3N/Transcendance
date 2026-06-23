<script>
	import { goto } from '$app/navigation';

	function placeholder()	{ console.log(`Ceci est un placeholder.`) }
	function play()			{ goto('/game/gameItself'); }
	function loading()		{ goto('/game/loadingScreen'); }
	function options()		{ console.log('Options'); /*goto('/profile/gameOption')*/ }
	function home()			{ goto('/'); }

	let currentMenu = $state('main');
	const menus =
	{
		main:
		[
			{ label: 'Jouer', action: () => currentMenu = 'play' },
			{ label: 'Regarder', action: placeholder },
			{ label: 'Preview du Loading screen', action: loading },
			{ label: 'Options', action: options },
			{ label: 'Accueil', action: home }
		],
		play:
		[
			{ label: '1 VS IA', action: () => currentMenu = 'difficulty' },
			{ label: '1 VS 1', action: () => currentMenu = 'onevone' },
			{ label: '1 VS 1 VS 1 VS 1', action: placeholder },
			{ label: 'Retour', action: () => currentMenu = 'main' }
		],
		onevone:
		[
			{ label: 'Local', action: placeholder },
			{ label: 'Matchmaking', action: placeholder },
			{ label: 'Retour', action: () => currentMenu = 'play' }
		],
		difficulty:
		[
			{ label: 'Easy', action: play },
			{ label: 'Normal', action: placeholder },
			{ label: 'Hard', action: placeholder },
			{ label: 'Impossible?', action: placeholder },
			{ label: 'Retour', action: () => currentMenu = 'play' }
		]
	};
</script>

<div class="menu-container">
	<div class="overlay">
		<h1 class="game-title">Pong</h1>
		<div class="menu-buttons">
			{#each menus[currentMenu] as button}
				<button onclick={button.action}>
					{button.label}
				</button>
			{/each}
		</div>
		<p class="version">Version 0.1.1</p>
	</div>
</div>

<style>
	.menu-container
	{
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgb(143, 28, 28);
		background-image: url('Placeholder.svg');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		height: 100vh;
	}

	.overlay
	{
		text-align: center;
		color: rgb(255, 251, 0);
	}

	.game-title
	{
		font-size: 5rem;
		font-weight: 900;
		margin-bottom: 3rem;
		letter-spacing: 0.2em;
		text-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
	}

	.menu-buttons
	{
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 280px;
		margin: 0 auto;
	}

	button
	{
		padding: 1rem;
		font-size: 1.2rem;
		font-weight: bold;
		border: none;
		border-radius: 12px;
		background: rgb(0, 89, 253, 0.7);
		color: white;
		cursor: pointer;
		backdrop-filter: blur(8px);
		transition:
			transform 0.2s ease,
			background 0.2s ease;
	}

	button:hover
	{
		transform: translateY(3px) scale(1.2);
		background: rgba(59, 130, 246, 0.4);
	}

	.version
	{
		margin-top: 3rem;
		font-size: 0.9rem;
		opacity: 0.6;
	}
</style>