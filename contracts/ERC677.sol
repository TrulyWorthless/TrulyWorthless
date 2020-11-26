pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
/* import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol"; */
import "./IERC677.sol";
import "./RivendellNetworkBridgeContract.sol";

abstract contract ERC677 is ERC20, IERC677 {
  RivendellNetworkBridgeContract internal bridge;

  function setBridge(RivendellNetworkBridgeContract _bridge) public {
    require(address(bridge) == address(0), "ERC677: bridge has been previously set");
    bridge = _bridge;
  }

  function getBridge() public view returns (address) {
    return address(bridge);
  }

  function mintAndCall(address _recipient, uint256 _amount) external override returns (bool) {
    require(msg.sender == address(bridge), "ERC677: minter needs to be bridge contract");
    _mint(_recipient, _amount * (10 ** uint256(decimals())));
    return true;
  }

  function transferAndCall(uint _amount) external override returns (bool) {
    _burn(msg.sender, _amount);
    require(bridge.onTokenTransfer(msg.sender, _amount), "ERC677: tokens were not restored");
    return true;
  }
}
