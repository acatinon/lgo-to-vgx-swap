<script lang="typescript">
  import { setContext } from "svelte";
  import BigNumber from "bignumber.js";
  import { StepManager } from "./steps";
  import { web3 } from "./utils/web3";

  import type { ethers } from "ethers";

  let stepManager = new StepManager();
  let currentStepComponent: any;

  const web3Provider = web3();

  setContext("stepManager", stepManager);

  const connect = () => {
    web3Provider.connect().then(onConnected);
  };

  const onConnected = async (ethersProvider: ethers.providers.Web3Provider) => {
    stepManager.onStepChanged((component: any) => {
      currentStepComponent = component;
    });

    await stepManager.init(ethersProvider);
  };
</script>

<div class="text-3xl">
  {#if $web3Provider.isConnected}
    <svelte:component this={currentStepComponent} />
  {:else}
    <button class="m-auto block" on:click={connect}>Connect your wallet</button>
  {/if}
</div>
