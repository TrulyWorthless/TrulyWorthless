// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ERC677.sol";

/*
This is an instance of the ERC677 token
*/
contract LessWorthless is ERC677 {
  constructor () public ERC20("LessWorthless", "LWC") {
    _setupDecimals(0);
    _mint(msg.sender, 1000000);
  }
}
