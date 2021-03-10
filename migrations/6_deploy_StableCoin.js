const StableCoin = artifacts.require("StableCoin");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(StableCoin, "US Dollar", "eUSD", "6", "1000000", {from: accounts[0]});
};
