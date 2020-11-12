pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IERC677.sol";
import "./RivendellNetworkBridgeContract.sol";

abstract contract ERC677 is ERC20, IERC677 {
  function transferAndCall(RivendellNetworkBridgeContract receiver, uint amount) public override returns (bool) {
    require(transfer(address(receiver), amount));

    emit ERC677Transfer(receiver, amount);

    require(receiver.receiveTokens(msg.sender, amount));
  }
}
