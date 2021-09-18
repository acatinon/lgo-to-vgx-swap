import type { ethers } from "ethers";
import { Context } from "./context";


export class StepManager {
  public context: Context;

  public constructor() {
    this.context = new Context();
  }

  public async init(ethersProvider: ethers.providers.Web3Provider) {
    await this.context.init(ethersProvider);
  }

  public onApprove(callback: (owner: string, spender: string, amount: ethers.BigNumber) => void) {
    this.context.lgo!.onApprove(this.context.account!, callback);
  }

  public onSwap(callback: (sender: string, sentAmount: ethers.BigNumber, receivedAmount: ethers.BigNumber) => void) {
    this.context.swap!.onSwap(this.context.account!, callback);
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

export enum State {
  Approving,
  WaitingApproveConfirmation,
  WaitingApproveExecution,
  Swapping,
  WaitingSwapConfirmation,
  WaitingSwapExecution,
  Success
}
