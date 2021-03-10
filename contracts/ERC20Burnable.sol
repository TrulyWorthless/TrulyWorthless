// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/GSN/Context.sol";

/**
 * @title Telcoin Stable Coin Initiative
 * @author Amir Shirif
 * @dev Implements Openzeppelin Audited Contracts
 */
abstract contract ERC20Burnable is Context, ERC20 {
    using SafeMath for uint256;

    /**
     * @dev Removes tokens from circulation
     * @param amount the quantity that is to be removed
     */
    function burn(uint256 amount) public virtual {
        _burn(_msgSender(), amount);
    }

    /**
     * @dev Removes tokens from circulation from a source other than token owner, with owner's approval
     * @param account the address the tokens are being burned from
     * @param amount the quantity that is to be removed
     */
    function burnFrom(address account, uint256 amount) public virtual {
        uint256 decreasedAllowance = allowance(account, _msgSender()).sub(amount, "ERC20: burn amount exceeds allowance");
        _approve(account, _msgSender(), decreasedAllowance);
        _burn(account, amount);
    }
}
