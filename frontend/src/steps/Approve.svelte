<script lang="typescript">
  import { onMount, getContext } from "svelte";
  import BigNumber from "bignumber.js";
  import AutoNumeric from "autonumeric";
  import type { StepManager } from "../steps";

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
      .lgo!.approve(
        "0x0E801D84Fa97b50751Dbf25036d067dCf18858bF",
        stepManager.context!.lgoBalance!
      )
      .then((result) => {
        if (result) {
          stepManager.approving();
        } else {
          disableApprove = false;
        }
      })
      .catch((reason) => {
        disableApprove = false;
        console.warn(reason);
      });
  };
</script>

<p>
  Looks like you have <span class="formatted-number emphasis"
    >{stepManager.context.lgoBalance}</span
  >
  LGO. With this small tool, you will be able to swap them to VGX 2.0. Let's go!
</p>
<p>
  First, you need to allow this tool to transfer your LGOs from your wallet to
  the smart contract, which will perform the swap.
</p>
<button
  class="block w-full disabled:bg-purple-400"
  disabled={disableApprove}
  on:click={approve}>Approve</button
>
