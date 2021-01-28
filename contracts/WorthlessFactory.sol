pragma solidity ^0.6.0;

import "./WorthlessToken.sol";

contract WorthlessFactory {
  event Deployed(address indexed token);

  mapping (address => bool) private createdTokens;

  function deploy(string memory name, string memory symbol, uint256 supply) public {
    Token token = new Token(msg.sender, name, symbol, 18, supply);
    createdTokens[address(token)] = true;
    emit Deployed(address(token));
  }

  function deploy(string memory name, string memory symbol, uint256 decimals, uint256 supply) public {
    Token token = new Token(msg.sender, name, symbol, decimals, supply);
    createdTokens[address(token)] = true;
    emit Deployed(address(token));
  }

  function isToken(address tokenAddress) public view returns (bool) {
    return createdTokens[tokenAddress];
  }
}
