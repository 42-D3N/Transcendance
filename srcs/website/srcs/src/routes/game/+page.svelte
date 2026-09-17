<div class="menu-container">
	<div class="overlay">
		<h1 class="game-title">Pong</h1>
		<div class="menu-buttons">
			<div class="pvp-group">
				<p class="pvp-group-title">PVP</p>
				<a class="menu-button" href="/game/matchmaking?mode=pvp">Matchmaking</a>
			</div>
			<div class="ai-group">
				<p class="ai-group-title">Affrontements IA</p>
				<div class="ai-grid">
					<a class="menu-button ai-button" href="/game/matchmaking?mode=pve&aiDifficulty=easy">IA Easy</a>
					<a class="menu-button ai-button" href="/game/matchmaking?mode=pve&aiDifficulty=normal">IA Normal</a>
					<a class="menu-button ai-button" href="/game/matchmaking?mode=pve&aiDifficulty=hard">IA Hard</a>
					<a class="menu-button ai-button" href="/game/matchmaking?mode=pve&aiDifficulty=impossible">IA Impossible</a>
				</div>
			</div>
			<a class="menu-button" href="/game/loadingScreen">Preview du Loading screen</a>
		</div>
		<p class="version">Version 0.6.7.?</p>
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
		margin: 0;
	}

	.menu-button
	{
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		font-size: 1.2rem;
		font-weight: bold;
		border: none;
		border-radius: 12px;
		background: rgb(0, 89, 253, 0.7);
		color: white;
		text-decoration: none;
	}

	.pvp-group,
	.ai-group
	{
		padding: 0.8rem;
		border: 2px solid rgba(255, 251, 0, 0.6);
		border-radius: 12px;
		background: rgba(6, 15, 44, 0.35);
	}

	.pvp-group-title,
	.ai-group-title
	{
		margin: 0 0 0.7rem;
		font-size: 0.95rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 251, 0, 0.9);
	}

	.ai-grid
	{
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.6rem;
	}

	.ai-button
	{
		padding: 0.8rem 0.5rem;
		font-size: 1rem;
	}

	.version
	{
		margin-top: 3rem;
		font-size: 0.9rem;
		opacity: 0.6;
	}
</style>