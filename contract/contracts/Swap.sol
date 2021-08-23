//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract OfficialSwapInterface {
    function swap(uint256 _amount) public virtual;
}

contract Swap {
    uint256 private feesRate = 10000000000000000; // 1%

    uint256 private swapFromQuantity = 65356340619;
    uint256 private swapToQuantity = 10000000000;
    address private feesDest;

    IERC20 private lgoToken;
    IERC20 private vgxToken;
    OfficialSwapInterface private officialSwapContract;

    constructor(
        IERC20 _lgoToken,
        IERC20 _vgxToken,
        OfficialSwapInterface _officialSwapContract
    ) {
        lgoToken = _lgoToken;
        vgxToken = _vgxToken;
        officialSwapContract = _officialSwapContract;
    }

    function swap(uint256 _amount) public {
        lgoToken.transfer(address(this), _amount);

        officialSwapContract.swap(_amount);

        uint256 exchangeAmount = (_amount * swapToQuantity) / swapFromQuantity;

        vgxToken.transferFrom(
            address(this),
            msg.sender,
            exchangeAmount * ((10 ^ 18) - feesRate)
        );

        vgxToken.transferFrom(
            address(this),
            msg.sender,
            exchangeAmount * feesRate
        );
    }
}
