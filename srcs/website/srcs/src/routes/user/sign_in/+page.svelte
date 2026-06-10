<script lang="ts">
    import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

    let email = $state('');
    let username = $state('');
    let password = $state('');

    function checkEmail()
    {
        let splittedEmail = email.split('@');

        document.getElementById('emailValidity').classList.remove("hidden");
        document.getElementById('emailValidity').classList.add("flex");
        console.log(splittedEmail.length);
        if (splittedEmail.length === 1 || !find(splittedEmail, '.'))
            return ;

        document.getElementById('emailValidity').classList.add("hidden");
        document.getElementById('emailValidity').classList.remove("flex");
        console.log("isoke");
    }

    function checkUsername()
    {

        console.log("isoke");
    }

    function checkPassword()
    {
        console.log("isoke");
    }

</script>

<div class="ml-42.5 px-4 py-px">
    <h1>Database in progress</h1>
    <p>Visit <a href="https://youtu.be/dQw4w9WgXcQ">database.progressStatus.fr</a> to see the database creation advancement</p>
    <form method="post" action="?/register">
        
        <label>
            Email
            <input name="email" type="email" class="bg-white focus:bg-black/20" bind:value={email} onchange={checkEmail}>
            <div id="emailValidity" class="hidden" >please enter a valid email adress</div>
        </label><br>
        <label>
            Username
            <input minlength="4" maxlength="128" name="username" type="username" value={username} onchange={checkUsername}>
        </label><br>
        <label>
            Password
            <input minlength="8" name="password" type="password" bind:value={password} onchange={checkPassword}>
        </label><br>
	    <input type="submit" value="Create account">
    </form>
</div>
