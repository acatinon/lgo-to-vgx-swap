// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const lgoToken = '0x0a50C93c762fDD6E56D86215C24AaAD43aB629aa';
  const vgxToken = '0x3C4B6E6e1eA3D4863700D7F76b36B7f3D3f13E3d';
  const swapContract = '0xd6A32053a58a33B05bAD9B388c82BCcF203EE714';

  // We get the contract to deploy
  const Swap = await hre.ethers.getContractFactory("Swap");
  const swap = await Swap.deploy(lgoToken, vgxToken, swapContract, 100);

  await swap.deployed();

  console.log("Swap deployed to:", swap.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
