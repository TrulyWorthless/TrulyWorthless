const TokenContract = artifacts.require("WorthlessWrapper");

contract("WorthlessWrapper", accounts => {
  const coinbase = accounts[0];
  var token;

  beforeEach(async () => {
    token = await TokenContract.new();
  });

  describe("Initial values", () => {
    it("The initial mint count should match", async () => {
      assert.equal(await token.totalSupply(), 0, "There was an initial supply");
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
