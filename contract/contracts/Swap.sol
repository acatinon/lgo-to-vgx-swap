//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract OfficialSwapInterface {
    function swap(uint256 _amount) public view returns (uint256);
}

contract Swap {
    uint256 private feesRate = 10000000000000000; // 1%
    address private feesDest;

    address private officialSwapInterfaceAddress = 0xd6A32053a58a33B05bAD9B388c82BCcF203EE714;

    constructor() {
    }

    function swap(uint256 _amount) public {
        OfficialSwapInterface officialSwapContract = OfficialSwapInterface(officialSwapInterfaceAddress);

        officialSwapContract.swap(_amount);
    }
}
