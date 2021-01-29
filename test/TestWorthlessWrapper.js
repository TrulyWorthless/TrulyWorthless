const TokenContract = artifacts.require("WorthlessWrapper")

contract("WorthlessWrapper", accounts => {
  const coinbase = accounts[0]
  var token;

  beforeEach(async () => {
    token = await TokenContract.new()
  });

  describe("Initial values", () => {
    it("The initial mint count should match", async () => {
      assert.equal(await token.totalSupply(), 0, "There was an initial supply")
    });
  });

  describe("Mint and burn", () => {
    it("Mints and burns sender wrapped ether", async () => {
      assert.equal(await token.totalSupply(), 0, "There was an initial supply")
      assert.equal(await token.balanceOf(coinbase), 0, "There was an initial balance")
      await token.deposit({from: coinbase, value: 1})
      assert.equal(await token.totalSupply(), 1, "An incorrect amount was minted")
      assert.equal(await token.balanceOf(coinbase), 1, "The minter did not receive the correct amount")
      await token.withdraw(1, {from: coinbase})
    });

    it("Mints and burns sender wrapped ether", async () => {
      assert.equal(await token.totalSupply(), 0, "There is an incorrect amount of the wrapped ether")
      assert.equal(await token.balanceOf(coinbase), 0, "There was an initial balance")
      await token.deposit({from: coinbase, value: 1})
      assert.equal(await token.totalSupply(), 1, "An incorrect amount was minted")
      assert.equal(await token.balanceOf(coinbase), 1, "The minter did not receive the correct amount")
      await token.withdraw(1, {from: coinbase})
      assert.equal(await token.totalSupply(), 0, "An incorrect amount was burned")
      assert.equal(await token.balanceOf(coinbase), 0, "The burner did not receive the correct amount")
    });
  });
});
