<script lang="ts">
    let { data, form } = $props();
    import { enhance } from '$app/forms';
    import Popup from "$lib/Popup.svelte";
    import { redirect } from '@sveltejs/kit';
    import xp from '$lib/assets/test.webp';
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

<img class="fixed inset-0 z-0 bg-[#404040] size-full" src={xp} alt=""/>
<div class="lg:scale-120 pb-8 z-1 lg:mt-[2%] lg:p-16 pl-6 pr-6 lg:ml-[25%] lg:w-[50%]">
    <form method="POST" enctype="multipart/form-data" use:enhance>
        <div
            class="w-full bg-[#C0C0C0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] z-10"
            style="font-family: Tahoma, 'MS Sans Serif', sans-serif;"
        >
            <div class="flex items-center gap-2 px-2 py-1 bg-[#000080]">
                <span class="text-white text-sm md:text-base font-bold">Edit Profile</span>
            </div>

            <div class="p-4">
                <div class="flex gap-4">
                    {#if avatar}
                        <div class="relative">
                            <button type="button" class="p-[2px] bg-white border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white" onclick={() => fileinput.click()}>
                                <img
                                    class="upload block hover:opacity-80 lg:h-[10rem] lg:w-[10rem] h-[7rem] w-[7rem] bg-amber-50"
                                    src={avatar}
                                    alt="Your avatar"
                                />
							</button>
                            <button
                                class="absolute h-[18px] w-[18px] flex items-center justify-center text-[11px] font-bold text-black bg-[#C0C0C0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white right-0 top-0"
                                onclick={NoNoYourPreviewSuckPlsDeleteItDaddy}
                            >
                                ✕
                            </button>
                        </div>
                    {:else}
                        {#if !data.icon}
                            <button type="button" class="p-[2px] bg-white border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white h-fit" onclick={() => fileinput.click()}>
                                <img
                                    class="upload block hover:opacity-80 lg:h-[10rem] lg:w-[10rem] h-[7rem] w-[7rem] bg-amber-50"
                                    src={usericon}
                                    alt="Your avatar"
                                />
                            </button>
                        {:else}
                            <div class="relative">
                                <button type="button" class="p-[2px] bg-white border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white" onclick={() => fileinput.click()}>
                                    <img
                                        class="upload block hover:opacity-80 lg:h-[10rem] lg:w-[10rem] h-[7rem] w-[7rem] bg-amber-50"
                                        src={data.icon}
                                        alt={data.icon}
                                    />
                                </button>
                                <button
                                    class="absolute h-[18px] w-[18px] flex items-center justify-center text-[11px] font-bold text-black bg-[#C0C0C0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white right-0 top-0"
                                    type="submit"
                                    formaction="?/delIcon"
                                >
                                    ✕
                                </button>
                            </div>
                        {/if}
                    {/if}

                    <input
                        name="icon"
                        style="display:none"
                        type="file"
                        accept=".jpg, .jpeg, .png, .webp"
                        onchange={onFileSelected}
                        bind:this={fileinput}
                    />

                    <div class="flex flex-col gap-1.5 pt-1 min-w-0">
                        <div class="flex items-center gap-2">
                            <span class="text-black text-sm w-16 shrink-0">Username:</span>
                            <input
                                name="username"
                                value={data.username}
                                type="username"
                                class="font-bold text-black text-base bg-white px-2 py-0.5 border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white outline-none w-[16ch]"
                            />
                        </div>
                        {#if form?.invalidName}<p class="error text-[#800000] text-xs ml-[4.5rem]">please enter a valid username</p>{/if}

                        <div class="flex items-center gap-2">
                            <span class="text-black text-sm w-16 shrink-0">Email:</span>
                            <input
                                name="email"
                                value={data.email}
                                type="email"
                                class="font-bold text-black text-base bg-white px-2 py-0.5 border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white outline-none w-full max-w-[22ch]"
                            />
                        </div>
                        {#if form?.invalidMail}<p class="error text-[#800000] text-xs ml-[4.5rem]">please enter a valid email address</p>{/if}
                        {#if form?.somethingExists}<p class="error text-[#800000] text-xs ml-[4.5rem]">username or mail already taken</p>{/if}

                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-[#404040] text-sm w-16 shrink-0">Wallets:</span>
                            <input
                                name="wallet"
                                value={data.wallet}
                                type="wallet"
                                class="font-bold text-black text-sm bg-white px-2 py-0.5 border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white outline-none w-[6ch]"
                            />
                        </div>

                        <div class="flex items-center gap-2">
                            <span class="text-[#404040] text-sm w-16 shrink-0">Winrate:</span>
                            <span class="text-black text-sm">{Winrate()}</span>
                        </div>
                    </div>
                </div>

                <label class="flex items-center gap-2 mt-4">
                    <input
                        type="checkbox"
                        id="agree"
                        name="agree"
                        checked={data.privateAcc}
                        value="private"
                        class="h-[14px] w-[14px] appearance-none bg-white border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white checked:bg-white relative checked:after:content-['✓'] checked:after:absolute checked:after:text-[10px] checked:after:font-bold checked:after:text-black checked:after:leading-none checked:after:left-[2px] checked:after:top-[-1px]"
                    />
                    <span class="text-black text-sm">Make account private</span>
                </label>

                <button
                    class="mt-4 px-4 py-1.5 bg-[#C0C0C0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white"
                    type="submit"
                    formaction="?/saveMods"
                >
                    <span class="text-black font-bold text-sm">Save Changes</span>
                </button>
            </div>
        </div>
    </form>

    {#if parseInt(data.matches) > 0}
        <div
            class="mt-[4%] w-fit bg-[#C0C0C0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] z-10 px-3 py-2"
            style="font-family: Tahoma, 'MS Sans Serif', sans-serif;"
        >
            <span class="text-black text-sm lg:text-lg font-bold">Match History:</span>
            <span class="text-[#404040] text-sm lg:text-lg font-bold">({data.matches})</span>
        </div>
    {/if}

    {#each data.matchHistory as match}
        <div
            class="block mt-[1%] w-full bg-[#C0C0C0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] z-10"
            style="font-family: Tahoma, 'MS Sans Serif', sans-serif;"
        >
            <div class="flex items-center px-3 py-1 bg-[#000080]">
                {#if match.winner === data.id}
                    <span class="text-[#00ff00] text-sm lg:text-lg font-bold">Win</span>
                {:else}
                    <span class="text-[#ff5555] text-sm lg:text-lg font-bold">Lose</span>
                {/if}

                <span class="ml-auto text-white text-xs lg:text-sm">{formatTime(new Date(match.date))}</span>
            </div>

            <div class="mx-3 mt-2 border-t border-[#808080]">
                <div class="border-t border-white w-[20%] lg:w-[8%]"></div>
            </div>

            <div class="p-3">
                <div class="flex items-center">
                    <div class="flex-1 flex items-center">
                        <a class="w-fit" href={"/user/member/" + match.user1Pseudo + "_" + JSON.stringify(match.user1)}>
                            <span class="text-sm lg:text-xl text-black font-semibold hover:underline" style="color: #0000EE;">{match.user1Pseudo}#{match.user1}</span>
                        </a>
                    </div>

                    <div class="flex items-center gap-2 bg-white px-3 py-1 border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white">
                        {#if match.user1Score > match.user2Score}
                            <span class="text-sm lg:text-xl font-bold text-[#008000]">{match.user1Score}</span>
                            <span class="text-[#808080]">|</span>
                            <span class="text-sm lg:text-xl font-bold text-[#800000]">{match.user2Score}</span>
                        {:else}
                            <span class="text-sm lg:text-xl font-bold text-[#800000]">{match.user1Score}</span>
                            <span class="text-[#808080]">|</span>
                            <span class="text-sm lg:text-xl font-bold text-[#008000]">{match.user2Score}</span>
                        {/if}
                    </div>

                    <div class="flex-1 flex items-center justify-end">
                        <a class="w-fit" href={"/user/member/" + match.user2Pseudo + "_" + JSON.stringify(match.user2)}>
                            <span class="text-sm lg:text-xl text-black font-semibold hover:underline" style="color: #0000EE;">{match.user2Pseudo}#{match.user2}</span>
                        </a>
                    </div>
                </div>

                <div class="flex w-full mt-1">
                    {#if match.user1EloChange > 0}
                        <span class="flex-1 text-xs lg:text-base text-[#008000] font-bold">+{match.user1EloChange}</span>
                        <span class="flex-1 text-right text-xs lg:text-base text-[#800000] font-bold">{match.user2EloChange}</span>
                    {:else}
                        <span class="flex-1 text-xs lg:text-base text-[#800000] font-bold">{match.user1EloChange}</span>
                        <span class="flex-1 text-right text-xs lg:text-base text-[#008000] font-bold">+{match.user2EloChange}</span>
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