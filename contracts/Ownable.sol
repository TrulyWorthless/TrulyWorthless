// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/GSN/Context.sol";

/**
 * @title Telcoin Stable Coin Initiative
 * @author Amir Shirif
 * @dev Implements Openzeppelin Audited Contracts
 */
abstract contract Ownable is Context {
  using SafeMath for uint256;
  //mapping of current owners
  mapping(address => bool) internal _owners;
  //number of current owners
  uint256 ownerCount;

  event OwnerAdded(address indexed newOwner);
  event OwnerRemoved(address indexed previousOwner);

  /**
   * @dev creates contract, caller is original owner
   */
  constructor () {
    ownerCount = 1;
    _owners[_msgSender()] = true;
    emit OwnerAdded(_msgSender());
  }

  /**
   * @dev checks if address is an owner of contract
   * @param owner the address being checked for ownership
   * @return bool true for ownership, false for non-owner
   */
  function isOwner(address owner) public view returns (bool) {
    return _owners[owner];
  }

  /**
   * @dev adds a new address as an owner
   * @param newOwner the address being given ownership
   */
  function addOwner(address newOwner) public onlyOwner {
    require(!_owners[newOwner], "Ownable: address is already owner");
    ownerCount = ownerCount.add(1);
    _owners[newOwner] = true;
    emit OwnerAdded(newOwner);
  }

  /**
   * @dev removes a current address from ownership, must always maintain at least one owner
   * @param previousOwner the address being removed
   */
  function removeOwner(address previousOwner) public onlyOwner {
    require(_owners[previousOwner], "Ownable: address is not an owner");
    require(ownerCount > 1, "Ownable: no remaining owners");
    ownerCount = ownerCount.sub(1);
    _owners[previousOwner] = false;
    emit OwnerRemoved(previousOwner);
  }

  /**
   * @dev prevents any non-owner from performing restricted function calls
   */
  modifier onlyOwner() {
    require(_owners[_msgSender()], "Ownable: caller is not an owner");
    _;
  }
}
