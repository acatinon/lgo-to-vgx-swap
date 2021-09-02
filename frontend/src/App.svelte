<script lang="typescript">
  import { setContext } from "svelte";
  import BigNumber from "bignumber.js";
  import { Context } from "./context";
  import { StepManager, Step, ApproveStep, SwapStep } from "./steps";
  import { web3 } from "./utils/web3";

  import type { ethers } from "ethers";

  let stepManager = new StepManager();
  let currentStepComponent: any;

  const web3Provider = web3();
  let context = new Context();

  setContext("context", context);

  const connect = () => {
    web3Provider.connect().then(onConnected);
  };

  const onConnected = async (ethersProvider: ethers.providers.Web3Provider) => {
    await context.init(ethersProvider);

    stepManager.addStep(new ApproveStep());
    stepManager.addStep(new SwapStep());

    stepManager.onStepChanged((step: Step) => {
      currentStepComponent = step.getComponent();
    });

    stepManager.init(context);
  };
</script>

<div class="m-auto">
  {#if $web3Provider.isConnected}
    <svelte:component this={currentStepComponent} />
  {:else}
    <button class="p-1" on:click={connect}>Connect your wallet</button>
  {/if}
</div>
