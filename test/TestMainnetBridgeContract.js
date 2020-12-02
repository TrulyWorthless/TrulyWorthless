const BridgeContract = artifacts.require("MainnetBridgeContract");

contract("MainnetBridgeContract", accounts => {
  const coinbase = accounts[0];

  it("The owner should be the account that deployed the contract", () =>
    BridgeContract.deployed()
    .then(bridge => bridge.owner.call())
    .then(owner => {
      assert.equal(owner.valueOf(), coinbase, "The owner is not the deployer");
    }));
});
