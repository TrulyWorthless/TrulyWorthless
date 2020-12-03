const BridgeContract = artifacts.require("RivendellNetworkBridgeContract");
const TokenContract = artifacts.require("WorthlessWrapper");

contract("RivendellNetworkBridgeContract", accounts => {
  const coinbase = accounts[0];
  var bridge;
  var token;

  beforeEach(async () => {
    bridge = await BridgeContract.new();
    token = await TokenContract.new();
  });

  describe("Initial values", () => {
    it("The owner should be the account that deployed the contract", async () => {
      assert.equal(await bridge.owner(), coinbase, "The owner is not the deployer");
    });

    it("The token value should be unassigned initially", async () => {
      let tokenAddress = await bridge.getToken();
      assert.equal(tokenAddress, "0x0000000000000000000000000000000000000000", "The address is not empty");
      assert.notEqual(tokenAddress, coinbase, "There is an initial address");
    });
  });
});
