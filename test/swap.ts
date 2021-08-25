import { ethers } from "hardhat";
import hre from "hardhat";
import { expect } from "chai";

import IERC20 from "../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json";



describe("Swap", function () {
  it("Should swap LGO to VGX", async function () {

    const testAccount = "0x24427bce97233De7F76da5E65A859535dda2677E";
    const lgoToken = '0x0a50C93c762fDD6E56D86215C24AaAD43aB629aa';
    const vgxToken = '0x3C4B6E6e1eA3D4863700D7F76b36B7f3D3f13E3d';
    const swapContract = '0xd6A32053a58a33B05bAD9B388c82BCcF203EE714';

    const lgoContract = await ethers.getContractAt(IERC20.abi, lgoToken);
    const vgxContract = await ethers.getContractAt(IERC20.abi, vgxToken);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [testAccount],
    });

    const signer = await ethers.getSigner(testAccount);

    const Swap = await ethers.getContractFactory("Swap");
    const swap = await Swap.deploy(lgoToken, vgxToken, swapContract);
    await swap.deployed();

    const swapOwner = await swap.owner();

    const initialLgoBalance = await lgoContract.balanceOf(testAccount);

    console.log("Initial LGO balance", initialLgoBalance.toString());

    await lgoContract.connect(signer).approve(swap.address, 100000);

    const swapTx = await swap.connect(signer).swap(100000);

    const finalLgoBalance = await lgoContract.balanceOf(testAccount);

    console.log("final LGO balance", finalLgoBalance.toString());

    const userVgxBalance = await vgxContract.balanceOf(testAccount);

    console.log("user VGX balance", userVgxBalance.toString());

    const feesVgxBalance = await vgxContract.balanceOf(swapOwner);

    console.log("fees VGX balance", feesVgxBalance.toString());

    const contractVgxBalance = await vgxContract.balanceOf(swapContract);

    expect(contractVgxBalance).to.equal(0);

    // wait until the transaction is mined
    await swapTx.wait();
  });
});