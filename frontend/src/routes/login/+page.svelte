<script>
    import { goto } from '$app/navigation';
    import { slide } from 'svelte/transition';

    let username = '';
    let password = '';
    let error = '';
    let loading = false;

    async function login() {
        error = '';
        loading = true;
        await new Promise(resolve =>
        {
            setTimeout(() => {resolve('')}, 200);
        });
        try {
            const res = await fetch('http://localhost:4000/oauth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok && data.access_token) {
                localStorage.setItem('token', data.access_token);
                goto('/');
            } 
            else 
            {
                error = data.message || 'Login failed';
            }
        }
        catch (err)
        {
            error = 'Network error';
            console.log(err);
        }
        finally
        {
            loading = false;
        }
        
    }
</script>

<main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-green-600 animate-background">
  <div
    class="bg-white rounded-xl shadow-2xl p-10 w-full max-w-md transform transition-all duration-500 ease-out opacity-0 scale-95 animate-zoom-in"
  >
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-2 opacity-0 translate-y-4 animate-fade-in-slide-up">
      Welcome
    </h1>
    <p class="text-center text-sm text-gray-500 mb-6 opacity-0 translate-y-4 animate-fade-in-slide-up delay-100">
      Login to access the main webpage
    </p>

    <div class="space-y-4 opacity-0 translate-y-4 animate-fade-in-slide-up delay-200">
      <input
        type="text"
        bind:value={username}
        placeholder="Username"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 focus:scale-105"
      />

      <input
        type="password"
        bind:value={password}
        placeholder="Password"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 focus:scale-105"
      />

      {#if error != ''}
        <p transition:slide class="text-red-600 text-sm animate-shake delay-200">{error}</p>
      {/if}

      {#if loading}
      <button
        class="w-full bg-blue-800 text-white py-2 rounded-md"
      >
        Please wait...
      </button>
      {:else}
      
      <button
        on:click={login}
        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-300 transform hover:scale-105 active:scale-95 animate-pulse-on-hover"
      >
        Login
      </button>
      {/if}
    </div>

    <p class="text-xs text-center text-gray-400 mt-6 opacity-0 translate-y-4 animate-fade-in-slide-up delay-300">
      Username: user | Password: user123
    </p>
  </div>
</main>

<style>
  main {
    font-family: 'Inter', sans-serif;
  }

  @keyframes fade-in-slide-up {
    from {
      opacity: 0;
      transform: translateY(1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes zoom-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes background-fade {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }

  @keyframes pulse-on-hover {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.03);
    }
  }

  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    50% { transform: translateX(4px); }
    75% { transform: translateX(-4px); }
    100% { transform: translateX(0); }
  }

  .animate-fade-in-slide-up {
    animation: fade-in-slide-up 0.6s ease-out forwards;
  }
  .animate-zoom-in {
    animation: zoom-in 0.6s ease-out forwards;
  }
  .animate-background {
    background-size: 200% 200%;
    animation: background-fade 8s ease-in-out infinite alternate;
  }
  .animate-pulse-on-hover:hover {
    animation: pulse-on-hover 0.6s ease-in-out;
  }
  .animate-shake {
    animation: shake 0.2s ease-in-out;
  }
  .delay-100 {
    animation-delay: 0.1s;
  }
  .delay-200 {
    animation-delay: 0.2s;
  }
  .delay-300 {
    animation-delay: 0.3s;
  }
</style>