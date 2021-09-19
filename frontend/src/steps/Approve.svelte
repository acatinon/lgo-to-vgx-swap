<script lang="typescript">
  import { onMount, getContext } from "svelte";
  import AutoNumeric from "autonumeric";
  import type { StepManager } from "../steps";
  import { SWAP_CONTRACT } from "../utils/constants";

  let stepManager: StepManager = getContext("stepManager");
  let disableApprove = false;

  onMount(async () => {
    AutoNumeric.multiple(".formatted-number", null, {
      decimalPlaces: 8,
    });
  });

  const approve = async () => {
    disableApprove = true;
    stepManager.context
      .lgo!.approve(SWAP_CONTRACT, stepManager.context!.lgoBalance!)
      .then((result) => {
        if (result) {
          stepManager.transactionInitiated();
        } else {
          disableApprove = false;
        }
      })
      .catch((error) => {
        disableApprove = false;
        stepManager.showError(error);
      });
  };
</script>

<p>
  Looks like you have <span class="formatted-number emphasis">{stepManager.context.lgoBalance}</span>
  LGO. With this small tool, you will be able to swap them to VGX 2.0. Let's go!
</p>
<p>
  First, you need to allow this tool to transfer your LGOs from your wallet to the smart contract, which will perform
  the swap.
</p>
<button class="block w-full disabled:hidden" disabled={disableApprove} on:click={approve}> Approve</button>
{#if disableApprove}
  <div class="flex items-center justify-center bg-purple-400 text-center text-white px-4 py-2 font-bold rounded">
    <svg
      class="animate-spin mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    Please confirm the transaction on Metamask...
  </div>
{/if}
