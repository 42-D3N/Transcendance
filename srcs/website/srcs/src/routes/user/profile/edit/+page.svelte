<script lang="ts">
    let { data } = $props();
    import { enhance } from '$app/forms';

    import usericon from '$lib/assets/user/default.svg';
    let fileinput: HTMLInputElement;
    let avatar: string | undefined = $state();

    function    Winrate()
    {
        if (parseInt(data.matches) === 0)
            return (0);
        return (parseInt(data.wins) / parseInt(data.matches));
    }

    const onFileSelected = (e: Event): void => {
        const target = e.target as HTMLInputElement;
        const image = target.files?.[0];
        
        if (!image) return;
        if (image.size > 1048576) return;

        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (e: ProgressEvent<FileReader>) => {
        avatar = e.target?.result as string;
        };
    };

</script>

<div class="absolute inset-0 z-0 bg-[#333131FF]"></div>
0                                                 
<div class="lg:scale-120 pb-8 z-1 lg:mt-[2%] lg:p-16 pl-6 pr-6 lg:ml-[25%] lg:w-[50%]">
    <form method="POST" enctype="multipart/form-data" use:enhance>
        <div class="pb-8 w-full h-[80%] bg-[#292626FF] border-solid rounded-lg z-10">
            <div class="flex p-4">
                {#if avatar}
                    <img class="upload block hover:opacity-60 lg:h-[12rem] lg:w-[12rem] h-[8rem] w-[8rem] border-solid rounded-md bg-amber-50" src={avatar} alt="" onclick={() => fileinput.click()} />
                {:else}
                    {#if !data.icon}
                        <img class="upload block hover:opacity-60 lg:h-[12rem] lg:w-[12rem] h-[8rem] w-[8rem] border-solid rounded-md bg-amber-50" src={usericon} alt="" onclick={() => fileinput.click()} />
                    {:else}
                        <img class="upload block hover:opacity-60 lg:h-[12rem] lg:w-[12rem] h-[8rem] w-[8rem] border-solid rounded-md bg-amber-50" src={data.icon} alt={data.icon} onclick={() => fileinput.click()}/>
                    {/if}
                {/if}
                <input name="icon" style="display:none" type="file" accept=".jpg, .jpeg, .png" onchange={onFileSelected} bind:this={fileinput} >
                <div>
                    <span class="block pl-6 font-black text-white text-4xl">{data.username}</span>
                    
                    <span class="pl-12 pt-6 font-semibold text-zinc-400 text-xl">Wallets:</span>
                    <span class="pt-6 font-semibold text-white text-xl">{data.wallet}</span>
                    <span class="block"></span>
                    <span class="pl-12 text-zinc-400 text-lg">Winrate:</span>
                    <span class="text-white text-lg">{Winrate()}</span>
                </div>
            </div>
            <button class="block ml-4 mt-4 w-fit p-2 bg-green-600 hover:bg-green-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md" type="submit">
                <span class="text-white font-bold p-4">Save Changes</span>
            </button>
        </div>
    </form>

    <div class="mt-16 pb-8 w-full h-[80%] bg-[#292626FF] border-solid rounded-lg z-10 p-4">
            <span class="text-white text-4xl font-bold p-4">Match History</span>
            <span class="text-zinc-400 text-4xl font-bold">({data.matches})</span>
    </div>
</div>
