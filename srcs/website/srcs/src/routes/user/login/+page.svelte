<script lang="ts">
    import type { PageProps } from './$types';
    import arrow from '$lib/assets/side_arrow.svg';

	let { data, form }: PageProps = $props();

</script>

<div class="absolute size-full z-0 bg-linear-to-b from-olive-500 to-80% to-white md:items-center"></div>

<div class="scale-120 pb-8 mt-[5%] ml-[15%] p-16 w-[70%] h-[80%] bg-gray-200 px-4 py-px border-zinc-400 border border-solid rounded-xl z-10 mt-2">
    
    <p class="text-3xl ml-24 m-4">Log in</p>

    <div class="flex content-center space-x-4">

        <div class="hidden lg:block ml-2 mt-2 relative w-lg h-160 rounded-xl overflow-hidden bg-linear-to-b from-sky-200 via-sky-400 to-blue-500 p-6 pt-8 text-center">
            <button class="bg-green-500 hover:bg-green-600 text-white font-bold mt-4 px-16 py-4 rounded-md shadow-lg">
                Sign up!
            </button>
            <h2 class="text-white font-extrabold text-5xl mt-8">Blog, Profile, Chat ...</h2>
            <p class="text-white text-2xl mt-1">Make tons of friends!</p>
            <div class="absolute bottom-0 left-0 w-full flex justify-center items-end pointer-events-none">
                <svg width="360" height="280" viewBox="0 0 360 280" class="opacity-90">

                    <circle cx="95" cy="84" r="36" fill="white" fill-opacity="0.85"/>
                    <rect x="45" y="120" width="100" height="180" rx="20" fill="white" fill-opacity="0.85"/>

                    <circle cx="260" cy="84" r="36" fill="white" fill-opacity="0.6"/>
                    <rect x="210" y="120" width="100" height="180" rx="20" fill="white" fill-opacity="0.6"/>
                </svg>
            </div>
        </div>

        <!---->
        
        <div class="h-fit bg-zinc-100 px-4 py-px border-zinc-400 border border-solid rounded-xl z-10 mt-2">
            <form method="POST" action="?/login">
                <p class="relative text-blue-600 font-bold z-10">Already registered?</p>
                <div class="relative bg-blue-200 min-height-1/50 min-lenght-10 h-4 bottom-4"></div>
                <label>
                    Username or Email:
                    <br><input name="username" type="username" class="border border-solid border-zinc-400 bg-white focus:bg-black/20 max-w-1/1">
                </label><br>
                {#if form?.accNotFound}<p class="error">Account not found</p>{/if}
                {#if form?.emptyName}<p class="error">Usename or email cannot be empty</p>{/if}
                {#if form?.wrong}<p class="error">You must enter your email or username</p>{/if}
                <label>
                    Password:
                    <br><input name="password" type="password" class="border border-solid border-zinc-400 bg-white focus:bg-black/20 max-w-1/1">
                </label><br>
                {#if form?.emptyPass}<p class="error">Password cannot be empty</p>{/if}
                {#if form?.invalidPass}<p class="error">Incorrect password</p>{/if}
                <a class="" href="./sign_in">
                    <span class="lg:max-xl:hidden text-amber-600 overflow-hidden text-xl/tight text-ellipsis underline font-bold">Sign up!</span>
                </a>
                <div class="flex justify-end">
                    <div class="bg-gray-200 border border-solid border-zinc-400 rounded-lg px-3 py-1 mt-4 mb-1 w-fit">
                        <img class="inline w-4 h-6 -translate-y-1" src={arrow} alt="icon">
                        <input type="submit" value="Log in!">
                    </div>
                </div>
            </form>
            <div class="flex bg-yellow-100 px-4 py-px border-[#7a5d26] border border-solid rounded-xl z-10 m-1 text-[#7a5d26]">
                <p class="p-1 justify-center text-center text-lg">Any login is a permanent login unless a logout button is clicked (available on the nav bar, options, ...)</p>
            </div>
        </div>

        <!---->

        <div class="h-fit bg-zinc-100 px-4 py-px border-zinc-400 border border-solid rounded-xl z-10 mt-2">
            <div class="flex">
                <svg class="mt-1 mr-1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="17" height="17" viewBox="0 0 48 48">
                    <path fill="#2196f3" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M22 22h4v11h-4V22zM26.5 16.5c0 1.379-1.121 2.5-2.5 2.5s-2.5-1.121-2.5-2.5S22.621 14 24 14 26.5 15.121 26.5 16.5z"></path>
                </svg>
                <span class="text-blue-600 overflow-hidden text-xl2 font-bold">Sign up in 2 minutes and:</span>
            </div>
            <ul class="w-fit ml-10 list-disc">
                <li>Edit your profile and make some friends</li>
                <li>Play a magnificent pong game</li>
                <li>Chat with your firends</li>
                <li>
                    <a class="" href="./sign_in">
                        <span class="lg:max-xl:hidden text-blue-600 overflow-hidden text-xl/tight text-ellipsis underline font-bold">Sign up!</span>
                    </a>
                </li>
            </ul>
        </div>

    </div>

</div>