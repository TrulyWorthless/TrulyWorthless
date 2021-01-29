pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/*
This contract behaves as Weth, allowing someone to deposit Ether and receive a tokenized version
*/
contract WorthlessWrapper is ERC20 {
  event  Deposit(address indexed sender, uint amount);
  event  Withdrawal(address indexed recipient, uint amount);

  constructor () public ERC20("WorthlessWrapper", "WWC") {}

  //receive tokenized ether
  function deposit() external payable {
    _mint(msg.sender, msg.value);
    emit Deposit(msg.sender, msg.value);
  }

  //receive ether from ERC20 token
  function withdraw(uint amount) external {
    _burn(msg.sender, amount);
    msg.sender.transfer(amount);
    emit Withdrawal(msg.sender, amount);
  }

  receive() external payable {
    this.deposit();
  }
}
