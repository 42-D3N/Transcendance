<script lang="ts">
    import cat from "$lib/assets/cat.jpeg";
    import test from "$lib/assets/test.jpg";
	function greet() {
		alert('Thanks for your buy!');
	}
</script>

<div class="absolute inset-0 z-0 bg-[#333131FF]"></div>
<div class="grid lg:scale-100 lg:grid-cols-4 gap-10 mt-[10%] scale-95 lg:h-[80%] h-fit px-4 py-px z-1 size-full text-center grid-cols-2">
    <div>
        <img src={cat} class="scale-80 w-fit"/>
        <button onclick={greet} class="text-wrap inline-block rounded-xl bg-[#C41E3AFF] z-10 w-[90%] min-h-[15%] max-h-[20%] text-center">
            <span class="break-words text-l sm:text-xl md:text-3xl lg:text-4xl">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span>
        </button>
    </div>
    <div>
        <img src={test} class="scale-80 w-fit"/>
        <button onclick={greet} class="inline-block text-xs rounded-xl bg-[#C41E3AFF] m-[1%] min-w-fit p-4 z-10 w-[90%]">Item 2</button>
    </div>
    <div>
        <button onclick={greet} class="inline-block text-xs rounded-xl bg-[#C41E3AFF] m-[1%] min-w-fit p-4 z-10 w-[90%]">Item 1</button>
    </div>
    <div>
        <button onclick={greet} class="inline-block text-xs rounded-xl bg-[#C41E3AFF] m-[1%] min-w-fit p-4 z-10 w-[90%]">Item 2</button>
    </div>
    <div>
        <button onclick={greet} class="inline-block text-xs rounded-xl bg-[#C41E3AFF] m-[1%] min-w-fit p-4 z-10 w-[90%]">Item 1</button>
    </div>
    <div>
        <button onclick={greet} class="inline-block text-xs rounded-xl bg-[#C41E3AFF] m-[1%] min-w-fit p-4 z-10 w-[90%]">Item 2</button>
    </div>
    <div>
        <button onclick={greet} class="inline-block text-xs rounded-xl bg-[#C41E3AFF] m-[1%] min-w-fit p-4 z-10 w-[90%]">Item 1</button>
    </div>
    <div>
        <button onclick={greet} class="inline-block text-xs rounded-xl bg-[#C41E3AFF] m-[1%] min-w-fit p-4 z-10 w-[90%]">Item 2</button>
    </div>
</div>
