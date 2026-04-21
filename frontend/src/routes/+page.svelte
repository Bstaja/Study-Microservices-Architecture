<script>
  import { slide } from 'svelte/transition';
  import { onMount } from 'svelte';
  import ResultBox from '../components/resultbox.svelte';
  import { goto } from '$app/navigation';

  let name = '';
  let type = 'client';
  let result = '';
  let token = '';
  let loading = false;

  function authenticate() {
    const local_tk = localStorage.getItem('token');
    if (local_tk)
    {
      token = local_tk;
    }
    else
    {
      goto('/login');
    }
    console.log(`Token: ${token}`);
  }

  async function fetchInfo() {
    if (!name || !type) return;
    loading = true;
    result = '';

    await new Promise(resolve =>
    {
      setTimeout(() => {resolve('')}, 400);
    });

    try
    {
    const res = await fetch('http://localhost:3000/search', {
      method: 'POST',
      headers:
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer: ${token}`
      },
      body: JSON.stringify({ name, type })
    });

    const data = await res.json();
    result = data.message || JSON.stringify(data, null, 2);

    if (result.startsWith('Invalid'))
    {
      result += ', try to log in again <strong><u><a href = "/login">here</a></u></strong>.'
    }
    } catch (err)
    {
      result = 'Error while fetching data.';
    }
    finally
    {
      loading = false;
    }
  }

  onMount(() => {
    authenticate();
  });
</script>

<main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-green-600">

<div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg opacity-0 scale-95 animate-zoom-in">
  <h1 class="text-2xl font-bold mb-4 text-center opacity-0 translate-y-4 animate-fade-in-slide-up">
  Search for  a Client or a Company
  </h1>

  <div class="space-y-3 mb-4 opacity-0 translate-y-4 animate-fade-in-slide-up delay-100">
    <input
    class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 focus:scale-105"
    bind:value={name}
    placeholder="Enter client or company name"
    />

    <select
    class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
    bind:value={type}
    >
    <option value="client">Client</option>
    <option value="company">Company</option>
    </select>

    {#if loading}
    <button
    class="w-full bg-blue-800 text-white py-2 rounded-md">Loading...</button>
    {:else}
    <button
    class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-300 transform hover:scale-105 active:scale-95"
    on:click={fetchInfo}>
    Fetch Information
    </button>
    {/if}
  </div>

  {#if result}
  <div transition:slide>
  <ResultBox {result} />
  </div>
  {/if}
</div>

</main>

<style>

@keyframes fade-in-slide-up {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to
  {
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

.animate-fade-in-slide-up {
  animation: fade-in-slide-up 0.6s ease-out forwards;
}
.animate-zoom-in {
  animation: zoom-in 0.6s ease-out forwards;
}
.delay-100 {
  animation-delay: 0.1s;
}

</style>
