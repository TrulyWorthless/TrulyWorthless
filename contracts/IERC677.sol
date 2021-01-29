pragma solidity ^0.6.0;

interface IERC677 {
  function transferAndCall(address receiver, uint amount, bytes calldata) external returns (bool success);
}
