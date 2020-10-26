pragma solidity ^0.6.0;

import "./BridgeContract.sol";

interface IERC677 {
  event ERC677Transfer(address sender, address receiver, uint256 amount);

  function transferAndCall(BridgeContract receiver, uint256 amount, bytes calldata data) external returns (bool);
}
