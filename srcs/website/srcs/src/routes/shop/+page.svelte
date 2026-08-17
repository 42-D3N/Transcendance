<script lang="ts">
    import noise from "$lib/assets/noise.png";
    import test from "$lib/assets/test.jpg";
    let { data } = $props();

    let products = [
        { id: 1, name: "Product 1", price: 10 },
        { id: 2, name: "Product 2", price: 20 },
        { id: 3, name: "Product 3", price: 30 },
        { id: 4, name: "Product 4", price: 40 }
    ];

    function buy(product) {
        if (data.wallet < product.price)
            alert('Price to high for your budget');
        else
            alert('Thanks for your buy!');
    }
	function greet() {
		alert('Thanks for your buy!');
	}
    let showmodal = $state(false);
    let code = data.user;
    function secret() {
        showmodal = true;
    }
    function save_code() {
        alert(code);
        showmodal = false;
        code = "";
    }
    function close_popup() {
        showmodal = false;
        code = "";

    }

</script>
<div class="fixed inset-0 z-0 bg-[#333131FF]"></div>

<button onclick={secret} class="z-100 text-[#C41E3AFF] text-7xl text-center lg:text-9xl lg:mt-[5%] ">Shop</button>
{#if showmodal}
<div class="fixed z-1000 inset-0 flex items-center justify-center bg-[#00000080]" role="article"
    onclick={(e) => {
        if (e.target === e.currentTarget) showmodal = false, code = "";
    }}>
    <div class="bg-[#C41E3AFF] rounded-xl shadow-xl w-96 p-6">
        <input class="border border-solid border-[#00000080] bg-[#C41E3AFF] max-w-full" bind:value={code} placeholder="enter code"
        onkeydown={(e) => {
            if (e.key === "Enter") save_code();
        }}>
        <div class="flex item-center mt-6">
            <button onclick={save_code}>Send code</button>
            <button onclick={close_popup} class="ml-auto">Close</button>
        </div>
    </div>
</div>
{/if}

<div class="grid lg:scale-90 lg:grid-cols-4 gap-10 mt-[3%] scale-95 lg:h-[80%] h-fit px-4 py-px z-1 size-full text-center grid-cols-2">
    {#each products as product}
        <div>
            <img src={noise} class="scale-80 mx-auto" alt=""/>

            <button onclick={() => buy(product)} class="text-wrap inline-block rounded-xl bg-[#C41E3AFF] z-10 w-[90%] min-h-[15%] max-h-[50%] text-center">
                <span class="break-words text-l sm:text-xl md:text-3xl lg:text-4xl"> {product.name} </span>
            </button>
        </div>
    {/each}
</div>