<script lang="typescript">
  import { afterUpdate, setContext } from "svelte";
  import AutoNumeric from "autonumeric";
  import type { Error } from "./steps";
  import { StepManager, State } from "./steps";
  import { web3 } from "./utils/web3";
  import { SWAP_CONTRACT } from "./utils/constants";

  import type { ethers } from "ethers";

  import Step from "./shared/Step.svelte";

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
      <Step
        title="Confirm the transaction on Metamask"
        refState={State.WaitingApproveConfirmation}
        {currentState}
        {error}
      >
        <svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
          />
        </svg>
      </Step>
      <Step
        title="Wait for the transaction execution on the Ethereum blockchain"
        refState={State.WaitingApproveExecution}
        {currentState}
        {error}
      >
        <svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </Step>
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
    {:else}
      <button class="m-auto block" on:click={connect}>Connect your wallet</button>
    {/if}
  </div>
</div>
