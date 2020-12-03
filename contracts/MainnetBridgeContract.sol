pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MainnetBridgeContract is Ownable {
  event ERC20Received(address indexed sender, uint256 amount);
  event ERC20Returned(address indexed recipient, uint256 amount);

  mapping(string => bool) internal transactions;
  ERC20 internal token;

  constructor() public Ownable() {
    token = ERC20(0);
  }

  function setToken(address _token) public onlyOwner {
    token = ERC20(_token);
  }

  function getToken() public view returns (address) {
    return address(token);
  }

  function onTokenTransfer(uint256 _amount) external returns (bool) {
    require(token.transferFrom(msg.sender, address(this), _amount), "MainnetBridgeContract: tokens not received");
    emit ERC20Received(msg.sender, _amount);
    return true;
  }

  function returnTokens(address _address, uint256 _amount, string calldata _transactionHash) external onlyOwner returns (bool) {
    require(!transactions[_transactionHash], "MainnetBridgeContract: transaction has already been recorded");
    transactions[_transactionHash] = true;
    require(token.transfer(_address, _amount), "MainnetBridgeContract: tokens were not returned");
    emit ERC20Returned(_address, _amount);
    return true;
  }
}
