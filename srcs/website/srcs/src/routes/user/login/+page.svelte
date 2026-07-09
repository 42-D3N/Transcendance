<script lang="ts">
    import type { PageProps } from './$types';
    import arrow from '$lib/assets/side_arrow.svg';

	let { data, form }: PageProps = $props();

</script>

<div class="absolute size-full z-0 bg-linear-to-b from-olive-500 to-80% to-white md:items-center"></div>
<div class="bg-zinc-100 px-4 py-px border-zinc-400 border border-solid rounded-xl z-10">
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
            <span class="lg:max-xl:hidden text-amber-600 overflow-hidden text-2xl/tight text-ellipsis underline font-bold">Sign in!</span>
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