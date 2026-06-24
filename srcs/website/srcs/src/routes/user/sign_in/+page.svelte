<script lang="ts">
    import type { PageProps } from './$types';
    import { page } from '$app/state';
    import type { ActionData } from './$types';

	let { data, form }: PageProps = $props();

</script>

<div class="ml-42.5 px-4 py-px">
    <form method="POST" action="?/register">
        <label>
            Username
            <input minlength="4" maxlength="128" name="username" type="username" value={form?.username}>
        </label><br>
        {#if form?.length_issue}<p class="error">Username must be between 4 - 128 caracters</p>{/if}
        {#if form?.username_exists}<p class="error">Username already used</p>{/if}
        <label>
            Email
            <input name="email" class="bg-white focus:bg-black/20" value={form?.email}>
        </label><br>
        {#if form?.empty}<p class="error">The email field is required</p>{/if}
        {#if form?.wrong}<p class="error">Invalid Email!</p>{/if}
        {#if form?.email_exists}<p class="error">Email already used</p>{/if}
        <label>
            Password
            <input minlength="8" name="password" type="password" value={form?.password}>
        </label><br>
        {#if form?.skill_issue}<p class="error">Password must contain at least 12 caracters, a upper case and a lower case letter, a number and a special caracter</p>{/if}
	    <input type="submit" value="Create account">
    </form>
</div>


