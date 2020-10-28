pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ERC677.sol";

contract WorthlessWrapper is ERC677 {
  constructor () public ERC20("Truly", "TWC") {
    _mint(msg.sender, 1000000000 * (10 ** uint256(decimals())));
  }
}
