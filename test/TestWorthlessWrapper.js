const TokenContract = artifacts.require("WorthlessWrapper");
const BridgeContract = artifacts.require("RivendellNetworkBridgeContract");

contract("WorthlessWrapper", accounts => {
  const coinbase = accounts[0];
  var token;
  var bridge;

  beforeEach(async () => {
    token = await TokenContract.new();
    bridge = await BridgeContract.new();
  });

  describe("Initial values", () => {
    it("The initial mint count should match", async () => {
      assert.equal(await token.totalSupply(), 0, "There was an initial supply");
    });

    it("The bridge value should be unassigned initially", async () => {
      assert.equal(await token.getBridge(), "0x0000000000000000000000000000000000000000", "The address is not empty");
      assert.notEqual(await token.getBridge(), coinbase, "There is an initial address");
    });
  });

  describe("Set bridge to new address", () => {
    it("The bridge is changed to a new address", async () => {
      await token.setBridge(bridge.address);
      assert.equal(await token.getBridge(), bridge.address, "the address was not changed");
    });

    it("The bridge cannot be changed a second time", async () => {
      await token.setBridge(bridge.address);
      try {
        await token.setBridge(accounts[2]);
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "ERC677: bridge has been previously set", "failed for reason other than 'Previously Set'");
      }
      assert.equal(await token.getBridge(), bridge.address, "the address was changed");
    });
  });

  describe("Mint and burn", () => {
    it("Only bridge owner can mint", async () => {
      await token.setBridge(bridge.address);
      await bridge.setToken(token.address);
      try {
        await bridge.allocateTokens(accounts[3], 10, token.transactionHash, {from: accounts[3]});
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "Ownable: caller is not the owner", "failed because of different error");
      }
    });

    it("Mint to the correct address", async () => {
      await token.setBridge(bridge.address);
      await bridge.setToken(token.address);
      assert.equal(await token.totalSupply(), 0, "There was an initial supply");

      //transactionHash is of testing purposes only
      await bridge.allocateTokens(accounts[4], 10, token.transactionHash);
      assert.equal(await token.balanceOf(accounts[4]), 10, "The account did not receive the correct amount");
      assert.equal(await token.totalSupply(), 10, "The amount minted is not correct");
    });

    it("Burn from the correct address", async () => {
      await token.setBridge(bridge.address);
      await bridge.setToken(token.address);

      await bridge.allocateTokens(accounts[5], 10, token.transactionHash);
      assert(await token.transferAndCall(10, {from: accounts[5]}));

      assert.equal(await token.balanceOf(accounts[5]), 0, "The account did not loose the correct amount");
      assert.equal(await token.totalSupply(), 0, "The amount burned is not correct");
    });
  });
});
