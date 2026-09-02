<script lang="ts">
    let { data, form } = $props();
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
        const authorizedExt = ["jpg", "jpeg", "png", "webp"];
        
        if (!image) return;
        if (image.size > 1048576)
        {
            target.value = "";
            data.fileError = 1;
            return;
        }
        let splitted = image.name.split(".");
        let ext = splitted[splitted.length - 1];
        let i = 0;
        for (; i < authorizedExt.length; i++)
            {if (ext === authorizedExt[i]) break;}
        if (i === authorizedExt.length)
        {
            target.value = "";
            data.fileError = 1;
            return ;
        }
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (e: ProgressEvent<FileReader>) => {
        avatar = e.target?.result as string;
        data.fileError = 0;
        };
    };

</script>

<div class="absolute inset-0 z-0 bg-[#333131FF]"></div>
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
                <input name="icon" style="display:none" type="file" accept=".jpg, .jpeg, .png, .webp" onchange={onFileSelected} bind:this={fileinput} >
                <div>
                    <span class="inline pl-3 text-white">Username:</span><input name="username" value={data.username} type="username" class="inline pl-3 font-black text-white text-4xl w-[10ch]"><br>
                    {#if form?.invalidName}<p class="error text-sm text-red-700 pl-6 italic">please enter a valid username</p>{/if}
                    <span class="inline pl-3 text-white">Email:</span><input name="email" value={data.email} type="email" class="inline pl-3 font-black text-white text-4xl"><br>
                    {#if form?.invalidMail}<p class="error text-sm text-red-700 pl-6 italic max-w-[28ch]">please enter a valid email adress</p>{/if}
                    <span class="inline pl-12 pt-6 font-semibold text-zinc-400 text-xl">Wallets:</span><input name="wallet" value={data.wallet} type="wallet" class="inline pl-3 font-black text-white text-xl size-fit"><br>
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
