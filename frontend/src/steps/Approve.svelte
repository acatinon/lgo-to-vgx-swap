<script lang="typescript">
  import { onMount, getContext } from "svelte";
  import BigNumber from "bignumber.js";
  import AutoNumeric from "autonumeric";
  import type { Context } from "../context";

  let context: Context = getContext("context");
  let approveInput: AutoNumeric;

  onMount(async () => {
    AutoNumeric.multiple(".formatted-number", null, {
      decimalPlaces: 8,
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

<p>
  Looks like you have <span class="formatted-number">{context.lgoBalance}</span>
  LGO. With this small tool, you will be able to swap them to VGX 2.0. Let's go!
</p>
<p>
  First, you need to allow this tool to transfer your LGOs from your wallet to
  the smart contract, which will perform the swap.
</p>
<button class="block w-full" on:click={approve}>Approve</button>
