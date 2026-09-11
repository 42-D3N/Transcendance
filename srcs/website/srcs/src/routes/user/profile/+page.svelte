<script lang="ts">
    import usericon from '$lib/assets/user/default.svg';
    import { redirect } from '@sveltejs/kit';
    import { enhance } from '$app/forms';
    import profileicon from '$lib/assets/profile_icon.svg';
    import { afterNavigate } from '$app/navigation'
    import { chatClient } from '$lib/chat-client.svelte.ts';

    import type { PageProps } from './$types';
    let { data, form }: PageProps = $props();

    afterNavigate ((navigation:any) => {
        console.log(navigation);
        if (navigation.type === "goto" && navigation.from.route.id === "/user/profile/edit")
            chatClient.execProfileChange(data.username, data.icon);
    });

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
    console.log(data.friendRequests);
</script>

<div class="fixed inset-0 z-0 bg-[#333131FF] size-full"></div>

<div class="flex ml-[10%]">
    <div class="pb-8 z-1 lg:mt-[2%] lg:p-16 pl-6 pr-6 w-[90%] ">
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
            <span class="pl-12 text-white text-lg lg:text-3xl lg:font-light">Friends: {0} | don't forget you can chat with your friends!</span>
            <a class="block ml-4 mt-4 w-fit p-2 bg-[#333131FF] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md" href="./profile/edit">
                <span class="text-white font-bold lg:text-3xl p-4">Edit Profile</span>
            </a>
        </div>

        <div class="block mt-[5.5%] pb-8 bg-[#292626FF] border-solid rounded-lg z-10 pt-4">
            <div class="flex">
                <span class="text-white text-xl font-bold p-4 pt-1">Friends</span>
                <div>
                    <form method="POST" enctype="multipart/form-data" class="flex size-fit" action="?/sendRequest">
                    <input name="username" type="username" class="inline font-normal size-fit bg-[#333131FF] text-white text-2xl w-[80%]" placeholder="<username>#<tag>">
                    <button class="mr-2 size-fit p-2 bg-green-600 hover:bg-green-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md" type="submit">
                        <img class="size-4" src={profileicon} alt="icon"/>
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
                            <img class="upload block m-2 lg:h-[4rem] lg:w-[4rem] h-[2rem] w-[2rem] border-solid rounded-md bg-amber-50" src={data.icon} alt=""/>
                        {/if}
                        <span class="pl-2 mt-1 font-md lg:mt-5">{frRequests.username}#{frRequests.id}</span>

                        <div class="flex ml-auto gap-2">
                            <button class="mt-2 h-[2rem] w-[2rem] lg:h-[4rem] lg:w-[4rem] bg-green-600 hover:bg-green-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md" type="submit" title="accept" formaction="?/acceptRequest"></button>
                            <button class="mt-2 mr-2 h-[2rem] w-[2rem] lg:h-[4rem] lg:w-[4rem] bg-red-600 hover:bg-red-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md" type="submit" title="refuse" formaction="?/refuseRequest"></button>
                        </div>
                    </form>
                {/each}
            </div>
        </div> 

        <div class="mt-16 pb-8 w-full h-[20%] bg-[#292626FF] border-solid rounded-lg z-10 p-4">
                <span class="text-white text-4xl font-bold p-4">Match History</span>
                <span class="text-zinc-400 text-4xl font-bold">({data.matches})</span>
        </div>
    </div>
</div>
