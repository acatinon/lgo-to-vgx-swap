import { ethers } from "ethers";
import BigNumber from "bignumber.js";

class Contract {
    protected ethersContract: ethers.Contract;

    constructor(signer: ethers.providers.JsonRpcSigner, addr: string, abi: Array<string>) {
        this.ethersContract = new ethers.Contract(addr, abi, signer);
    }
}

export class ERC20 extends Contract {
    public decimals: number;

    constructor(signer: ethers.providers.JsonRpcSigner, addr: string, decimals: number) {
        const erc20Abi = [
            "function approve(address spender, uint256 amount) external returns (bool)",
            "function allowance(address owner, address spender) external view returns (uint256)",
            "function balanceOf(address account) external view returns (uint256)",
            "event Approval(address indexed owner, address indexed spender, uint256 value)"
        ];

        super(signer, addr, erc20Abi);
        this.decimals = decimals;
    }

    public async approve(spender: string, amount: BigNumber): Promise<boolean> {
        let amountBn = ethers.BigNumber.from(amount.multipliedBy(Math.pow(10, this.decimals)).toString());
        return await this.ethersContract.approve(spender, amountBn);
    }

    public onApprove(owner: string, callback: (owner: string, spender: string, amount: ethers.BigNumber) => void) {
        const filter = this.ethersContract.filters.Approval(owner);
        this.ethersContract.on(filter, callback);
    }

    public async allowance(owner: string, spender: string): Promise<BigNumber> {
        const allowance = await this.ethersContract.allowance(owner, spender);

        return new BigNumber(allowance.toString()).dividedBy(Math.pow(10, this.decimals));
    }

    public async balanceOf(account: string): Promise<BigNumber> {
        const balance = await this.ethersContract.balanceOf(account);

        return new BigNumber(balance.toString()).dividedBy(Math.pow(10, this.decimals));
    }
}

export class SwapContract extends Contract {

    constructor(signer: ethers.providers.JsonRpcSigner, addr: string) {
        const swapAbi = [
            "function swap(uint256 amount) external",
            "event Swap(address indexed sender, uint256 sentAmount, uint256 receivedAmount)"
        ];

        super(signer, addr, swapAbi);
    }

    public async swap(amount: BigNumber, lgo: ERC20): Promise<boolean> {
        let amountBn = ethers.BigNumber.from(amount.multipliedBy(Math.pow(10, lgo.decimals)).toString());
        return await this.ethersContract.swap(amountBn);
    }

    public onSwap(sender: string, callback: (sender: string, sentAmount: ethers.BigNumber, receivedAmount: ethers.BigNumber) => void) {
        const filter = this.ethersContract.filters.Swap(sender);
        this.ethersContract.on(filter, callback);
    }
}