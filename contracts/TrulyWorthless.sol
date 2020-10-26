pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

abstract contract TrulyWorthless is ERC20 {
  constructor () public ERC20("Truly", "TWC") {
    _mint(msg.sender, 1000000000 * (10 ** uint256(decimals())));
  }
}
