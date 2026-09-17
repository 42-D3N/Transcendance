<script lang="ts">
    let { data, form } = $props();
    import { enhance } from '$app/forms';
    import Popup from "$lib/Popup.svelte";
    import { redirect } from '@sveltejs/kit';
    import usericon from '$lib/assets/user/default.svg';
    let fileinput: HTMLInputElement;
    let avatar: string | undefined = $state();
    let fileError = $state(0);

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
        
        if (!image) 
        {
            fileError = 1;        
            return;
        }
        if (image.size > 1048576)
        {
            target.value = "";
            fileError = 2;
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
            fileError = 3;
            return ;
        }
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (e: ProgressEvent<FileReader>) => {
        avatar = e.target?.result as string;
        data.fileError = 0;
        };
    };
    
    function NoNoYourPreviewSuckPlsDeleteItDaddy() {
        window.location.reload()
    }

    function formatTime(e:Date):string {
        const interval = (Date.now() - e.getTime()) / 1000;
        if (interval < 5)
            return ("À l'instant.");
        if (interval < 60)
            return "Il y a "+interval+" secondes.";
        if (interval < 90)
            return "Il y a 1 minute.";
        if (interval < 3600)
            return "Il y a "+Math.round(interval/60)+" minutes.";
        if (interval < 5400)
            return "Il y a 1 heure.";
        if (interval < 86400)
            return "Il y a "+Math.round(interval/3600)+" heures.";
        return e.toDateString();
    }

</script>

