<script lang="typescript">
  import { onMount, getContext } from "svelte";
  import BigNumber from "bignumber.js";
  import type { Context } from "../context";

  let lgoBalance = new BigNumber(0);
  let context: Context = getContext("context");

  onMount(async () => {
    lgoBalance = await context!.lgo!.balanceOf(context!.account!);
  });

  const approve = () => {
    context!.lgo!.approve(
      "0x0E801D84Fa97b50751Dbf25036d067dCf18858bF",
      lgoBalance
    );
  };
</script>

<p>{lgoBalance}</p>
<button on:click={approve}>Approve</button>
