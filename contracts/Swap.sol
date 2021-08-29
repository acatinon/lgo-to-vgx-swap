//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

abstract contract OfficialSwap {
    function swap(uint256 _amount) public virtual;
}

contract Swap is Ownable {
    uint256 private feesRate = 100; // 1%

    uint256 private swapFromQuantity = 65356340619;
    uint256 private swapToQuantity = 10000000000;

    IERC20 private lgoToken;
    IERC20 private vgxToken;
    OfficialSwap private officialSwapContract;

    constructor(
        IERC20 _lgoToken,
        IERC20 _vgxToken,
        OfficialSwap _officialSwapContract
    ) {
        lgoToken = _lgoToken;
        vgxToken = _vgxToken;
        officialSwapContract = _officialSwapContract;

        lgoToken.approve(address(officialSwapContract), 100000);
    }

    function swap(uint256 _amount) public {
        lgoToken.transferFrom(_msgSender(), address(this), _amount);

        officialSwapContract.swap(_amount);

        uint256 exchangeAmount = (_amount * swapToQuantity) / swapFromQuantity;

        vgxToken.transfer(
            _msgSender(),
            (exchangeAmount * (10000 - feesRate)) / 10000
        );
    }

    function withdraw() public onlyOwner {
        uint256 balance = vgxToken.balanceOf(address(this));

        vgxToken.transfer(owner(), balance);
    }
}
