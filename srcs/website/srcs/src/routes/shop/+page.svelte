<script lang="ts">
    import Popup from "$lib/Popup.svelte";
    import item1 from "$lib/assets/item1.png";
    import item2 from "$lib/assets/item2.png";
    import item3 from "$lib/assets/item3.png";
    import item4 from "$lib/assets/item4.png";
    import item5 from "$lib/assets/item5.png";
    import item6 from "$lib/assets/item6.png";
    import item7 from "$lib/assets/item7.png";
    import item8 from "$lib/assets/item8.png";

    let { data } = $props();
    let shep = $derived(data.code === true ? 0.50 : 1);
    let return_val:number = $state(0);
    let showmodal:boolean = $state(false);
    let code:string = $state("");
    let products = $state([
        { id: 1, name: "Old placeholder: ", price: 10, src: item1},
        { id: 2, name: "Game dev's fav colors: ", price: 20, src: item2},
        { id: 3, name: "Dev's fav color: ", price: 30, src: item3},
        { id: 4, name: "Mariposa's creation: ", price: 40, src: item4},
        { id: 5, name: "MY LIFE FOR AIUR: ", price: 50, src: item5},
        { id: 6, name: "Light: ", price: 60, src: item6},
        { id: 7, name: "Perturabo's love: ", price: 70, src: item7},
        { id: 8, name: "WE ARE RICH: ", price: 670, src: item8},
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
        if (return_val == 3)
            window.location.reload();
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
        if (return_val)
            window.location.reload();
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

<div class="flex w-full flex-col items-center z-10">
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
                    {#if data.skins[product.id - 1].own}
                        <button onclick={() => sendData({id: product.id})} title="shop item" type="button" class="text-wrap inline-block rounded-xl bg-[#6b0f1fFF] z-10 w-[90%] min-h-[15%] max-h-[50%] text-center">
                            <span class="break-words text-l sm:text-xl md:text-3xl lg:text-4xl italic">
                                $$ - SOLD OUT - $$
                            </span>
                        </button>
                    {:else}
                        <button onclick={() => sendData({id: product.id})} title="shop item" type="button" class="text-wrap inline-block rounded-xl bg-[#C41E3AFF] hover:bg-[#6b0f1fFF] z-10 w-[90%] min-h-[15%] max-h-[50%] text-center">
                            <span class="break-words text-l sm:text-xl md:text-3xl lg:text-4xl">
                                {product.name} {product.price * shep}$
                            </span>
                        </button>
                    {/if}
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
{#if return_val === 10}
<Popup message="Error while trying please reload the page or try later"
    duration = {5000}
    class="fixed top-5 left-1/2 z-[1000] block -translate-x-1/2 items-center gap-4 rounded-lg bg-[#C41E3A] px-[18px] py-3 text-[#000000] shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
    onClose={() => return_val = 0}/>
{/if}