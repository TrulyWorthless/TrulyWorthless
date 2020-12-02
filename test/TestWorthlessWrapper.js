const TokenContract = artifacts.require("WorthlessWrapper");

contract("WorthlessWrapper", accounts => {
  const coinbase = accounts[0];
  const bridge = accounts[1];
  var token;

  beforeEach(async () => {
    token = await TokenContract.new()
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

  describe("Mint and burn", () => {
    it("The bridge value should be unassigned initially", async () => {
      let bridge = await token.getBridge();
      assert.equal(bridge, "0x0000000000000000000000000000000000000000", "The address is not empty");
      assert.notEqual(bridge, coinbase, "There is an initial address");
    });

    it("The bridge value should be unassigned initially", async () => {
      let bridge = await token.getBridge();
      assert.notEqual(bridge, coinbase, "There is an initial address");
    });
  });
});
