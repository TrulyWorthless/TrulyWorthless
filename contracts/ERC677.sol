pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IERC677.sol";
import "./BridgeContract.sol";

abstract contract ERC677 is ERC20, IERC677 {
  ERC20 internal token;

  function transferAndCall(BridgeContract receiver, uint amount, bytes memory data) public override returns (bool) {
    require(transfer(address(receiver), amount));

    ERC677Transfer(msg.sender, address(receiver), amount);

    require(receiver.onTokenTransfer(msg.sender, amount));
  }
}
