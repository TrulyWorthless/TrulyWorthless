pragma solidity ^0.6.0;

/*
The purpose of this interface is to allow for the ERC677 contract to have an API
with any generic contract possessing the onTokenTransfer function
*/
interface IForeignContract {
  function onTokenTransfer(address from, uint256 amount, bytes calldata) external returns (bool);
}
