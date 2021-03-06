// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./WorthlessToken.sol";

/*
This creates tokens for the caller with the parameters supplied
*/
contract WorthlessFactory {
  event Deployed(address indexed token);

  mapping (address => bool) private createdTokens;

  function onTokenTransfer(address receiver, uint supply, bytes memory data) public returns (bool) {
    Token token = new Token(receiver, string(data), "WFC", 18, supply);
    createdTokens[address(token)] = true;
    emit Deployed(address(token));
    return true;
  }

  function deploy(string memory name, string memory symbol, uint256 supply) public {
    Token token = new Token(msg.sender, name, symbol, 18, supply);
    createdTokens[address(token)] = true;
    emit Deployed(address(token));
  }

  function deployWithDecimals(string memory name, string memory symbol, uint256 decimals, uint256 supply) public {
    Token token = new Token(msg.sender, name, symbol, decimals, supply);
    createdTokens[address(token)] = true;
    emit Deployed(address(token));
  }

  function isToken(address tokenAddress) public view returns (bool) {
    return createdTokens[tokenAddress];
  }
}
