pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MainnetBridgeContract is Ownable {
  event ERC20Received(address indexed sender, uint256 amount);
  event ERC20Returned(address indexed recipient, uint256 amount);

  mapping(address => uint256) internal transactions;
  ERC20 internal token;

  constructor() public Ownable() {
    token = ERC20(0xa642EbABac83ad81C3653Bc0B8BA04524691E12B);
  }

  function findBalance(address account) external view returns (uint256) {
    return transactions[account];
  }

  function onTokenTransfer(uint256 amount) external returns (bool) {
    require(token.transferFrom(msg.sender, address(this), amount), "MainnetBridgeContract: Tokens not received");
    transactions[msg.sender] += amount;
    emit ERC20Received(msg.sender, amount);
  }

  function returnTokens(address _address, uint256 _amount) external onlyOwner returns (bool) {
    if (transactions[_address] >= _amount) {
      transactions[_address] -= _amount;
      require(token.transfer(_address, _amount), "MainnetBridgeContract: Tokens were not returned");
      emit ERC20Returned(_address, _amount);
    }
  }
}
