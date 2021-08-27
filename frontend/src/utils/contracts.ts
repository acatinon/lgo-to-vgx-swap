import { ethers } from "ethers";
import BigNumber from "bignumber.js";

class Contract {
    protected ethersContract: ethers.Contract;

    constructor(ethersProvider: ethers.providers.Web3Provider, addr: string, abi: Array<string>)
    {
        this.ethersContract = new ethers.Contract(addr, abi, ethersProvider);
    }
}

export class ERC20 extends Contract {
    private decimals: number;

    constructor(ethersProvider: ethers.providers.Web3Provider, addr: string, decimals: number)
    {
        const erc20Abi = [
            "function balanceOf(address account) external view returns (uint256)"
        ];

        super(ethersProvider, addr, erc20Abi);
        this.decimals = decimals;
    }

    public async balanceOf(account: string): Promise<BigNumber> {
        const balance = await this.ethersContract.balanceOf(account);
    
        return new BigNumber(balance.toString()).dividedBy(Math.pow(10, this.decimals));
    }
}