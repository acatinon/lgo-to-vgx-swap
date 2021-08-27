<script lang="typescript">
  import { onMount } from "svelte";
  import { web3 } from "./utils/web3";

  import type { ethers } from "ethers";

  const web3Provider = web3();

  onMount(async () => {
    web3Provider.connectIfCachedProvider().then(onConnected);
  });
  const connect = () => {
    web3Provider.connect().then(onConnected);
  };

  const onConnected = async (
    ethersProvider: ethers.providers.Web3Provider
  ) => {};
</script>

{#if $web3Provider.isConnected}
  <button on:click={web3Provider.disconnect}>Log out</button>
{:else}
  <button class="p-1" on:click={connect}>Connect your wallet</button>
{/if}

