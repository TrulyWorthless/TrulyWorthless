const RivendellNetworkBridgeContract = artifacts.require("RivendellNetworkBridgeContract");

module.exports = function(deployer) {
  deployer.deploy(RivendellNetworkBridgeContract);
};
