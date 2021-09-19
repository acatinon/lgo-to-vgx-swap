import type { ethers } from "ethers";
import type BigNumber from "bignumber.js";
import { ERC20, SwapContract } from "./utils/contracts";
import { LGO_ADDRESS, SWAP_CONTRACT } from "./utils/constants";


export class Context {
  public account?: string;
  public lgo?: ERC20;
  public swap?: SwapContract;
  public lgoBalance?: BigNumber;
  public allowance?: BigNumber;
  public receivedVgxlalance?: BigNumber;

  public async init(ethersProvider: ethers.providers.Web3Provider) {
    let accounts = await ethersProvider.listAccounts();
    this.account = accounts[0];
    this.lgo = new ERC20(ethersProvider.getSigner(this.account), LGO_ADDRESS, 8);
    this.swap = new SwapContract(ethersProvider.getSigner(this.account), SWAP_CONTRACT);
    [this.lgoBalance, this.allowance] = await Promise.all(
      [
        this.lgo.balanceOf(this.account),
        this.lgo.allowance(this.account, SWAP_CONTRACT)
      ]
    );
  }
}

