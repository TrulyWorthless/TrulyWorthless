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
      let supply = await token.totalSupply();
      assert.equal(supply, 0, "There was an initial supply");
    });

    it("The bridge value should be unassigned initially", async () => {
      let bridgeAddress = await token.getBridge();
      assert.equal(bridgeAddress, "0x0000000000000000000000000000000000000000", "The address is not empty");
      assert.notEqual(bridgeAddress, coinbase, "There is an initial address");
    });
  });

  describe("Set bridge to new address", () => {
    it("The bridge is changed to a new address", async () => {
      await token.setBridge(bridge.address);
      let bridgeAddress = await token.getBridge();
      assert.equal(bridgeAddress, bridge.address, "the address was not changed");
    });

    it("The bridge cannot be changed a second time", async () => {
      await token.setBridge(bridge.address);
      try {
        await token.setBridge(accounts[2]);
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "ERC677: bridge has been previously set", "failed for reason other than 'Previously Set'");
      }

      let bridgeAddress = await token.getBridge();
      assert.equal(bridgeAddress, bridge.address, "the address was changed");
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

      let supply = await token.totalSupply();
      assert.equal(supply, 0, "There was an initial supply");

      //transactionHash is of testing purposes only
      await bridge.allocateTokens(accounts[4], 10, token.transactionHash);
      let balance = await token.balanceOf(accounts[4]);
      assert.equal(balance, 10, "The account did not receive the correct amount");
      let newSupply = await token.totalSupply();
      assert.equal(newSupply, 10, "The amount minted is not correct");
    });

    it("Burn from the correct address", async () => {
      await token.setBridge(bridge.address);
      await bridge.setToken(token.address);

      await bridge.allocateTokens(accounts[5], 10, token.transactionHash);
      await token.transferAndCall(10, {from: accounts[5]});

      let balance = await token.balanceOf(accounts[5]);
      assert.equal(balance, 0, "The account did not loose the correct amount");
      let newSupply = await token.totalSupply();
      assert.equal(newSupply, 0, "The amount burned is not correct");
    });
  });
});
