pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/GSN/Context.sol";

abstract contract ERC20Mintable is Context, ERC20 {
    using SafeMath for uint256;

    function mint(uint256 amount) public virtual {
        _mint(_msgSender(), amount);
    }

    function mintTo(address account, uint256 amount) public virtual {
        _mint(account, amount);
    }
}