<div class="absolute inset-0 z-0 bg-[#333131FF]"></div>
<div class="lg:scale-120 pb-8 z-1 lg:mt-[2%] lg:p-16 pl-6 pr-6 lg:ml-[25%] lg:w-[50%]">
    <form method="POST" enctype="multipart/form-data" use:enhance>
        <div class="pb-8 w-full h-[80%] bg-[#292626FF] border-solid rounded-lg z-10">
            <div class="flex p-4">
                {#if avatar}
                    <div class="relative">
                        <img class="upload block hover:opacity-60 lg:h-[12rem] lg:w-[12rem] h-[8rem] w-[8rem] border-solid rounded-md bg-amber-50" src={avatar} alt="" onclick={() => fileinput.click()} />
                        <button class="absolute size-fit bg-red-600 hover:bg-red-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md right-0 top-0" onclick={NoNoYourPreviewSuckPlsDeleteItDaddy}>
                            <span class="text-white font-bold p-4">✕</span>
                        </button>
                    </div>
                {:else}
                    {#if !data.icon}
                        <img class="upload block hover:opacity-60 lg:h-[12rem] lg:w-[12rem] h-[8rem] w-[8rem] border-solid rounded-md bg-amber-50" src={usericon} alt="" onclick={() => fileinput.click()} />
                    {:else}
                        <div class="relative">
                            <img class="upload block hover:opacity-60 lg:h-[12rem] lg:w-[12rem] h-[8rem] w-[8rem] border-solid rounded-md bg-amber-50" src={data.icon} alt={data.icon} onclick={() => fileinput.click()} />
                            <button class="absolute size-fit bg-red-600 hover:bg-red-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md right-0 top-0" type="submit" formaction="?/delIcon">
                                <span class="text-white font-bold pl-2 pr-2 ">✕</span>
                            </button>
                        </div>
                    {/if}
                {/if}
                <input name="icon" style="display:none" type="file" accept=".jpg, .jpeg, .png, .webp" onchange={onFileSelected} bind:this={fileinput} >
                <div>
                    <span class="inline pl-3 text-white">Username:</span><input name="username" value={data.username} type="username" class="inline pl-3 font-black text-white text-4xl w-[10ch]"><br>
                    {#if form?.invalidName}<p class="error ml-2">please enter a valid username</p>{/if}
                    <span class="inline pl-3 text-white">Email:</span><input name="email" value={data.email} type="email" class="inline pl-3 font-black text-white text-4xl max-w-[12ch] lg:max-w-[30ch]"><br>
                    {#if form?.invalidMail}<p class="error max-w-[28ch] ml-2">please enter a valid email adress</p>{/if}
                    {#if form?.somethingExists}<p class="error max-w-[28ch] ml-2">username or mail already taken</p>{/if}
                    <span class="inline pl-12 pt-6 font-semibold text-zinc-400 text-xl">Wallets:</span><input name="wallet" value={data.wallet} type="wallet" class="inline pl-3 font-black text-white text-xl size-fit max-w-[6ch]"><br>
                    <span class="pl-12 text-zinc-400 text-lg">Winrate:</span>
                    <span class="text-white text-lg">{Winrate()}</span>
                </div>
            </div>
            <div class="ml-4">
                <input type="checkbox" id="agree" name="agree" checked={data.privateAcc} value="private"/>
                <span class="text-white">Make account private</span>
            </div>
            <button class="block ml-4 mt-4 w-fit p-2 bg-green-600 hover:bg-green-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md" type="submit" formaction="?/saveMods">
                <span class="text-white font-bold p-4">Save Changes</span>
            </button>
        </div>
    </form>

    <div class="mt-16 pb-8 w-full h-[80%] bg-[#292626FF] border-solid rounded-lg z-10 p-4">
        <span class="text-white text-4xl font-bold p-4">Match History</span>
        <span class="text-zinc-400 text-4xl font-bold">({data.matches})</span>
    </div>

    {#each data.matchHistory as match}
        <div class="block mt-[1%] w-full h-[20%] bg-[#292626FF] border-solid rounded-lg z-10 p-4">
            <div class="flex">

                {#if match.winner === data.id}
                    <span class="text-green-600 text-lg lg:text-2xl font-bold">Win</span>
                {:else}
                    <span class="text-red-600 text-lg lg:text-2xl font-bold">Lose</span>
                {/if}
                <div class="mx-[1%] self-stretch pb-1 w-px shrink-0 bg-black"></div>
                
                <span class="ml-auto text-white text-lg lg:text-xl">{formatTime(new Date(match.date))}</span>
            </div>
            <hr class="w-[20%] lg:w-[8%]">
            <div class="h-[20%] p-4">

                <div class="flex">

                    <div class="flex-1 flex items-center">
                        <a class="w-fit" href={"/user/member/"+match.user1Pseudo+"_"+JSON.stringify(match.user1)}>
                            <span class="text-lg lg:text-3xl text-white font-semibold">{match.user1Pseudo}#{match.user1}</span>
                        </a>
                    </div>
                    
                    {#if match.user1Score > match.user2Score}
                        <span class="ml-auto text-lg lg:text-2xl not-lg:mt-2 font-bold text-green-800">{match.user1Score}</span>
                    {:else}
                        <span class="ml-auto text-lg lg:text-2xl not-lg:mt-2 font-bold text-red-800">{match.user1Score}</span>
                    {/if}

                    <div class="not-lg:hidden mx-[2%] self-stretch items-center w-px shrink-0 bg-black"></div>
                    <div class="lg:hidden ml-1 mr-1">-</div>
                    
                    {#if match.user1Score > match.user2Score}
                        <span class="ml-auto text-lg lg:text-2xl not-lg:mt-2 font-bold text-red-800">{match.user2Score}</span>
                    {:else}
                        <span class="ml-auto text-lg lg:text-2xl not-lg:mt-2 font-bold text-green-800">{match.user2Score}</span>
                    {/if}

                    <div class="flex-1 flex items-center justify-end">
                        <a class="w-fit" href={"/user/member/"+match.user2Pseudo+"_"+JSON.stringify(match.user2)}>
                            <span class="text-lg lg:text-3xl text-white font-semibold">{match.user2Pseudo}#{match.user2}</span>
                        </a>
                    </div>
                    
                </div>
                <div class="flex w-full">
                    {#if match.user1EloChange > 0}
                        <span class="flex-1 flex items-center text-lg lg:text-2xl text-green-600 font-bold">+{match.user1EloChange}</span>
                        <span class="flex-1 flex items-center text-lg lg:text-2xl justify-end text-red-600 font-bold">{match.user2EloChange}</span>
                    {:else}
                        <span class="flex-1 flex items-center text-lg lg:text-2xl text-red-600 font-bold">{match.user1EloChange}</span>
                        <span class="flex-1 flex items-center text-lg lg:text-2xl justify-end text-green-600 font-bold">+{match.user2EloChange}</span>
                    {/if}
                </div>
            </div>
        </div>
    {/each}
</div>

{#if fileError === 1}
    <Popup message="No images uploaded" duration = {5000} onClose={() => fileError = 0}/>
{/if}
{#if fileError === 2}
    <Popup message="Image too big, needs a size < 1mo" duration = {5000} onClose={() => fileError = 0}/>
{/if}
{#if fileError === 3}
    <Popup message="wrong extension detected: try using jpg, jpeg, png or webp" duration = {5000} onClose={() => fileError = 0}/>
{/if}