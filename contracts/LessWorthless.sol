pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ERC677.sol";

contract LessWorthless is ERC677 {
  constructor () public ERC20("LessWorthless", "LWC") {}
}
