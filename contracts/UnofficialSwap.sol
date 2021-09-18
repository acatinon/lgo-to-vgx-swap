//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

abstract contract OfficialSwap {
    function swap(uint256 _amount) public virtual;
}

contract UnofficialSwap is Ownable {
    uint256 public feesRate;

    uint256 private swapFromQuantity = 65356340619;
    uint256 private swapToQuantity = 10000000000;

    IERC20 public lgoToken;
    IERC20 public vgxToken;
    OfficialSwap public officialSwapContract;

    event Swap(
        address indexed sender,
        uint256 sentAmount,
        uint256 receivedAmount
    );

    constructor(
        IERC20 _lgoToken,
        IERC20 _vgxToken,
        OfficialSwap _officialSwapContract,
        uint256 _feesRate
    ) {
        lgoToken = _lgoToken;
        vgxToken = _vgxToken;
        officialSwapContract = _officialSwapContract;
        feesRate = _feesRate;

        lgoToken.approve(address(officialSwapContract), 2**256 - 1);
    }

    function swap(uint256 _amount) external {
        lgoToken.transferFrom(_msgSender(), address(this), _amount);

        officialSwapContract.swap(_amount);

        uint256 exchangeAmount = (_amount * swapToQuantity) / swapFromQuantity;
        uint256 exchangeAmountMinusFees = (exchangeAmount *
            (10000 - feesRate)) / 10000;

        vgxToken.transfer(_msgSender(), exchangeAmountMinusFees);

        emit Swap(msg.sender, _amount, exchangeAmountMinusFees);
    }

    function updateFeesRate(uint256 _feesRate) external onlyOwner {
        require(_feesRate < 100000, "The swap fees must be < 100%");
        feesRate = _feesRate;
    }

    function withdraw() external onlyOwner {
        uint256 balance = vgxToken.balanceOf(address(this));

        vgxToken.transfer(owner(), balance);
    }
}
