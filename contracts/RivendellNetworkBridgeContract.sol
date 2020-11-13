pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC677.sol";

contract RivendellNetworkBridgeContract is Ownable {
  event ERC677Allocated(address indexed recipient, uint256 amount);
  event ERC677Received(address indexed returner, uint256 amount);

  struct transaction {
    address sender;
    uint256 amount;
  }

  mapping(string => bool) internal previousTransactions;
  transaction[] internal queuedTransactions;
  ERC677 internal token;

  constructor() public Ownable() {
    token = ERC677(0xaEe8Cfd6C351EF2F0c53fE963F4112043d371E6a);//change
  }

  function allocateTokens(address recipient, uint256 amount, string calldata transactionHash) external onlyOwner returns (bool) {
    require(!previousTransactions[transactionHash]);
    previousTransactions[transactionHash] = true;
    require(token.transfer(recipient, amount));
    emit ERC677Allocated(recipient, amount);
  }

  function onTokenTransfer(address sender, uint256 amount) external returns (bool) {
    require(msg.sender == address(token));
    queuedTransactions.push(transaction(sender, amount));
    emit ERC677Received(sender, amount);
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
