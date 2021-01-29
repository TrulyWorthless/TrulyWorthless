pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IERC677.sol";
import "./IForeignContract.sol";

/*
ERC677 is built on top of and fully backwards compatable with ERC20
The sole difference is the inclusion of the transferAndCall function
This offers the ability to transfer tokens and call an additional contract in a single transaction
*/
abstract contract ERC677 is ERC20, IERC677 {
  function transferAndCall(address receiver, uint amount, bytes memory data) public override returns (bool) {
    transfer(receiver, amount);
    require(IForeignContract(receiver).onTokenTransfer(msg.sender, amount, data), "Contract function failed.");
    return true;
  }
}
