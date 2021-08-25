import { task, HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});


const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/7xeGs22pDCMlsMC5ZiasB0XfC41g0F9z",
        blockNumber: 12926420
      }
    }
  }
};

export default config;