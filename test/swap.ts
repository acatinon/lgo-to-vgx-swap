import { ethers } from "hardhat";
import hre from "hardhat";
import { expect } from "chai";

import IERC20 from "../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json";



describe("Swap", function () {
  it("Should swap LGO to VGX", async function () {

    const testAccountAddress = "0x24427bce97233De7F76da5E65A859535dda2677E";
    const lgoToken = '0x0a50C93c762fDD6E56D86215C24AaAD43aB629aa';
    const vgxToken = '0x3C4B6E6e1eA3D4863700D7F76b36B7f3D3f13E3d';
    const swapContract = '0xd6A32053a58a33B05bAD9B388c82BCcF203EE714';

    const lgoContract = await ethers.getContractAt(IERC20.abi, lgoToken);
    const vgxContract = await ethers.getContractAt(IERC20.abi, vgxToken);


    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [testAccountAddress],
    });

    const testAccount = await ethers.getSigner(testAccountAddress);

    const Swap = await ethers.getContractFactory("Swap");
    const swap = await Swap.deploy(lgoToken, vgxToken, swapContract);
    await swap.deployed();

    const swapOwnerAddress = await swap.owner();

    await lgoContract.connect(testAccount).approve(swap.address, 100000);

    await swap.connect(testAccount).swap(100000);

    const userVgxBalance = await vgxContract.balanceOf(testAccountAddress);
    let contractVgxBalance = await vgxContract.balanceOf(swap.address);

    expect(userVgxBalance).to.equal(15147);
    expect(contractVgxBalance).to.equal(153);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [swapOwnerAddress],
    });

    const swapOwner = await ethers.getSigner(swapOwnerAddress);

    await swap.connect(swapOwner).withdraw();

    const swapOwnerBalance = await vgxContract.balanceOf(swapOwnerAddress);
    contractVgxBalance = await vgxContract.balanceOf(swap.address);

    expect(contractVgxBalance).to.equal(0);
    expect(swapOwnerBalance).to.equal(153);

  });
});