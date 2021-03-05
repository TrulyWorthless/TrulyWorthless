pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ERC20Burnable.sol";
import "./ERC20Mintable.sol";
import "./Ownable.sol";

contract StableCoin is ERC20Burnable, ERC20Mintable, Ownable {
  constructor (string memory name, string memory symbol, uint8 decimal, uint256 initialSupply) public ERC20(name, symbol) Ownable() {
    _setupDecimals(decimal);
    _mint(msg.sender, initialSupply * (10 ** uint256(decimals())));
  }

  function burn(uint256 amount) public override onlyOwner {
      _burn(_msgSender(), amount);
  }

  function burnFrom(address account, uint256 amount) public override onlyOwner {
      uint256 decreasedAllowance = allowance(account, _msgSender()).sub(amount, "ERC20: burn amount exceeds allowance");
      _approve(account, _msgSender(), decreasedAllowance);
      _burn(account, amount);
  }

  function mint(uint256 amount) public override onlyOwner {
      _mint(_msgSender(), amount);
  }

  function mintTo(address account, uint256 amount) public override onlyOwner {
      _mint(account, amount);
  }
}
