pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ERC677.sol";

contract WorthlessWrapper is ERC677 {
  constructor () public ERC20("TrulyWorthless", "TWC") {
    bridge = RivendellNetworkBridgeContract(0);
  }
}
