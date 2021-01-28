const WorthlessToken = artifacts.require("WorthlessToken");

module.exports = function(deployer) {
  deployer.deploy(WorthlessToken);
};
