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

  mapping(string => bool) internal incomingTransactions;
  transaction[] internal outgoingTransactions;
  uint256 internal nonce;
  ERC677 internal token;

  constructor() public Ownable() {
    nonce = 0;
    token = ERC677(0);
    outgoingTransactions.push(transaction(address(0), 0));
  }

  function setToken(address _token) public onlyOwner {
    token = ERC677(_token);
  }

  function getToken() public view returns (address) {
    return address(token);
  }

  function getCurrentNonce() public view returns (uint256) {
    return nonce;
  }

  /* function retrieveFunds(uint256 _amount) public onlyOwner returns (bool) {
    require(token.transferFrom(msg.sender, address(this), _amount), "RivendellNetworkBridgeContract: tokens not retrieve");
    return true;
  } */

  function allocateTokens(address _recipient, uint256 _amount, string calldata _transactionHash) external onlyOwner returns (bool) {
    require(!incomingTransactions[_transactionHash], "RivendellNetworkBridgeContract: transaction has already been recorded");
    incomingTransactions[_transactionHash] = true;
    require(token.mintAndCall(_recipient, _amount), "RivendellNetworkBridgeContract: transfer was not executed");
    emit ERC677Allocated(_recipient, _amount);
    return true;
  }

  function onTokenTransfer(address _sender, uint256 _amount) external returns (bool) {
    require(msg.sender == address(token), "RivendellNetworkBridgeContract: sender needs to be ERC677 token");
    outgoingTransactions.push(transaction(_sender, _amount));
    nonce++;
    emit ERC677Received(_sender, _amount);
    return true;
  }

  function getTransaction(uint256 _nonce) external view returns (address, uint256, bytes32) {
    require(getCurrentNonce() >= _nonce, "RivendellNetworkBridgeContract: provided nonce is greater than current nonce");
    return (outgoingTransactions[_nonce].sender, outgoingTransactions[_nonce].amount, getHash(outgoingTransactions[_nonce].sender, _nonce));
  }

  function getHash(address _sender, uint256 _nonce) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked(_sender, _nonce));
  }
}
