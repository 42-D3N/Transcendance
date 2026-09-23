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
    import { afterNavigate } from '$app/navigation'
    import { chatClient } from '$lib/chat-client.svelte.ts';
	import { formatTime } from "$lib/common";

    import type { PageProps } from './$types';
    let { data, form }: PageProps = $props();
    let friendNb = $state(0);

    // svelte-ignore state_referenced_locally
    if (!data.accPrivate && data.friends)
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
</script>

<img class="fixed inset-0 z-0 bg-[#404040] size-full" src={xp} alt=""/>

{#if data.accPrivate}
    <div class="flex ml-[10%]">
        <div class="pb-8 z-1 lg:mt-[2%] lg:p-16 pl-6 pr-6 w-[90%] h-fit">
            <div
                class="w-full h-[80%] bg-[#C0C0C0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] z-10"
                style="font-family: Tahoma, 'MS Sans Serif', sans-serif;"
            >
                <div class="flex items-center gap-2 px-2 py-1 bg-[#000080] h-fit">
                    <span class="inline-block h-[6px] w-[6px] rounded-full bg-[#00ff00] shadow-[0_0_2px_#00ff00]"></span>
                    <span class="text-white text-sm md:text-base lg:text-xl xl:text-2xl font-bold">SomePrivateAccount#67</span>
                </div>
            </div>
            <div
                class="w-full h-[80%] bg-[#C0C0C0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] z-10 p-4"
                style="font-family: Tahoma, 'MS Sans Serif', sans-serif;"
            >
                <span class="p-4 font-bold">This user made his account private</span><br>
                <a
                class="inline-block mt-3 px-3 py-1 bg-[#C0C0C0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white"
                href="../profile">
                <span class="text-black font-bold text-sm lg:text-base">Back to Profile</span>
                </a>
            </div>
        </div>
    </div>
{:else}
    <div class="flex ml-[10%]">
        <div class="pb-8 z-1 lg:mt-[2%] lg:p-16 pl-6 pr-6 w-[90%] h-fit">
            <div
                class="w-full h-[80%] bg-[#C0C0C0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] z-10"
                style="font-family: Tahoma, 'MS Sans Serif', sans-serif;"
            >
                <div class="flex items-center gap-2 px-2 py-1 bg-[#000080] h-fit">
					<span class="inline-block h-[6px] w-[6px] rounded-full {data.online?"bg-green-500":"bg-red-500"}"></span>
                    <!-- <span class="inline-block h-[6px] w-[6px] rounded-full bg-[#00ff00] shadow-[0_0_2px_#00ff00]"></span> -->
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
                        href="../profile"
                    >
                        <span class="text-black font-bold text-sm lg:text-base">Back to Profile</span>
                    </a>

                    {#if data.friends.length > 0}
                        <span class="block mt-4 text-black text-base md:text-xl font-bold">Friends:</span>
                    {/if}

                    <div class="grid grid-cols-2 xl:grid-cols-180 sm:grid-cols-4 gap-4 sm:gap-16 mt-4 w-[80%] xl:w-[40%]">
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
                                        <span class="inline-block h-[6px] w-[6px] rounded-full bg-[#00ff00] shadow-[0_0_2px_#00ff00]"></span>
                                        {#if friend.username.length + JSON.stringify(friend.id).length + 1 < 10}
                                            {friend.username}#{friend.id}
                                        {:else}
                                            {friend.username.slice(0, 7)}...
                                        {/if}
                                    </span>

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
{/if}