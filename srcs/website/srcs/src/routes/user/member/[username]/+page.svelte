<script lang="ts">
    import usericon from '$lib/assets/user/default.svg';
    import { redirect } from '@sveltejs/kit';
    import { enhance } from '$app/forms';
    import profileicon from '$lib/assets/profile_icon.svg';

    import type { PageProps } from './$types';
    let { data, form }: PageProps = $props();
    let friendNb = $state(0);
    if (!data.accPrivate)
        friendNb = data.friends.length;

    function    Winrate()
    {
        if (parseInt(data.matches) === 0)
            return (0);
        return (parseInt(data.wins) / parseInt(data.matches));
    }
    function    EditProfile()
    {
        redirect(308, "./edit");
    }
</script>

<div class="fixed inset-0 z-0 bg-[#333131FF] size-full"></div>

{#if data.accPrivate}
    <div class="flex ml-[10%] h-[50%]">
        <div class="pb-8 z-1 lg:mt-[2%] lg:p-16 pl-6 pr-6 w-[90%] h-[50%]">
            <div class="pb-8 size-full bg-[#292626FF] border-solid rounded-lg z-10">
                <div class="text-white font-bold mt-[10%] lg:mt-0 text-md lg:text-3xl p-12">This user made his account private</div>
                <a class="block ml-12 mt-4 w-fit p-2 bg-[#7a2020] hover:bg-[#9e1e1e] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md" href="/user/profile">
                    <span class="text-white font-bold lg:text-3xl p-4">Back to profile</span>
                </a>
            </div>
        </div>
    </div>
{:else}
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
                <a class="block ml-4 mt-4 w-fit p-2 bg-[#7a2020] hover:bg-[#9e1e1e] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md" href="/user/profile">
                    <span class="text-white font-bold lg:text-3xl p-4">Back to profile</span>
                </a>
                {#if data.friends.length > 0}
                    <span class="block mt-4 pl-6 font-black text-white text-xl md:text-3xl">Friends:</span>
                {/if}
                <div class="grid grid-cols-4 gap-4 mt-4 ml-8 lg:ml-4 w-[60%] lg:w-[40%]">
                    {#each data.friends as friend}
                        <a href={"/user/member/"+friend.username+"_"+JSON.stringify(friend.id)}>
                            <div class="bg-stone-700 size-fit p-2 rounded-md">
                                {#if !friend.icon}
                                    <img class="block ml-4 lg:m-4 2xl:h-[6rem] 2xl:w-[6rem] xl:h-[5rem] xl:w-[5rem] h-[3rem] w-[3rem] border-solid rounded-md bg-amber-50" src={usericon} alt=""/>
                                {:else}
                                    <img class="block ml-4 lg:m-4 2xl:h-[6rem] 2xl:w-[6rem] xl:h-[5rem] xl:w-[5rem] h-[3rem] w-[3rem] border-solid rounded-md bg-amber-50" src={friend.icon} alt=""/>
                                {/if}
                                {#if friend.username.length+JSON.stringify(friend.id).length+1 < 10}
                                    <span class="ml-2 text-lg lg:pl-2 lg:ml-2 lg:mt-1 font-md lg:mt-5">{friend.username}#{friend.id}</span>
                                {:else}
                                    <span class="ml-2 text-lg lg:pl-2 lg:ml-2 lg:mt-1 font-md lg:mt-5">{friend.username.slice(0, 7)}...</span>
                                {/if}
                            </div>
                        </a>
                    {/each}
                </div>
            </div>

            <div class="mt-16 pb-8 w-full h-[20%] bg-[#292626FF] border-solid rounded-lg z-10 p-4">
                    <span class="text-white text-4xl font-bold p-4">Match History</span>
                    <span class="text-zinc-400 text-4xl font-bold">({data.matches})</span>
            </div>
        </div>
    </div>
{/if}