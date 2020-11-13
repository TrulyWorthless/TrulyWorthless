pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MainnetBridgeContract is Ownable {
  event ERC20Received(address indexed sender, uint256 amount);
  event ERC20Returned(address indexed sender, uint256 amount);

  mapping(address => uint256) internal previousTransactions;
  ERC20 internal token;

  constructor() public Ownable() {
    token = ERC20(0xaEe8Cfd6C351EF2F0c53fE963F4112043d371E6a);
  }

  function onTokenTransfer(uint256 amount) external returns (bool) {
    require(token.transferFrom(msg.sender, address(this), amount), "Tokens not received");
    previousTransactions[msg.sender] += amount;
    emit ERC20Received(msg.sender, amount);
  }

  function returnTokens(address[] calldata addresses, uint256[] calldata amounts) external onlyOwner returns (bool) {
    for (uint i = 0; i < addresses.length; i++) {
      if (previousTransactions[addresses[i]] >= amounts[i]) {
        previousTransactions[addresses[i]] -= amounts[i];
        require(token.transfer(addresses[i], amounts[i]), "Token was not returned");
      }
    }
  }
}
