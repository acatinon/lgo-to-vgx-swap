<script lang="typescript">
  import { onMount } from "svelte";
  import { web3 } from "./utils/web3";
  import { ERC20 } from "./utils/contracts"

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
  ) => {
    let accounts = await ethersProvider.listAccounts();

    let lgo = new ERC20(ethersProvider, "0x0a50C93c762fDD6E56D86215C24AaAD43aB629aa", 8);

    console.log(await (await lgo.balanceOf(accounts[0])).toString())
  };
</script>

{#if $web3Provider.isConnected}
  <button on:click={web3Provider.disconnect}>Log out</button>
{:else}
  <button class="p-1" on:click={connect}>Connect your wallet</button>
{/if}

