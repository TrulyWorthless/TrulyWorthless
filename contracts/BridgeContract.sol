pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BridgeContract {
  event ERC677Received(address sender, address receiver, uint256 amount);
  ERC20 internal token;

  constructor(ERC20 _token) public {
    token = _token;
  }

  function onTokenTransfer(address from, uint amount) public returns (bool) {
    require(token.balanceOf(address(this)) >= amount);
    emit ERC677Received(from, address(this), amount);
  }
}
