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
  uint256 internal nonce;
  ERC677 constant internal token = ERC677(0x20cdE6cF3E99848C0d828877B4190fcd1357727c);

  constructor() public Ownable() {}

  function retrieveFunds(uint256 amount) public onlyOwner {
    require(token.transferFrom(msg.sender, address(this), amount), "RivendellNetworkBridgeContract: Funds not retrieve");
  }

  function findBalance() public view returns (uint256) {
    return token.balanceOf(address(this));
  }

  function allocateTokens(address recipient, uint256 amount, string calldata transactionHash) external onlyOwner returns (bool) {
    require(!previousTransactions[transactionHash], "RivendellNetworkBridgeContract: transaction has already been recorded");
    previousTransactions[transactionHash] = true;
    require(token.transfer(recipient, amount), "RivendellNetworkBridgeContract: transfer was not executed");
    emit ERC677Allocated(recipient, amount);
  }

  function onTokenTransfer(address sender, uint256 amount) external returns (bool) {
    require(msg.sender == address(token), "RivendellNetworkBridgeContract: sender needs to be ERC677 token");
    queuedTransactions.push(transaction(sender, amount));
    emit ERC677Received(sender, amount);
    nonce++;
    return true;
  }

  function getCurrentNonce() external view returns (uint256) {
    return nonce - 1;
  }

  function getTransactions(uint256 index) external view returns (address, uint256) {
    if (index >= nonce) return (address(0), uint256(0));
    return (queuedTransactions[index].sender, queuedTransactions[index].amount);
  }
}
