pragma solidity ^0.6.0;

interface IForeignContract {
  function onTokenTransfer(address from, uint256 amount, bytes calldata) external returns (bool);
}
