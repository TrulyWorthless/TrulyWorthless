const TokenContract = artifacts.require("WorthlessWrapper");
const BridgeContract = artifacts.require("RivendellNetworkBridgeContract");

contract("WorthlessWrapper", accounts => {
  const coinbase = accounts[0];
  var token;
  var bridge;

  beforeEach(async () => {
    token = await TokenContract.new();
    // bridge = await BridgeContract.new();
    bridge = accounts[1];
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

    it("The bridge value should be unassigned initially", async () => {
      let bridgeAddress = await token.getBridge();
      assert.notEqual(bridgeAddress, coinbase, "There is an initial address");
    });
  });

  describe("Set bridge to new address", () => {
    it("The bridge is changed to a new address", async () => {
      await token.setBridge(bridge);
      let bridgeAddress = await token.getBridge();
      assert.equal(bridgeAddress, bridge, "the address was not changed");
    });

    it("The bridge cannot be changed a second time", async () => {
      await token.setBridge(bridge);
      try {
        await token.setBridge(accounts[2]);
      } catch (error) {
        assert.equal(error.reason, "ERC677: bridge has been previously set", "failed for reason other than 'Previously Set'");
      }

      let bridgeAddress = await token.getBridge();
      assert.equal(bridgeAddress, bridge, "the address was changed");
    });
  });

  describe("Mint and burn", () => {//todo
    it("Mint to the correct address", async () => {
      await token.setBridge(bridge);
      let supply = await token.totalSupply();
      assert.equal(supply, 0, "There was an initial supply");
      try {
        await token.mintAndCall(accounts[2], 10, {from: accounts[2]});
      } catch (error) {
        assert.equal(error.reason, "ERC677: minter needs to be bridge contract", "failed for reason other than 'Wrong Address'");
      }

      await token.mintAndCall(accounts[2], 10, {from: bridge});
      let balance = await token.balanceOf(accounts[2]);
      assert.equal(balance, 0, "The account did not receive the correct amount");
      let newSupply = await token.totalSupply();
      assert.equal(newSupply, 10, "The amount minted is not correct");
    });

    it("Burn from the correct address", async () => {
      await token.setBridge(bridge);
    });
  });
});
