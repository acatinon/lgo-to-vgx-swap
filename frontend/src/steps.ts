import type { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { Context } from "./context";

import Approve from "./steps/Approve.svelte";
import Wait from "./steps/Wait.svelte";
import Swap from "./steps/Swap.svelte";

export class StepManager {
  public context: Context;
  private onStepChangedCallback?: (component: any) => void;
  private onErrordCallback?: (error: Error) => void;

  public constructor() {
    this.context = new Context();
    this.onStepChangedCallback = undefined;
    this.onErrordCallback = undefined;
  }

  public async init(ethersProvider: ethers.providers.Web3Provider) {
    await this.context.init(ethersProvider);

    if (this.context.allowance!.gt(0)) {
      this.onStepChangedCallback!(Swap);
    }
    else {
      this.context.lgo!.onApprove(this.context.account!, (owner: string, spender: string, amount: ethers.BigNumber) => {
        this.context.allowance = new BigNumber(amount.toString());
        this.onStepChangedCallback!(Swap);
      });

      this.onStepChangedCallback!(Approve);
    }
  }

  public approving() {
    this.onStepChangedCallback!(Wait);
  }

  public showError(error: Error) {
    this.onErrordCallback!(error);
  }

  public onStepChanged(callback: (component: any) => void): any {
    this.onStepChangedCallback = callback;
  }

  public onError(callback: (error: Error) => void): any {
    this.onErrordCallback = callback;
  }
}

export type Error = {
  code: number;
  message: string;
}
