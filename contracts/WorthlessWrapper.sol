pragma solidity ^0.6.0;

import "./TrulyWorthless.sol";
import "./ERC677.sol";

contract WorthlessWrapper is ERC677 {
  constructor () public ERC677(ERC20(0xaEe8Cfd6C351EF2F0c53fE963F4112043d371E6a)) {
    /* _mint(msg.sender, 1000 * (10 ** uint256(decimals()))); */
  }
}
