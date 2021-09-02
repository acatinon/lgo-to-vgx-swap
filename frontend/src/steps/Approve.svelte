<script lang="typescript">
  import { getContext } from "svelte";
  import type { Context } from "../context";

  let context: Context = getContext("context");

  const approve = () => {
    context!.lgo!.approve(
      "0x0E801D84Fa97b50751Dbf25036d067dCf18858bF",
      context.lgoBalance!
    );
  };
</script>

<p>{context.lgoBalance}</p>
<button on:click={approve}>Approve</button>
