<script lang="typescript">
  import { onMount, getContext } from "svelte";
  import AutoNumeric from "autonumeric";
  import type { StepManager } from "../steps";
  import { SWAP_CONTRACT } from "../utils/constants";

  import DisabledButton from "../shared/DisabledButton.svelte";

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
  <DisabledButton />
{/if}
