pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WorthlessWrapper is ERC20 {
  event  Deposit(address indexed sender, uint amount);
  event  Withdrawal(address indexed recipient, uint amount);

  constructor () public ERC20("WorthlessWrapper", "WWC") {}

  function deposit() external payable {
    _mint(msg.sender, msg.value);
    emit Deposit(msg.sender, msg.value);
  }

  function withdraw(uint amount) external {
    _burn(msg.sender, amount);
    msg.sender.transfer(amount);
    emit Withdrawal(msg.sender, amount);
  }

  receive() external payable {
    this.deposit();
  }
}
