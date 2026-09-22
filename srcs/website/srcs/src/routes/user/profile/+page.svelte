<script lang="ts">
    import usericon from '$lib/assets/user/default.svg';
    import { redirect } from '@sveltejs/kit';
    import { enhance } from '$app/forms';
    import profileicon from '$lib/assets/profile_icon.svg';
    import xp from '$lib/assets/test.webp';
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
    let friendNb = $state(0);
    // svelte-ignore state_referenced_locally
    if (data.friends)
        friendNb = data.friends.length;

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

<img class="fixed inset-0 z-0 bg-[#404040] size-full" src={xp} alt=""/>

<div class="flex ml-[10%]">
    <div class="pb-8 z-1 lg:mt-[2%] lg:p-16 pl-6 pr-6 w-[90%] h-fit">
    <div
            class="w-full h-[80%] bg-[#C0C0C0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] z-10"
            style="font-family: Tahoma, 'MS Sans Serif', sans-serif;"
        >
            <div class="flex items-center gap-2 px-2 py-1 bg-[#000080] h-fit">
                <span class="inline-block h-[6px] w-[6px] rounded-full bg-[#00ff00] shadow-[0_0_2px_#00ff00]"></span>
                <span class="text-white text-sm md:text-base lg:text-xl xl:text-2xl font-bold">{data.username}#{data.id}</span>
            </div>

            <div class="p-4">
                <div class="flex gap-4">
                    <div class="p-[2px] bg-white border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white h-fit">
                        {#if !data.icon}
                            <img class="block lg:h-[14rem] lg:w-[14rem] h-[7rem] w-[7rem] bg-amber-50" src={usericon} alt="" />
                        {:else}
                            <img class="block lg:h-[14rem] lg:w-[14rem] h-[7rem] w-[7rem] bg-amber-50" src={data.icon} alt="" />
                        {/if}
                    </div>

                    <div class="flex flex-col gap-1 pt-1">
                        <div class="flex gap-2 text-sm lg:text-base">
                            <span class="text-[#404040]">Wallets:</span>
                            <span class="text-black font-bold">{data.wallet}</span>
                        </div>
                        <div class="flex gap-2 text-sm lg:text-base">
                            <span class="text-[#404040]">Winrate:</span>
                            <span class="text-black font-bold">{Winrate()}</span>
                        </div>
                    </div>
                </div>

                <span class="block mt-4 text-black text-sm lg:text-lg">
                    Friends: {friendNb} | don't forget you can chat with your friends!
                </span>

                <a
                    class="inline-block mt-3 px-3 py-1 bg-[#C0C0C0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white"
                    href="./profile/edit"
                >
                    <span class="text-black font-bold text-sm lg:text-base">Edit Profile</span>
                </a>

                {#if data.friends.length > 0}
                    <span class="block mt-4 text-black text-base md:text-xl font-bold">Friends:</span>
                {/if}

                <div class="grid grid-cols-4 gap-4 mt-4 w-[60%] lg:w-[40%]">
                {#each data.friends as friend}
                    <form method="POST" enctype="multipart/form-data" class="flex size-fit" action="?/rmFriend" use:enhance={({ formData }) => {
                            formData.append('friend', JSON.stringify(friend.id));
                            formData.append('user', JSON.stringify(data.id));
                        }}>
                        <a class="relative z-0 block"
                            href={"/user/member/" + friend.username + "_" + JSON.stringify(friend.id)}>
                            <div
                                class="flex items-center justify-between gap-2 px-1 py-0.5 bg-[#000080] text-white"
                                style="font-family: Tahoma, 'MS Sans Serif', sans-serif; font-size: 11px;"
                            >
                                <span class="truncate flex items-center gap-1">
                                    <span class="inline-block h-[6px] w-[6px] rounded-full {friend.online?"bg-green-500":"bg-red-500"} shadow-[0_0_2px_#00ff00]"></span>

                                    {#if friend.username.length + JSON.stringify(friend.id).length + 1 < 10}
                                        {friend.username}#{friend.id}
                                    {:else}
                                        {friend.username.slice(0, 7)}...
                                    {/if}
                                </span>

                                <button
                                    class="h-[14px] w-[14px] shrink-0 leading-none text-[10px] font-bold text-black bg-[#C0C0C0] border-t border-l border-white border-b-2 border-r-2 border-b-[#404040] border-r-[#404040] active:border-t-2 active:border-l-2 active:border-b active:border-r active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white"
                                    onclick={(event) => { event.stopPropagation(); friendNb--; }}
                                    type="submit"
                                    title="endFriend"
                                >
                                    ×
                                </button>
                            </div>

                            <div
                                class="flex items-center gap-3 p-2 bg-[#C0C0C0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040]"
                            >
                                <div class="p-[2px] bg-white border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white shrink-0">
                                    <div class="h-[3rem] w-[3rem] lg:h-[4rem] lg:w-[4rem] 2xl:h-[5rem] 2xl:w-[5rem] aspect-square overflow-hidden bg-amber-50">
                                        {#if !friend.icon}
                                            <img
                                                class="block h-full w-full aspect-square object-cover"
                                                src={usericon}
                                                alt=""
                                            />
                                        {:else}
                                            <img
                                                class="block h-full w-full aspect-square object-cover"
                                                src={friend.icon}
                                                alt=""
                                            />
                                        {/if}
                                    </div>
                                </div>

                                <span
                                    class="text-black text-sm lg:text-base"
                                    style="font-family: Tahoma, 'MS Sans Serif', sans-serif;"
                                >
                                    {#if friend.username.length + JSON.stringify(friend.id).length + 1 < 10}
                                        {friend.username}#{friend.id}
                                    {:else}
                                        {friend.username.slice(0, 7)}...
                                    {/if}
                                </span>
                            </div>
                        </a>
                    </form>
                {/each}
                </div>
            </div>
        </div>

        <div
            class="mt-[4%] w-full bg-[#C0C0C0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] z-10 overflow-hidden"
            style="font-family: Tahoma, 'MS Sans Serif', sans-serif;"
        >
            <div class="flex items-center gap-2 px-2 py-1 bg-[#000080]">
                <span class="text-white text-sm md:text-base font-bold">Skins</span>
            </div>

            <div class="p-4 flex flex-col gap-4 min-w-0">

                <fieldset class="border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white px-3 pb-3 pt-1 min-w-0">
                    <legend class="px-1 text-black text-sm lg:text-lg font-bold">Racket skins</legend>

                    <div class="retro-scroll flex overflow-x-scroll gap-4 py-2 min-w-0">
                        {#each data.skins as Skin}
                            {#if data.userSkins.skinRac === Skin.product}
                                <form method="POST" enctype="multipart/form-data" class="flex shrink-0 flex-col" action="?/unequipRac" use:enhance={({ formData }) => {
                                        formData.append('userId', JSON.stringify(data.id));
                                        formData.append('owned', JSON.stringify(Skin.own));
                                    }}>
                                    <button type="submit" class="flex flex-col text-left" formaction="?/unequipRac">
                                        <div class="relative lg:h-[20rem] lg:w-[20rem] h-[14rem] w-[14rem] bg-[#000080] border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white flex items-center justify-center">
                                            <img class="max-h-full max-w-full object-contain" src={products[Skin.product - 1].src} alt="" />
                                            <span class="absolute bottom-0 right-0 text-white text-[10px] lg:text-xs px-1 bg-[#000080]">equipped ✓</span>
                                        </div>
                                        <span class="text-xs lg:text-sm text-black font-bold mt-1">{products[Skin.product - 1].name}</span>
                                    </button>
                                </form>
                            {:else}
                                <form method="POST" enctype="multipart/form-data" class="flex shrink-0 flex-col" action="?/changeSkinRac" use:enhance={({ formData }) => {
                                        formData.append('userId', JSON.stringify(data.id));
                                        formData.append('product', JSON.stringify(Skin.product));
                                        formData.append('owned', JSON.stringify(Skin.own));
                                    }}>
                                    <button type="submit" class="flex flex-col text-left" formaction="?/changeSkinRac">
                                        {#if !Skin.own}
                                            <div class="flex flex-col lg:h-[20rem] lg:w-[20rem] h-[14rem] w-[14rem] bg-[#808080] border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white justify-center items-center">
                                                <img class="lg:h-[2rem] lg:w-[2rem] h-[1rem] w-[1rem]" src={lock} alt="" />
                                            </div>
                                            <span class="italic text-[10px] lg:text-xs text-black mt-1">Go to shop to buy it now</span>
                                        {:else}
                                            <div class="lg:h-[20rem] lg:w-[20rem] h-[14rem] w-[14rem] bg-[#404040] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] flex items-center justify-center">
                                                <img class="max-h-full max-w-full object-contain" src={products[Skin.product - 1].src} alt="" />
                                            </div>
                                            <span class="text-xs lg:text-sm text-black font-bold mt-1">{products[Skin.product - 1].name}</span>
                                        {/if}
                                    </button>
                                </form>
                            {/if}
                        {/each}
                    </div>
                </fieldset>

                <fieldset class="border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white px-3 pb-3 pt-1 min-w-0">
                    <legend class="px-1 text-black text-sm lg:text-lg font-bold">Ball skins</legend>

                    <div class="retro-scroll flex overflow-x-scroll gap-4 py-2 min-w-0">
                        {#each data.skins.reverse() as Skin}
                            {#if data.userSkins.skinBall === Skin.product}
                                <form method="POST" enctype="multipart/form-data" class="flex shrink-0 flex-col" action="?/unequipBall" use:enhance={({ formData }) => {
                                        formData.append('userId', JSON.stringify(data.id));
                                        formData.append('owned', JSON.stringify(Skin.own));
                                    }}>
                                    <button type="submit" class="flex flex-col text-left" formaction="?/unequipBall">
                                        <div class="relative lg:h-[20rem] lg:w-[20rem] h-[14rem] w-[14rem] bg-[#000080] border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white flex items-center justify-center">
                                            <img class="max-h-full max-w-full object-contain" src={products[Skin.product - 1].src} alt="" />
                                            <span class="absolute bottom-0 right-0 text-white text-[10px] lg:text-xs px-1 bg-[#000080]">equipped ✓</span>
                                        </div>
                                        <span class="text-xs lg:text-sm text-black font-bold mt-1">{products[Skin.product - 1].name}</span>
                                    </button>
                                </form>
                            {:else}
                                <form method="POST" enctype="multipart/form-data" class="flex shrink-0 flex-col" action="?/changeSkinBall" use:enhance={({ formData }) => {
                                        formData.append('userId', JSON.stringify(data.id));
                                        formData.append('product', JSON.stringify(Skin.product));
                                        formData.append('owned', JSON.stringify(Skin.own));
                                    }}>
                                    <button type="submit" class="flex flex-col text-left" formaction="?/changeSkinBall">
                                        {#if !Skin.own}
                                            <div class="flex flex-col lg:h-[20rem] lg:w-[20rem] h-[14rem] w-[14rem] bg-[#808080] border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white justify-center items-center">
                                                <img class="lg:h-[2rem] lg:w-[2rem] h-[1rem] w-[1rem]" src={lock} alt="" />
                                            </div>
                                            <span class="italic text-[10px] lg:text-xs text-black mt-1">Go to shop to buy it now</span>
                                        {:else}
                                            <div class="lg:h-[20rem] lg:w-[20rem] h-[14rem] w-[14rem] bg-[#404040] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] flex items-center justify-center">
                                                <img class="max-h-full max-w-full object-contain" src={products[Skin.product - 1].src} alt="" />
                                            </div>
                                            <span class="text-xs lg:text-sm text-black font-bold mt-1">{products[Skin.product - 1].name}</span>
                                        {/if}
                                    </button>
                                </form>
                            {/if}
                        {/each}
                    </div>
                </fieldset>

            </div>
        </div>

        <div
            class="block mt-[4%] bg-[#C0C0C0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] z-10"
            style="font-family: Tahoma, 'MS Sans Serif', sans-serif;"
        >
            <div class="flex items-center px-2 py-1 bg-[#000080]">
                <span class="text-white text-sm lg:text-lg font-bold">Add friends</span>
            </div>

            <div class="p-3">
                <div class="flex items-center gap-2">
                    <form method="POST" enctype="multipart/form-data" class="flex items-center gap-2" action="?/sendRequest">
                        <input
                            name="username"
                            type="username"
                            class="font-normal bg-white text-black text-sm lg:text-lg w-[80%] px-2 py-1 border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white outline-none"
                            placeholder="<username>#<tag>"
                        />
                        <button
                            class="p-1 bg-[#C0C0C0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white"
                            type="submit"
                        >
                            <img class="size-5 lg:size-8" src={profileicon} alt="icon" />
                        </button>
                    </form>
                </div>

                {#if form?.nameFormat}<p class="error text-[#800000] text-sm mt-1">Wrong username format</p>{/if}
                {#if form?.accountNotFound}<p class="error text-[#800000] text-sm mt-1">Account not found</p>{/if}
                {#if form?.usernameNotMatching}<p class="error text-[#800000] text-sm mt-1">Verify the username</p>{/if}
                {#if form?.tryAgain}<p class="error text-[#800000] text-sm mt-1">Something went wrong</p>{/if}
                {#if form?.sillyTester}<p class="error text-[#800000] text-sm mt-1">Tuff test fr fr</p>{/if}
                {#if form?.relationExisting}<p class="error text-[#800000] text-sm mt-1">Already your friend</p>{/if}
                {#if form?.requestPending}<p class="error text-[#800000] text-sm mt-1">Invite already pending</p>{/if}
            </div>

            <div class="mx-3 mb-3 bg-white border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white p-1">
                {#each data.friendRequests as frRequests}
                    <form
                        method="POST"
                        enctype="multipart/form-data"
                        class="flex items-center bg-[#C0C0C0] mb-1 last:mb-0 px-1 py-1 border-t border-l border-b border-r border-t-white border-l-white border-b-[#808080] border-r-[#808080]"
                        use:enhance={({ formData }) => {
                            formData.append('user1', JSON.stringify(frRequests.user1));
                            formData.append('user2', JSON.stringify(frRequests.user2));
                        }}
                    >
                        <div class="p-[2px] bg-white border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#404040] border-l-[#404040] border-b-white border-r-white m-1">
                            {#if !frRequests.icon}
                                <img class="upload block lg:h-[3rem] lg:w-[3rem] h-[1.5rem] w-[1.5rem] bg-amber-50" src={usericon} alt="" />
                            {:else}
                                <img class="upload block lg:h-[3rem] lg:w-[3rem] h-[1.5rem] w-[1.5rem] bg-amber-50" src={frRequests.icon} alt="" />
                            {/if}
                        </div>
                        <span class="pl-2 text-black text-sm lg:text-base">{frRequests.username}#{frRequests.id}</span>

                        <div class="flex ml-auto gap-1">
                            <button
                                class="h-[1.5rem] w-[1.5rem] lg:h-[2.5rem] lg:w-[2.5rem] flex items-center justify-center bg-[#C0C0C0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white text-[#008000] font-bold leading-none"
                                type="submit"
                                title="accept"
                                formaction="?/acceptRequest"
                                onclick={() => { friendNb++; }}
                            >
                                ✓
                            </button>
                            <button
                                class="h-[1.5rem] w-[1.5rem] lg:h-[2.5rem] lg:w-[2.5rem] flex items-center justify-center bg-[#C0C0C0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white text-[#800000] font-bold leading-none"
                                type="submit"
                                title="refuse"
                                formaction="?/refuseRequest"
                            >
                                ×
                            </button>
                        </div>
                    </form>
                {/each}
            </div>
        </div>

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
</div>
