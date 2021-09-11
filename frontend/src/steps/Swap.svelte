<script lang="typescript">
  import { onMount, getContext } from "svelte";
  import type { StepManager } from "../steps";

  let stepManager: StepManager = getContext("stepManager");
  let disableSwap = false;

  const swap = async () => {
    disableSwap = true;
    stepManager.context
      .lgo!.approve(
        "0x0E801D84Fa97b50751Dbf25036d067dCf18858bF",
        stepManager.context!.allowance!
      )
      .then((result) => {
        if (result) {
          stepManager.approving();
        } else {
          disableSwap = false;
        }
      })
      .catch((reason) => {
        disableSwap = false;
        console.warn(reason);
      });
  };
</script>

<p>
  Ok, you have allowed the smart contract to swap <span
    class="formatted-number emphasis">{stepManager.context.allowance}</span
  > LGO to VGX 2.0. Congrats, you are almost done! You just need to click on the
  button bellow and confim the transaction on Metamask.
</p>
<button
  class="block w-full disabled:hidden"
  disabled={disableSwap}
  on:click={swap}
>
  Swap LGO to VGX 2.0</button
>
