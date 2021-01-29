pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/*
This is a generic token for creating by way of the token factory
*/
contract Token is ERC20 {
  constructor (address creator, string memory name, string memory symbol, uint256 decimals, uint256 supply) public ERC20(name, symbol) {
    require(decimals <= 18, "Decimal value is too high");
    _setupDecimals(uint8(decimals));
    _mint(creator, supply * (10 ** decimals));
  }
}
