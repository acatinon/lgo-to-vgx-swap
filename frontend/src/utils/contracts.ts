import { ethers } from "ethers";
import BigNumber from "bignumber.js";

class Contract {
    protected ethersContract: ethers.Contract;

    constructor(signer: ethers.providers.JsonRpcSigner, addr: string, abi: Array<string>) {
        this.ethersContract = new ethers.Contract(addr, abi, signer);
    }
}

export class ERC20 extends Contract {
    private decimals: number;

    constructor(signer: ethers.providers.JsonRpcSigner, addr: string, decimals: number) {
        const erc20Abi = [
            "function approve(address spender, uint256 amount) external returns (bool)",
            "function allowance(address owner, address spender) external view returns (uint256)",
            "function balanceOf(address account) external view returns (uint256)"
        ];

        super(signer, addr, erc20Abi);
        this.decimals = decimals;
    }

    public async approve(spender: string, amount: BigNumber): Promise<boolean> {
        let amountBn = ethers.BigNumber.from(amount.multipliedBy(Math.pow(10, this.decimals)).toString());
        return await this.ethersContract.approve(spender, amountBn);
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