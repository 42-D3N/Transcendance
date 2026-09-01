<script lang="ts">
    import type { PageProps } from './$types';
    import { page } from '$app/state';
    import type { ActionData } from './$types';
    import arrow from '$lib/assets/side_arrow.svg';

	let { data, form }: PageProps = $props();
</script>

<div class="absolute inset-0 z-0 bg-[#333131FF]"></div>

<div class="mt-[10%] scale-95 lg:ml-[40%] lg:scale-150 lg:w-[20%] lg:h-[80%] md:w-[40%] md:ml-[30%] h-fit bg-[#292626FF] px-4 py-px rounded-xl z-10">
    <form method="POST" action="?/register">
        <p class="relative text-zinc-400 font-bold text-3xl z-10 m-2">Create an account</p>
        <label class="text-white">
            Username:<br>
            <input minlength="4" maxlength="128" name="username" type="username" value={form?.username} class="border border-solid border-zinc-400 bg-[#333131FF] focus:bg-black/20 max-w-full">
        </label><br>
        {#if form?.length_issue}<p class="error text-sm text-red-700 italic">Username must be between 4 - 128 caracters</p>{/if}
        {#if form?.username_exists}<p class="error text-sm text-red-700 italic">Username already used</p>{/if}
        <label class="text-white">
            Email:<br>
            <input name="email" value={form?.email} class="border border-solid border-zinc-400 bg-[#333131FF] focus:bg-black/20 max-w-full">
        </label><br>
        {#if form?.empty}<p class="error text-sm text-red-700 italic">The email field is required</p>{/if}
        {#if form?.wrong}<p class="error text-sm text-red-700 italic">Invalid Email!</p>{/if}
        {#if form?.email_exists}<p class="error text-sm text-red-700 italic">Email already used</p>{/if}
        <label class="text-white">
            Password:<br>
            <input minlength="12" maxlength="67" name="password" type="password" value={form?.password} class="border border-solid border-zinc-400 bg-[#333131FF] focus:bg-black/20 max-w-full">
        </label><br>
        {#if form?.skill_issue}<p class="error text-sm text-red-700 italic">Password must contain at least 12 caracters, a upper case and a lower case letter, a number and a special caracter</p>{/if}
        <a class="" href="./sign_in">
            <span class="lg:max-xl:hidden text-amber-600 overflow-hidden text-xl/tight text-ellipsis underline font-bold">Already registered?</span>
        </a>
        <div class="flex justify-end">
            <div class="bg-[#333131FF] hover:bg-black/20 border border-solid border-zinc-400 rounded-lg px-3 py-1 mt-4 mb-1 w-fit">
                <img class="inline w-4 h-6 -translate-y-1" src={arrow} alt="icon">
                <input type="submit" value="Create account">
            </div>
        </div>
    </form>
    <div class="flex bg-[#FFFFFF10] px-4 py-px border-[#7a5d26] border border-solid rounded-xl z-10 m-1 text-[#7a5d26]">
        <p class="p-1 justify-center text-center text-lg">Create an account isn't a permanent you'll always be able to delete it or to get back/update your informations on this plateform </p>
    </div>

</div>

