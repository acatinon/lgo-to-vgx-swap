<script lang="typescript">
  import { onMount, getContext } from "svelte";
  import BigNumber from "bignumber.js";
  import AutoNumeric from "autonumeric";
  import type { Context } from "../context";

  let context: Context = getContext("context");
  let approveInput: AutoNumeric;

  onMount(async () => {
    approveInput = new AutoNumeric("#approveAmount", 0, {
      decimalPlaces: 8,
      minimumValue: "0",
      maximumValue: context.lgoBalance!.toString(),
    });
  });

  const approve = () => {
    context.lgo!.approve(
      "0x0E801D84Fa97b50751Dbf25036d067dCf18858bF",
      new BigNumber(approveInput!.getNumericString()!)
    );
  };

  const setMax = () => {
    approveInput.set(context.lgoBalance!.toString());
  };
</script>

<p>{context.lgoBalance}</p>
<input id="approveAmount" type="text" />
<button on:click={setMax}>Max</button>
<button on:click={approve}>Approve</button>
