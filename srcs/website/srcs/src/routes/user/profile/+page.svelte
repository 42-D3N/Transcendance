<script lang="ts">
    import usericon from '$lib/assets/user/default.svg';
    import { redirect } from '@sveltejs/kit';

    let { data } = $props();

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

<div class="lg:scale-120 pb-8 z-1 lg:mt-[2%] lg:p-16 pl-6 pr-6 lg:ml-[25%] lg:w-[50%]">

    <div class="pb-8 w-full h-[80%] bg-[#292626FF] border-solid rounded-lg z-10">
        
        <div class="flex p-4">
            <img class="block lg:h-[12rem] lg:w-[12rem] h-[8rem] w-[8rem] border-solid rounded-md bg-amber-50" src={usericon} alt="icon"/>
            <div>
                <span class="block pl-6 font-black text-white text-4xl">{data.username}</span>

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

    <div class="mt-16 pb-8 w-full h-[80%] bg-[#292626FF] border-solid rounded-lg z-10 p-4">
            <span class="text-white text-4xl font-bold p-4">Match History</span>
            <span class="text-zinc-400 text-4xl font-bold">({data.matches})</span>
    </div>
</div>
