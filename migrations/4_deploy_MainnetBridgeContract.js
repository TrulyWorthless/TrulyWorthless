const MainnetBridgeContract = artifacts.require("MainnetBridgeContract");

module.exports = function(deployer) {
  deployer.deploy(MainnetBridgeContract);
};
