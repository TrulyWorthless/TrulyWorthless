pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IERC677.sol";
import "./IForeignContract.sol";

abstract contract ERC677 is ERC20, IERC677 {
  function transferAndCall(address receiver, uint amount, bytes memory data) public override returns (bool) {
    transfer(receiver, amount);
    require(IForeignContract(receiver).onTokenTransfer(msg.sender, amount, data));
  }
}
