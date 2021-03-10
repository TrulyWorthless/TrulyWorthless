// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/GSN/Context.sol";

/**
 * @title Telcoin Stable Coin Initiative
 * @author Amir Shirif
 * @dev Implements Openzeppelin Audited Contracts
 */
abstract contract ERC20Mintable is Context, ERC20 {
    using SafeMath for uint256;

    /**
     * @dev introduces tokens into circulation
     * @param amount the quantity that is to be added
     */
    function mint(uint256 amount) public virtual {
        _mint(_msgSender(), amount);
    }

    /**
     * @dev introduces tokens into circulation at the address provided
     * @param account the recipient of the newly minted tokens
     * @param amount the quantity that is to be added
     */
    function mintTo(address account, uint256 amount) public virtual {
        _mint(account, amount);
    }
}
