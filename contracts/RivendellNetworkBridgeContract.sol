pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC677.sol";

contract RivendellNetworkBridgeContract is Ownable {
  event tokensAllocated(address recipient, uint256 amount);
  event tokensReceived(address returner, uint256 amount);

  struct transaction {
    address sender;
    uint256 amount;
  }

  ERC677 internal token;
  mapping(string => bool) public previousTransactions;
  transaction[] queuedTransactions;

  constructor(ERC677 _token) public Ownable() {
    token = _token;
  }

  function allocateTokens(address recipient, uint256 amount, string calldata transactionHash) external onlyOwner returns (bool) {
    require(!previousTransactions[transactionHash]);
    previousTransactions[transactionHash] = true;
    require(token.transfer(recipient, amount));
    emit tokensAllocated(recipient, amount);
  }

  function receiveTokens(address sender, uint256 amount) external returns (bool) {
    require(msg.sender == address(token));
    queuedTransactions.push(transaction(sender, amount));
    emit tokensReceived(sender, amount);
  }

  function getTransactions() external onlyOwner returns (address[] memory, uint256[] memory) {
    address[] memory addresses = new address[](queuedTransactions.length);
    uint256[] memory amounts = new uint256[](queuedTransactions.length);

    for (uint i = 0; i < queuedTransactions.length; i++) {
      addresses[i] = queuedTransactions[i].sender;
      amounts[i] = queuedTransactions[i].amount;
    }

    delete queuedTransactions;
    return (addresses, amounts);
  }
}
