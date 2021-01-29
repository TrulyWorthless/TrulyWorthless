const WorthlessFactory = artifacts.require("WorthlessFactory");

module.exports = function(deployer) {
  deployer.deploy(WorthlessFactory);
};
