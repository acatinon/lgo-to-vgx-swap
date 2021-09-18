<script lang="typescript">
  import type { State, Error } from "../steps";

  export let title: string;
  export let refState: State;
  export let currentState: State;
  export let error: Error;

  $: isActive = currentState == refState;
  $: isDone = currentState > refState;
  $: isVisible = currentState >= refState;
  $: hasFailed = !!error;
  let errorCode: number;
  let errorMessage: string;

  $: if (error) {
    if (error.data) {
      errorCode = error.data.code;
      errorMessage = error.data.message;
    } else {
      errorCode = error.code;
      errorMessage = error.message;
    }
  }
</script>

{#if isVisible}
  <div class="step" class:isActive class:isDone>
    {#if isActive && hasFailed}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="flex-shrink-0 h-8 w-8 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    {:else if isDone}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
    {:else}
      <div class="icon">
        <slot name="icon" />
      </div>
    {/if}
    <div class="mx-2">
      <h3>{title}</h3>
      {#if isActive}
        <div class="content">
          <slot name="content" />
        </div>
      {/if}
      {#if isActive && errorMessage}
        <div>
          <h4>An error occured while processing the transaction!</h4>
          <p class="text-lg text-gray-400">{errorMessage} (code: {errorCode})</p>
        </div>
      {/if}
    </div>
  </div>
{/if}
