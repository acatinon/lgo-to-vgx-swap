import type { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { Context } from "./context";

import Approve from "./steps/Approve.svelte";
import Wait from "./steps/Wait.svelte";
import Swap from "./steps/Swap.svelte";
import Success from "./steps/Success.svelte";

export class StepManager {
  public context: Context;
  private onStepChangedCallback?: (component: any) => void;
  private onErrordCallback?: (code: number, message: string) => void;

  public constructor() {
    this.context = new Context();
    this.onStepChangedCallback = undefined;
    this.onErrordCallback = undefined;
  }

  public async init(ethersProvider: ethers.providers.Web3Provider) {
    await this.context.init(ethersProvider);

    this.context.lgo!.onApprove(this.context.account!, (owner: string, spender: string, amount: ethers.BigNumber) => {
      this.context.allowance = new BigNumber(amount.toString()).dividedBy(Math.pow(10, this.context.lgo!.decimals));
      this.onStepChangedCallback!(Swap);
    });

    this.context.swap!.onSwap(this.context.account!, (sender: string, sentAmount: ethers.BigNumber, receivedAmount: ethers.BigNumber) => {
      this.context.receivedVgxlalance = new BigNumber(receivedAmount.toString());
      this.onStepChangedCallback!(Success);
    });

    if (this.context.allowance!.gt(0)) {      
      this.onStepChangedCallback!(Swap);
    }
    else {
      this.onStepChangedCallback!(Approve);
    }
  }

  public transactionInitiated() {
    this.onStepChangedCallback!(Wait);
  }

  public showError(error: Error) {
    console.error(error);
    if (error.data) {
      this.onErrordCallback!(error.data.code, error.data.message);
    }
    else {
      this.onErrordCallback!(error.code, error.message);
    }
  }

  public onStepChanged(callback: (component: any) => void): any {
    this.onStepChangedCallback = callback;
  }

  public onError(callback: (code: number, message: string) => void): any {
    this.onErrordCallback = callback;
  }
}

export type Error = {
  code: number;
  data?: {
    code: number;
    message: string;
  }
  message: string;
}
