<script lang="typescript">
  import { afterUpdate, setContext } from "svelte";
  import AutoNumeric from "autonumeric";
  import type { Error } from "./steps";
  import { StepManager, State } from "./steps";
  import { web3 } from "./utils/web3";
  import { SWAP_CONTRACT } from "./utils/constants";

  import type { ethers } from "ethers";

  import Step from "./shared/Step.svelte";
  import WaitingSteps from "./shared/WaitingSteps.svelte";

  let stepManager = new StepManager();
  let error: Error;

  const web3Provider = web3();
  let isConnected = false;
  let currentState = State.Approving;

  setContext("stepManager", stepManager);

  afterUpdate(() => {
    AutoNumeric.multiple(".formatted-number", null, {
      decimalPlaces: 8,
    });
  });

  const connect = () => {
    web3Provider.connect().then(onConnected);
  };

  const onConnected = async (ethersProvider: ethers.providers.Web3Provider) => {
    await stepManager.init(ethersProvider);

    stepManager.onApprove((owner: string, spender: string, amount: ethers.BigNumber) => {
      currentState = State.Swapping;
    });

    isConnected = $web3Provider.isConnected;
  };

  const approve = async () => {
    currentState = State.WaitingApproveConfirmation;
    stepManager.context
      .lgo!.approve(SWAP_CONTRACT, stepManager.context!.lgoBalance!)
      .then((result) => {
        if (result) {
          currentState = State.WaitingApproveExecution;
        } else {
        }
      })
      .catch((e: Error) => {
        error = e;
      });
  };
</script>

<div class="text-xl">
  <div>
    <p>
      As you may know, Since LGO was acquired by Voyager, you had to swap your LGO tokens into VGX 2.0. Unfortunately,
      after the September 20 deadline, the official swap portal is closed. But the swap is still possible by interacting
      directly with the blockchain. This small tool is designed to help you in the process to get your VGX 2.0.
    </p>
    {#if isConnected}
      <p>
        Looks like you have <span class="formatted-number emphasis">{stepManager.context.lgoBalance}</span>
        LGO tokens. Please follow the steps below to swap them into VGX 2.0.
      </p>
      <Step title="Give permission to swap LGO tokens" refState={State.Approving} {currentState} {error}>
        <svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
        <p slot="content">
          <button class="block" on:click={approve}>Approve</button>
        </p>
      </Step>

      <WaitingSteps
        refConfirmationState={State.WaitingApproveConfirmation}
        refExecutionState={State.WaitingApproveExecution}
        {currentState}
        {error}
      />

      <Step title="Swap" refState={State.Swapping} {currentState} {error}>
        <svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
        <p slot="content">
          The second step is the swap itself. Each step is a transaction on the Ethereum blockchain and thus cost fees.
        </p>
      </Step>

      <WaitingSteps
        refConfirmationState={State.WaitingSwapExecution}
        refExecutionState={State.WaitingSwapExecution}
        {currentState}
        {error}
      />
    {:else}
      <button class="m-auto block" on:click={connect}>Connect your wallet</button>
    {/if}
  </div>
</div>
