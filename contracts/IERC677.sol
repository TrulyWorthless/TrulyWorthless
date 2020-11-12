pragma solidity ^0.6.0;

import "./RivendellNetworkBridgeContract.sol";

interface IERC677 {
  event ERC677Transfer(RivendellNetworkBridgeContract receiver, uint256 amount);

  function transferAndCall(RivendellNetworkBridgeContract receiver, uint256 amount) external returns (bool);
}
