<script lang="ts">
    import usericon from '$lib/assets/user/default.svg';
    import { redirect } from '@sveltejs/kit';
    import { enhance } from '$app/forms';
    import profileicon from '$lib/assets/profile_icon.svg';

    import type { PageProps } from './$types';
    let { data, form }: PageProps = $props();

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

<div class="absolute inset-0 z-0 bg-[#333131FF]"></div>

<div class="flex lg:scale-120 lg:ml-[25%]">
    <div class="pb-8 z-1 lg:mt-[2%] lg:p-16 pl-6 pr-6 lg:w-[70%]">
        <div class="pb-8 w-full h-[80%] bg-[#292626FF] border-solid rounded-lg z-10">
            
            <div class="flex p-4">
                {#if !data.icon}
                    <img class="upload block lg:h-[12rem] lg:w-[12rem] h-[8rem] w-[8rem] border-solid rounded-md bg-amber-50" src={usericon} alt=""/>
                {:else}
                    <img class="upload block lg:h-[12rem] lg:w-[12rem] h-[8rem] w-[8rem] border-solid rounded-md bg-amber-50" src={data.icon} alt=""/>
                {/if}
                <div>
                    <span class="block pl-6 font-black text-white text-4xl">{data.username}#{data.id}</span>

                    <span class="pl-12 pt-6 font-semibold text-zinc-400 text-xl">Wallets:</span>
                    <span class="pt-6 font-semibold text-white text-xl">{data.wallet}</span>
                    <span class="block"></span>
                    <span class="pl-12 text-zinc-400 text-lg">Winrate:</span>
                    <span class="text-white text-lg">{Winrate()}</span>
                </div>
            </div>
            <span class="pl-12 text-white text-lg lg:text-xl">Friends: {0} | don't forget you can chat with your friends!</span>
            <a class="block ml-4 mt-4 w-fit p-2 bg-[#333131FF] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md" href="./profile/edit">
                <span class="text-white font-bold p-4">Edit Profile</span>
            </a>
        
        </div>

        <div class="mt-16 pb-8 w-full h-[20%] bg-[#292626FF] border-solid rounded-lg z-10 p-4">
                <span class="text-white text-4xl font-bold p-4">Match History</span>
                <span class="text-zinc-400 text-4xl font-bold">({data.matches})</span>
        </div>
    </div>
    <div class="block lg:mt-[5.5%] pb-8 w-[20%] bg-[#292626FF] border-solid rounded-lg z-10 pt-4">
        <div class="flex">
            <span class="text-white text-xl font-bold p-4 pt-1">Friends</span>
            <div>
                <form method="POST" enctype="multipart/form-data" class="flex size-fit" action="?/sendRequest">
                <input name="username" type="username" class="inline font-normal size-fit bg-[#333131FF] text-white text-2xl w-[14ch]" placeholder="<username>#<tag>eule">
                <button class="ml-1 mr-2 size-fit p-2 bg-green-600 hover:bg-green-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md" type="submit">
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
                <form method="POST" enctype="multipart/form-data" class="bg-stone-700 rounded-md mb-2" use:enhance={({ formData }) => {
                    formData.append('user1', JSON.stringify(frRequests.user1));
                    formData.append('user2', JSON.stringify(frRequests.user2));
                }}
                >
                    <span class="pl-2">{frRequests.user1} </span>
                    <span> ---> </span>
                    <span>{frRequests.user2}</span>
                    <button class="ml-1 mr-2 h-[16%] w-[8%] p-2 bg-green-600 hover:bg-green-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md" type="submit" title="accept" formaction="?/acceptRequest"></button>
                    <button class="ml-1 mr-2 h-[16%] w-[8%] p-2 bg-red-600 hover:bg-red-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)] rounded-md" type="submit" title="refuse" formaction="?/refuseRequest"></button>
                </form>
            {/each}
        </div>
    </div>
</div>
