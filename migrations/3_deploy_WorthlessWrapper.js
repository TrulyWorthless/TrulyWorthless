const WorthlessWrapper = artifacts.require("WorthlessWrapper");

module.exports = function(deployer) {
  deployer.deploy(WorthlessWrapper);
};
