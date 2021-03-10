// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

interface IERC677 {
  function transferAndCall(address receiver, uint amount, bytes calldata) external returns (bool success);
}
