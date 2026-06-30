<script lang="ts">
    import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

</script>

<div class="ml-42.5 px-4 py-px bg-1111111111">
    <form method="POST" action="?/login">
        <label>
            Username or Email
            <input name="username" type="username">
        </label>
        {#if form?.accNotFound}<p class="error">Account not found</p>{/if}
        {#if form?.emptyName}<p class="error">Usename or email cannot be empty</p>{/if}
        {#if form?.wrong}<p class="error">You must enter your email or username</p>{/if}
        <label>
            Password
            <input name="password" type="password">
        </label><br>
        {#if form?.emptyPass}<p class="error">Password cannot be empty</p>{/if}
        {#if form?.invalidPass}<p class="error">Incorrect password</p>{/if}
	    <input type="submit" value="Log in">
    </form>
</div>
