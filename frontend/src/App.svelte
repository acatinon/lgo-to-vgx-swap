<script lang="typescript">
  import { setContext } from "svelte";
  import { StepManager } from "./steps";
  import { web3 } from "./utils/web3";

  import type { ethers } from "ethers";

  let stepManager = new StepManager();
  let currentStepComponent: any;
  let errorCode: number;
  let errorMessage: string;

  const web3Provider = web3();

  setContext("stepManager", stepManager);

  stepManager.onStepChanged((component: any) => {
    currentStepComponent = component;
  });

  stepManager.onError((code: number, message: string) => {
    errorCode = code;
    errorMessage = message;
  });

  const connect = () => {
    web3Provider.connect().then(onConnected);
  };

  const onConnected = async (ethersProvider: ethers.providers.Web3Provider) => {
    await stepManager.init(ethersProvider);
  };
</script>

<div class="text-3xl">
  {#if errorCode}
    <div class="flex items-center flex-col">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-32 p-4 text-red-500"
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
      <p>An error occured while processing the transaction!</p>
      <p class="text-lg text-gray-400">{errorMessage} (code: {errorCode})</p>
    </div>
  {:else if $web3Provider.isConnected}
    <svelte:component this={currentStepComponent} />
  {:else}
    <button class="m-auto block" on:click={connect}>Connect your wallet</button>
  {/if}
</div>
