<script lang="ts">
    import Popup from "$lib/Popup.svelte";
    import noise from "$lib/assets/noise.png";
    import test from "$lib/assets/test.jpg";

    let { data } = $props();
    let shep = $derived(data.code === true ? 0.50 : 1);
    let return_val:number = $state(0);
    let showmodal:boolean = $state(false);
    let code:string = $state("");
    let products = $state([
        { id: 1, name: "Product", price: 10, src: noise},
        { id: 2, name: "Product", price: 20, src: noise},
        { id: 3, name: "Product", price: 30, src: noise},
        { id: 4, name: "Product", price: 40, src: noise},
        { id: 5, name: "Product", price: 50, src: noise},
        { id: 6, name: "Product", price: 60, src: noise},
        { id: 7, name: "Product", price: 70, src: noise},
        { id: 8, name: "Product", price: 80, src: noise},
    ]);

    async function sendData(product) {
        const formData = new FormData();
        formData.append('product', JSON.stringify(product));
        const response = await fetch('/shop', {
            method: 'POST',
            body: formData
        })
        const result = await response.json();
        const data = JSON.parse(result.data);
        return_val = data[2];
    }
    
    async function save_code() {
        const formData = new FormData();
        formData.append('code', code);
        const response = await fetch('/shop', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        const data = JSON.parse(result.data);
        if (data[1] === true)
            return_val = 4;
        showmodal = false;
        code = "";
    }
    function secret() {
        showmodal = true;
    }
    function close_popup() {
        showmodal = false;
        code = "";

    }

</script>
<div class="fixed inset-0 z-0 bg-[#333131FF]"></div>

<div class="flex w-full flex-col items-center">
  <button onclick={secret} class="z-100 w-fit text-7xl text-[#C41E3AFF] lg:mt-[5%] lg:text-9xl">Shop </button>
    {#if showmodal}
    <div class="fixed inset-0 z-[1000] flex items-center justify-center bg-[#00000080]" role="presentation" onclick={(e) => {
        if (e.target === e.currentTarget) {
        showmodal = false;
        code = "";
        }
    }}
    onkeydown={(e) => {
        if (e.key === "Escape") {
        showmodal = false;
        code = "";
        }
    }}>
    <div class="w-96 rounded-xl bg-[#C41E3AFF] p-6 shadow-xl">
        <input class="max-w-full border border-solid border-[#00000080] bg-[#C41E3AFF]" bind:value={code} placeholder="enter code" onkeydown={(e) => {
            if (e.key === "Enter")
                save_code();
            }}/>
        <div class="mt-6 flex items-center">
        <button type="button" title="save code" onclick={save_code}> Send code </button>
        <button type="button" title="close code" onclick={close_popup} class="ml-auto"> Close </button>
        </div>
    </div>
    </div>
    {/if}
    <div class="grid lg:scale-90 lg:grid-cols-4 gap-10 mt-[3%] scale-95 lg:h-[80%] h-fit px-4 py-px z-1 size-full text-center grid-cols-2">
        {#each products as product}
            <div>
                <img src={product.src} class="scale-80 mx-auto" alt=""/>
                    <button onclick={() => sendData({id: product.id})} title="shop item" type="button" class="text-wrap inline-block rounded-xl bg-[#C41E3AFF] z-10 w-[90%] min-h-[15%] max-h-[50%] text-center">
                        <span class="break-words text-l sm:text-xl md:text-3xl lg:text-4xl">
                            {product.name} {product.price * shep}
                        </span>
                    </button>
            </div>
        {/each}
    </div>
</div>
{#if return_val === 1}
<Popup
    message="Not enough money"
    duration={5000}
    class="fixed top-5 left-1/2 z-[1000] block -translate-x-1/2 items-center gap-4 rounded-lg bg-[#C41E3A] px-[18px] py-3 text-[#000000] shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
    onClose={() => return_val = 0}/>
{/if}
{#if return_val === 2}
<Popup message="Already own the item" 
    duration = {5000}
    class="fixed top-5 left-1/2 z-[1000] block -translate-x-1/2 items-center gap-4 rounded-lg bg-[#C41E3A] px-[18px] py-3 text-[#000000] shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
    onClose={() => return_val = 0}/>
{/if}
{#if return_val === 3}
<Popup message="Thanks for your buy"
    duration = {5000}
    class="fixed top-5 left-1/2 z-[1000] block -translate-x-1/2 items-center gap-4 rounded-lg bg-[#C41E3A] px-[18px] py-3 text-[#000000] shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
    onClose={() => return_val = 0}/>
{/if}
{#if return_val === 4}
<Popup message="Code accepted. Please reload the page"
    duration = {5000}
    class="fixed top-5 left-1/2 z-[1000] block -translate-x-1/2 items-center gap-4 rounded-lg bg-[#C41E3A] px-[18px] py-3 text-[#000000] shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
    onClose={() => return_val = 0}/>
{/if}
{#if return_val === 10}
<Popup message="Error while trying please reload the page or try later"
    duration = {5000}
    class="fixed top-5 left-1/2 z-[1000] block -translate-x-1/2 items-center gap-4 rounded-lg bg-[#C41E3A] px-[18px] py-3 text-[#000000] shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
    onClose={() => return_val = 0}/>
{/if}