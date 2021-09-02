import type { ethers } from "ethers";
import type BigNumber from "bignumber.js";
import { ERC20 } from "./utils/contracts";
import { LGO_ADDRESS } from "./utils/constants";


export class Context {
  public account?: string;
  public lgo?: ERC20;
  public lgoBalance?: BigNumber;
  public allowance?: BigNumber;

  public async init(ethersProvider: ethers.providers.Web3Provider) {
    let accounts = await ethersProvider.listAccounts();
    this.account = accounts[0];
    this.lgo = new ERC20(
      ethersProvider.getSigner(this.account),
      LGO_ADDRESS,
      8
    );
    [this.lgoBalance, this.allowance] = await Promise.all(
      [
        this.lgo.balanceOf(this.account),
        this.lgo.allowance(
          this.account,
          "0x0E801D84Fa97b50751Dbf25036d067dCf18858bF"
        )
      ]
    );

  }
}

