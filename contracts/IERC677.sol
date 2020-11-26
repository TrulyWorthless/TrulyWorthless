pragma solidity ^0.6.0;

import "./RivendellNetworkBridgeContract.sol";

interface IERC677 {
  event ERC677Transfer(RivendellNetworkBridgeContract receiver, uint256 amount);

  function mintAndCall(address _recipient, uint256 _amount) external returns (bool);
  function transferAndCall(uint256 _amount) external returns (bool);
}
