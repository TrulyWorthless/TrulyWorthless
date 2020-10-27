pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IERC677.sol";
import "./BridgeContract.sol";

contract ERC677 is IERC677 {
  ERC20 internal token;

  constructor (ERC20 _token) public {
    token = _token;
  }

  function transferAndCall(BridgeContract receiver, uint amount, bytes memory data) public override returns (bool) {
    require(token.transfer(address(receiver), amount));

    ERC677Transfer(msg.sender, address(receiver), amount);

    require(receiver.onTokenTransfer(msg.sender, amount));
  }
}
