<script lang="typescript">
  import { onMount } from "svelte";
  import { setContext } from "svelte";
  import BigNumber from "bignumber.js";
  import { Context } from "./context";
  import { StepManager, Step, ApproveStep, SwapStep } from "./steps";
  import { web3 } from "./utils/web3";
  import { ERC20 } from "./utils/contracts";
  import { LGO_ADDRESS } from "./utils/constants";

  import type { ethers } from "ethers";

  let stepManager = new StepManager();
  let currentStepComponent: any;

  const web3Provider = web3();
  let context = new Context();
  let allowance: BigNumber = new BigNumber(0);

  setContext("context", context);

  const connect = () => {
    web3Provider.connect().then(onConnected);
  };

  const onConnected = async (ethersProvider: ethers.providers.Web3Provider) => {
    let accounts = await ethersProvider.listAccounts();
    context.account = accounts[0];
    context.lgo = new ERC20(
      ethersProvider.getSigner(context.account),
      LGO_ADDRESS,
      8
    );

    stepManager.addStep(new ApproveStep(context.lgo));
    stepManager.addStep(new SwapStep());

    stepManager.onStepChanged((step: Step) => {
      currentStepComponent = step.getComponent();
    });

    stepManager.init();

    allowance = await context.lgo.allowance(
      accounts[0],
      "0x0E801D84Fa97b50751Dbf25036d067dCf18858bF"
    );
  };
</script>

{#if $web3Provider.isConnected}
  <svelte:component this={currentStepComponent} />
{:else}
  <button class="p-1" on:click={connect}>Connect your wallet</button>
{/if}
