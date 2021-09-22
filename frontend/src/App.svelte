<script lang="typescript">
  import { afterUpdate, setContext } from "svelte";
  import BigNumber from "bignumber.js";
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

    stepManager.onSwap((sender: string, sentAmount: ethers.BigNumber, receivedAmount: ethers.BigNumber) => {
      currentState = State.Success;
      stepManager.context.receivedVgxlalance = new BigNumber(receivedAmount.toString()).dividedBy(Math.pow(10, 8));
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

  const swap = async () => {
    currentState = State.WaitingSwapConfirmation;
    stepManager.context
      .swap!.swap(stepManager.context!.lgoBalance!, stepManager.context.lgo!)
      .then((result) => {
        if (result) {
          currentState = State.WaitingSwapExecution;
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
      <Step title="Give permission to swap LGO tokens" refState={State.Approving} {currentState} {error}>
        <svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
        <div slot="content">
          <p>
            Looks like you have <span class="formatted-number emphasis">{stepManager.context.lgoBalance}</span>
            LGO tokens. Please click on the button below to allow this tool to swap them into VGX 2.0.
          </p>
          <button class="block" on:click={approve}>Approve</button>
        </div>
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
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <div slot="content">
          <p>Please click on the button below to initiate the swap transaction.</p>
          <button class="block" on:click={swap}>Swap</button>
        </div>
      </Step>

      <WaitingSteps
        refConfirmationState={State.WaitingSwapConfirmation}
        refExecutionState={State.WaitingSwapExecution}
        {currentState}
        {error}
      />

      <Step title="Success" refState={State.Success} {currentState} {error}>
        <svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
        </svg>
        <div slot="content">
          <p>
            Congratulations! You received <span class="formatted-number emphasis"
              >{stepManager.context.receivedVgxlalance}</span
            > VGX 2.0.
          </p>
        </div>
      </Step>
    {:else}
      <button class="m-auto block" on:click={connect}>Connect your wallet</button>
    {/if}
  </div>
</div>
