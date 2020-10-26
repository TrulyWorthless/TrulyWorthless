pragma solidity ^0.6.0;

import "./ERC677.sol";

contract WorthlessWrapper is ERC677 {
  constructor (ERC20 _token) public ERC20(_token.name(), _token.symbol()) {
    token = _token;
  }
}
