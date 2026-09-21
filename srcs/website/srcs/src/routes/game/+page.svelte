<script lang="ts">
</script>
<div class="min-h-dvh w-full flex items-center justify-center bg-[#000000FF] bg-[url('/src/lib/assets/pong.svg')] bg-contain bg-center bg-no-repeat" style="font-family: Arial, Helvetica, sans-serif;">
	<div class="w-[340px]">

		<div class="bg-white border border-[#c5d9e8] rounded-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] overflow-hidden">

			<div class="border-b border-dotted border-[#c5d9e8]">
				<div class="bg-[#e1ecf7] px-3 py-1.5 border-b border-[#c5d9e8]">
					<span class="text-[13px] font-bold text-[#3b5998]">PVP</span>
				</div>
				<div class="p-3 flex justify-center">
					<a
						class="inline-flex items-center justify-center px-6 py-2 text-[13px] font-bold text-black no-underline bg-gradient-to-b from-[#f8f8f8] to-[#e0e0e0] border border-[#999999] rounded-[3px] hover:from-[#eeeeee] hover:to-[#d0d0d0] active:from-[#d0d0d0] active:to-[#e0e0e0]"
						href="/game/play?mode=pvp"
					>
						Matchmaking
					</a>
				</div>
			</div>

			<div class="border-b border-dotted border-[#c5d9e8]">
				<div class="bg-[#e1ecf7] px-3 py-1.5 border-b border-[#c5d9e8]">
					<span class="text-[13px] font-bold text-[#3b5998]">Affrontements IA</span>
				</div>
				<div class="p-3 grid grid-cols-2 gap-2">
					<a class="flex items-center justify-center px-2 py-2 text-[12px] font-bold text-black no-underline bg-gradient-to-b from-[#f8f8f8] to-[#e0e0e0] border border-[#999999] rounded-[3px] hover:from-[#eeeeee] hover:to-[#d0d0d0] active:from-[#d0d0d0] active:to-[#e0e0e0]" href="/game/play?mode=pve&aiDifficulty=easy">
						IA Easy
					</a>
					<a class="flex items-center justify-center px-2 py-2 text-[12px] font-bold text-black no-underline bg-gradient-to-b from-[#f8f8f8] to-[#e0e0e0] border border-[#999999] rounded-[3px] hover:from-[#eeeeee] hover:to-[#d0d0d0] active:from-[#d0d0d0] active:to-[#e0e0e0]" href="/game/play?mode=pve&aiDifficulty=normal">
						IA Normal
					</a>
					<a class="flex items-center justify-center px-2 py-2 text-[12px] font-bold text-black no-underline bg-gradient-to-b from-[#f8f8f8] to-[#e0e0e0] border border-[#999999] rounded-[3px] hover:from-[#eeeeee] hover:to-[#d0d0d0] active:from-[#d0d0d0] active:to-[#e0e0e0]" href="/game/play?mode=pve&aiDifficulty=hard">
						IA Hard
					</a>
					<a class="flex items-center justify-center px-2 py-2 text-[12px] font-bold text-black no-underline bg-gradient-to-b from-[#f8f8f8] to-[#e0e0e0] border border-[#999999] rounded-[3px] hover:from-[#eeeeee] hover:to-[#d0d0d0] active:from-[#d0d0d0] active:to-[#e0e0e0]" href="/game/play?mode=pve&aiDifficulty=impossible">
						IA Impossible
					</a>
				</div>
			</div>

			<!-- preview -->
			<div class="p-3 flex justify-center bg-[#fafafa]">
				<a
					class="text-[13px] font-bold no-underline hover:underline"
					style="color: #3366CC;"
					href="/game/loadingScreen"
				>
					Preview du Loading screen
				</a>
			</div>
		</div>

		<p class="mt-3 text-center text-[11px] text-[#666666]">Version 0.6.7.?</p>
	</div>
</div>