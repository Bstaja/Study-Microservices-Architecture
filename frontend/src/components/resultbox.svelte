<script>
  export let result = '';

  let parsed = null;
  $: parsed = parseResult(result);

  function parseResult(data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
</script>

{#if result}
  <div class="bg-white rounded-xl shadow-lg p-4 mt-4 animate-fade-in-slide-up delay-400 opacity-0 translate-y-4">
    <h2 class="text-lg font-semibold text-gray-800 mb-2">Result:</h2>

    {#if parsed}
      <table class="table-auto w-full text-left text-sm text-gray-700">
        <tbody>
          {#each Object.entries(parsed) as [key, value]}
            <tr class="border-t">
              <td class="py-2 font-medium text-gray-600 w-1/3">{key}</td>
              <td class="py-2 text-gray-900">{value}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <div class="text-gray-700 whitespace-pre-wrap">{@html result}</div>
    {/if}
  </div>
{/if}

<style>
  @keyframes fade-in-slide-up {
    from {
      opacity: 0;

    }
    to {
      opacity: 1;

    }
  }
  
  .animate-fade-in-slide-up {
    
    animation: fade-in-slide-up 0.4s ease-out forwards;
  }
  .delay-400 {
    animation-delay: 0.4s;
  }
</style>