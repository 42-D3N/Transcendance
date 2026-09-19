<script lang="ts">
    import usericon from '$lib/assets/user/default.svg';
    import { redirect } from '@sveltejs/kit';
    import { enhance } from '$app/forms';
    import profileicon from '$lib/assets/profile_icon.svg';
    import lock from '$lib/assets/locked.svg';
    import item1 from "$lib/assets/item1.png";
    import item2 from "$lib/assets/item2.png";
    import item3 from "$lib/assets/item3.png";
    import item4 from "$lib/assets/item4.png";
    import item5 from "$lib/assets/item5.png";
    import item6 from "$lib/assets/item6.png";
    import item7 from "$lib/assets/item7.png";
    import item8 from "$lib/assets/item8.png";

    const products = [
        { id: 1, name: "Old placeholder", src: item1},
        { id: 2, name: "Game dev's fav colors", src: item2},
        { id: 3, name: "Dev's fav color", src: item3},
        { id: 4, name: "Mariposa's creation", src: item4},
        { id: 5, name: "TV snow", src: item5},
        { id: 6, name: "Light", src: item6},
        { id: 7, name: "Perturabo's love", src: item7},
        { id: 8, name: "WE ARE RICH", src: item8},
    ];
    import { afterNavigate } from '$app/navigation';
    import { chatClient } from '$lib/chat-client.svelte.ts';

    import type { PageProps } from './$types';
    let { data, form }: PageProps = $props();
    let friendNb = $state(data.friends.length);

    afterNavigate ((navigation:any) => {
        if (navigation.type === "goto" && navigation.from.route.id === "/user/profile/edit")
            chatClient.execProfileChange(data.username, data.icon);
    });

    function    Winrate()
    {
        if (parseInt(data.matches) === 0)
            return (0);
        return (parseInt(data.wins) / parseInt(data.matches));
    }

    function redirectToProfiles(username: string)
    {
        redirect(308, "./user/member/"+username);
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

<div class="fixed inset-0 z-0 bg-[#333131FF] size-full"></div>

<div class="flex ml-[10%]">
    <div class="pb-8 z-1 lg:mt-[2%] lg:p-16 pl-6 pr-6 w-[90%] h-fit">
        <div class="pb-8 w-full h-[80%] bg-[#292626FF] border-solid rounded-lg z-10">
            
            <div class="flex p-4">
                {#if !data.icon}
                    <img class="upload block lg:h-[16rem] lg:w-[16rem] h-[8rem] w-[8rem] border-solid rounded-md bg-amber-50" src={usericon} alt=""/>
                {:else}
                    <img class="upload block lg:h-[16rem] lg:w-[16rem] h-[8rem] w-[8rem] border-solid rounded-md bg-amber-50" src={data.icon} alt=""/>
                {/if}
                <div>
                    <span class="block pl-6 font-black text-white text-3xl md:text-6xl">{data.username}#{data.id}</span>

                    <span class="pl-12 pt-6 font-semibold text-zinc-400 text-xl lg:text-2xl">Wallets:</span>
                    <span class="pt-6 font-semibold text-white text-xl lg:text-2xl">{data.wallet}</span>
                    <span class="block"></span>
                    <span class="pl-12 text-zinc-400 text-lg lg:text-xl">Winrate:</span>
                    <span class="text-white text-lg lg:text-xl">{Winrate()}</span>
                </div>
            </div>
            <span class="pl-12 text-white text-lg lg:text-3xl lg:font-light">Friends: {friendNb} | don't forget you can chat with your friends!</span>
            <a class="block ml-4 mt-4 w-fit p-2 bg-[#333131FF] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md" href="./profile/edit">
                <span class="text-white font-bold lg:text-3xl p-4">Edit Profile</span>
            </a>
            {#if data.friends.length > 0}
                <span class="block mt-4 pl-6 font-black text-white text-xl md:text-3xl">Friends:</span>
            {/if}
            <div class="grid grid-cols-4 gap-4 mt-4 ml-8 lg:ml-4 w-[60%] lg:w-[40%]">
                {#each data.friends as friend}
                    <form method="POST" enctype="multipart/form-data" class="flex size-fit" action="?/rmFriend" use:enhance={({ formData }) => {
                        formData.append('friend', JSON.stringify(friend.id));
                        formData.append('user', JSON.stringify(data.id));
                    }}
                    >
                        <a class="relative z-0" href={"/user/member/"+friend.username+"_"+JSON.stringify(friend.id)}>
                            <button class="absolute z-10 h-[1rem] w-[1rem] lg:h-[2rem] lg:w-[2rem] right-0 bg-red-600 hover:bg-red-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md" onclick={(event) => {event.stopPropagation(); friendNb-- }} type="submit" title="endFriend"></button>
                            <div class="bg-stone-700 size-fit p-2 rounded-md">
                                {#if !friend.icon}
                                    <img class="block ml-4 lg:m-4 2xl:h-[6rem] 2xl:w-[6rem] xl:h-[5rem] xl:w-[5rem] h-[3rem] w-[3rem] border-solid rounded-md bg-amber-50" src={usericon} alt=""/>
                                {:else}
                                    <img class="block ml-4 lg:m-4 2xl:h-[6rem] 2xl:w-[6rem] xl:h-[5rem] xl:w-[5rem] h-[3rem] w-[3rem] border-solid rounded-md bg-amber-50" src={friend.icon} alt=""/>
                                {/if}
                                {#if friend.username.length+JSON.stringify(friend.id).length+1 < 10}
                                    <span class="ml-2 text-lg xl:text-2xl lg:pl-2 lg:ml-2 lg:mt-1 font-md lg:mt-5">{friend.username}#{friend.id}</span>
                                {:else}
                                    <span class="ml-2 text-lg xl:text-2xl lg:pl-2 lg:ml-2 lg:mt-1 font-md lg:mt-5">{friend.username.slice(0, 7)}...</span>
                                {/if}
                            </div>
                        </a>
                    </form>
                {/each}
            </div>
        </div>

        <div class="mt-[4%] w-full h-[20%] bg-[#292626FF] border-solid rounded-lg z-10 p-4">
            <div class="w-full h-[20%] bg-[#292626FF] border-solid rounded-lg border z-10 p-4">
                <span class="text-white text-xl lg:text-4xl font-bold">Racket skins:</span>
                <div class="flex overflow-x-scroll m-4">
                    {#each data.skins as Skin}
                        {#if data.userSkins.skinRac === Skin.product}
                            <form method="POST" enctype="multipart/form-data" class="flex shrink-0 flex-col items-center bg-[#3f2056FF] rounded-xl border border-[#724197FF] m-4" use:enhance={({ formData }) => {
                                    formData.append('userId', JSON.stringify(data.id));
                                    formData.append('owned', JSON.stringify(Skin.own));
                                }}>
                                <button type="submit" class="flex shrink-0 flex-col items-center" formaction="?/unequipRac">
                                    <div class="relative m-2 lg:h-[18rem] lg:w-[18rem] h-[8rem] w-[8rem]">
                                        <img class="block h-full w-full border-solid" src={products[Skin.product - 1].src} alt=""/>
                                        <span class="absolute top-0 right-0 text-xs lg:text-lg italic px-1">equipped✓</span>
                                    </div>
                                    <span class="text-xs lg:text-lg text-[#930f86FF] font-bold self-start text-left ml-2">{products[Skin.product - 1].name}</span>
                                </button>
                            </form>
                        {:else}
                            <form method="POST" enctype="multipart/form-data" class="flex flex-shrink-0 flex-col items-center bg-stone-700 rounded-xl border m-4" use:enhance={({ formData }) => {
                                    formData.append('userId', JSON.stringify(data.id));
                                    formData.append('product', JSON.stringify(Skin.product));
                                    formData.append('owned', JSON.stringify(Skin.own));
                                }}
                                >
                                <button type="submit" class="flex flex-shrink-0 flex-col items-center" formaction="?/changeSkinRac">
                                    {#if !Skin.own}
                                        <div class="flex flex-col m-2 lg:h-[18rem] lg:w-[18rem] h-[8rem] w-[8rem] border-solid border border-white bg-[#161825FF] justify-center items-center">
                                            <img class="lg:h-[2rem] lg:w-[2rem] h-[1rem] w-[1rem]" src={lock} alt=""/>
                                        </div>
                                        <span class="italic text-xs lg:text-lg">Go to shop to buy it now</span>
                                    {:else}
                                        <img class="block m-2 lg:h-[18rem] lg:w-[18rem] h-[8rem] w-[8rem] border-solid border" src={products[Skin.product - 1].src} alt=""/>
                                        <span class="text-xs lg:text-lg text-[#161825FF] font-bold self-start text-left ml-2">{products[Skin.product - 1].name}</span>
                                    {/if}
                                </button>
                            </form>
                        {/if}
                    {/each}
                </div>
            </div>
    
            <div class="mt-[1%] w-full h-[20%] bg-[#292626FF] border-solid border rounded-lg z-10 p-4">
                <span class="text-white text-xl lg:text-4xl font-bold">Ball skins:</span>
                <div class="flex overflow-x-scroll m-4">
                    {#each data.skins.reverse() as Skin}
                        {#if data.userSkins.skinBall === Skin.product}
                            <form method="POST" enctype="multipart/form-data" class="flex shrink-0 flex-col items-center bg-[#3f2056FF] rounded-xl border border-[#724197FF] m-4" use:enhance={({ formData }) => {
                                    formData.append('userId', JSON.stringify(data.id));
                                    formData.append('owned', JSON.stringify(Skin.own));
                                }}>
                                <button type="submit" class="flex shrink-0 flex-col items-center" formaction="?/unequipBall">
                                    <div class="relative m-2 lg:h-[18rem] lg:w-[18rem] h-[8rem] w-[8rem]">
                                        <img class="block h-full w-full border-solid" src={products[Skin.product - 1].src} alt=""/>
                                        <span class="absolute top-0 right-0 text-xs lg:text-lg italic px-1">equipped✓</span>
                                    </div>
                                    <span class="text-xs lg:text-lg text-[#930f86FF] font-bold self-start text-left ml-2">{products[Skin.product - 1].name}</span>
                                </button>
                            </form>
                        {:else}
                            <form method="POST" enctype="multipart/form-data" class="flex shrink-0 flex-col items-center bg-stone-700 rounded-xl border m-4" use:enhance={({ formData }) => {
                                    formData.append('userId', JSON.stringify(data.id));
                                    formData.append('product', JSON.stringify(Skin.product));
                                    formData.append('owned', JSON.stringify(Skin.own));
                                }}>
                                <button type="submit" class="flex shrink-0 flex-col items-center" formaction="?/changeSkinBall">
                                    {#if !Skin.own}
                                        <div class="flex flex-col m-2 lg:h-[18rem] lg:w-[18rem] h-[8rem] w-[8rem] border-solid border border-white bg-[#161825FF] justify-center items-center">
                                            <img class="lg:h-[2rem] lg:w-[2rem] h-[1rem] w-[1rem]" src={lock} alt=""/>
                                        </div>
                                        <span class="italic text-xs lg:text-lg">Go to shop to buy it now</span>
                                    {:else}
                                        <img class="block m-2 lg:h-[18rem] lg:w-[18rem] h-[8rem] w-[8rem] border-solid border" src={products[Skin.product - 1].src} alt=""/>
                                        <span class="text-xs lg:text-lg text-[#161825FF] font-bold self-start text-left ml-2">{products[Skin.product - 1].name}</span>
                                    {/if}
                                </button>
                            </form>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>

        <div class="block mt-[4%] pb-8 bg-[#292626FF] border-solid rounded-lg z-10 pt-4">
            <div class="flex">
                <span class="text-white text-xl lg:text-4xl font-bold p-4 pt-1">Add friends:</span>
                <div>
                    <form method="POST" enctype="multipart/form-data" class="flex size-fit" action="?/sendRequest">
                    <input name="username" type="username" class="inline font-normal size-fit bg-[#333131FF] text-white text- lg:text-4xl w-[80%]" placeholder="<username>#<tag>">
                    <button class="mr-2 size-fit p-2 bg-green-600 hover:bg-green-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md" type="submit">
                        <img class="size-5 lg:size-8" src={profileicon} alt="icon"/>
                    </button>
                    </form>
                    {#if form?.nameFormat }<p class="error">Wrong username format</p>{/if}
                    {#if form?.accountNotFound }<p class="error">Account not found</p>{/if}
                    {#if form?.usernameNotMatching }<p class="error">Verify the username</p>{/if}
                    {#if form?.tryAgain }<p class="error">Something went wrong</p>{/if}
                    {#if form?.sillyTester }<p class="error">Tuff test fr fr</p>{/if}
                    {#if form?.relationExisting }<p class="error">Already your friend</p>{/if}
                    {#if form?.requestPending }<p class="error">invite already pending</p>{/if}
                </div>
            </div>

            <div class="m-4">
                {#each data.friendRequests as frRequests}
                    <form method="POST" enctype="multipart/form-data" class="flex bg-stone-700 rounded-md mb-4" use:enhance={({ formData }) => {
                        formData.append('user1', JSON.stringify(frRequests.user1));
                        formData.append('user2', JSON.stringify(frRequests.user2));
                    }}
                    >
                        {#if !frRequests.icon}
                            <img class="upload block m-2 lg:h-[4rem] lg:w-[4rem] h-[2rem] w-[2rem] border-solid rounded-md bg-amber-50" src={usericon} alt=""/>
                        {:else}
                            <img class="upload block m-2 lg:h-[4rem] lg:w-[4rem] h-[2rem] w-[2rem] border-solid rounded-md bg-amber-50" src={frRequests.icon} alt=""/>
                        {/if}
                        <span class="pl-2 mt-1 font-md lg:mt-5">{frRequests.username}#{frRequests.id}</span>

                        <div class="flex ml-auto gap-2">
                            <button class="mt-2 h-[2rem] w-[2rem] lg:h-[4rem] lg:w-[4rem] bg-green-600 hover:bg-green-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md" type="submit" title="accept" formaction="?/acceptRequest" onclick={() => { friendNb++ }}></button>
                            <button class="mt-2 mr-2 h-[2rem] w-[2rem] lg:h-[4rem] lg:w-[4rem] bg-red-600 hover:bg-red-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md" type="submit" title="refuse" formaction="?/refuseRequest"></button>
                        </div>
                    </form>
                {/each}
            </div>
        </div> 

        {#if parseInt(data.matches) > 0}
            <div class="mt-[4%] w-fit h-[20%] bg-[#292626FF] border-solid rounded-lg z-10 p-4">
                    <span class="text-white text-xl lg:text-4xl font-bold">Match History:</span>
                    <span class="text-zinc-400 text-xl lg:text-4xl font-bold">({data.matches})</span>
            </div>
        {/if}

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
</div>
