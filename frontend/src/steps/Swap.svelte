<script lang="typescript">
  import { onMount, getContext } from "svelte";
  import AutoNumeric from "autonumeric";
  import type { StepManager } from "../steps";

  let stepManager: StepManager = getContext("stepManager");
  let disableSwap = false;

  onMount(async () => {
    AutoNumeric.multiple(".formatted-number", null, {
      decimalPlaces: 8,
    });
  });

  const swap = async () => {
    disableSwap = true;
    stepManager.context
      .swap!.swap(stepManager.context!.allowance!, stepManager.context!.lgo!)
      .then((result) => {
        if (result) {
          stepManager.transactionInitiated();
        } else {
          disableSwap = false;
        }
      })
      .catch((error) => {
        disableSwap = false;
        stepManager.showError(error);
      });
  };
</script>

<p>
  Ok, you have allowed the smart contract to swap <span class="formatted-number emphasis"
    >{stepManager.context.allowance}</span
  > LGO to VGX 2.0. Congrats, you are almost done! You just need to click on the button bellow and confim the transaction
  on Metamask.
</p>
<button class="block w-full disabled:hidden" disabled={disableSwap} on:click={swap}> Swap LGO to VGX 2.0</button>
