pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IERC677.sol";
import "./RivendellNetworkBridgeContract.sol";

abstract contract ERC677 is ERC20, IERC677 {
  function transferAndCall(RivendellNetworkBridgeContract receiver, uint amount) public override returns (bool) {
    require(transfer(address(receiver), amount), "ERC677: transfer was not executed");

    emit ERC677Transfer(receiver, amount);

    require(receiver.onTokenTransfer(msg.sender, amount), "ERC677: Tokens were not restored");
  }
}
