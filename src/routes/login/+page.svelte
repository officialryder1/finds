<!-- src/routes/login/+page.svelte -->
<script lang="ts">
  import { supabase } from '$lib/supabaseClient'
  import { page } from '$app/stores'
  

  let email = ''
  let password = ''
  let loading = false
  let error = null
  
  async function handleLogin() {
    loading = true
    error = null
    
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (signInError) {
      error = signInError.message
    }
    
    loading = false
  }
  
  async function handleSignUp() {
    loading = true
    error = null
    
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    })
    
    if (signUpError) {
      error = signUpError.message
    } else {
      error = 'Check your email for confirmation link!'
    }
    
    loading = false
  }
  
  async function handleSignOut() {
    await supabase.auth.signOut()
  }
</script>

{#if $page.data.session}
  <div>
    <p>Welcome, {$page.data.session.user.email}!</p>
    <button on:click={handleSignOut}>Sign Out</button>
  </div>
{:else}
  <form on:submit|preventDefault>
    <input 
      type="email" 
      bind:value={email} 
      placeholder="Email" 
      required
    />
    <input 
      type="password" 
      bind:value={password} 
      placeholder="Password" 
      required
    />
    
    {#if error}
      <p style="color: red;">{error}</p>
    {/if}
    
    <button on:click={handleLogin} disabled={loading}>
      {loading ? 'Loading...' : 'Sign In'}
    </button>
    <button on:click={handleSignUp} disabled={loading}>
      Sign Up
    </button>
  </form>
{/if}