// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/*
A standard ERC20 token using openzeppelin
*/
contract TrulyWorthless is ERC20 {
  constructor () public ERC20("TrulyWorthless", "TWC") {
    _setupDecimals(2);
    _mint(msg.sender, 1000000000 * (10 ** uint256(decimals())));
  }
}
