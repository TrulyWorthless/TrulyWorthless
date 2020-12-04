const TokenContract = artifacts.require("TrulyWorthless");

contract("TrulyWorthless", accounts => {
  const coinbase = accounts[0];
  var token;

  beforeEach(async () => {
    token = await TokenContract.new()
  });

  describe("Evaluating fields", () => {
    it("The names should match", async () => {
      assert.equal(await token.name(), "TrulyWorthless", "The name is incorrect");
    });

    it("The symbols should match", async () => {
      assert.equal(await token.symbol(), "TWC", "The symbol is incorrect");
    });

    it("The decimal count should match", async () => {
      assert.equal(await token.decimals(), 18, "The decimal count is incorrect");
    });

    it("The initial mint count should match", async () => {
      // assert.equal(await token.totalSupply(), 100000000000000000000000000000, "The decimal count is incorrect");
    });
  });

  describe("Allowance", () => {
    it("correct initial balance", async () => {
      assert.equal(await token.balanceOf(accounts[1]), 0, "There is an initial allowance");
    });

    it("initial allowance should be zero", async () => {
      assert.equal(await token.allowance(coinbase, accounts[1]), 0, "There is an initial allowance");
    });

    it("create an allowance", async () => {
      await token.approve(accounts[2], 10);
      assert.equal(await token.allowance(coinbase, accounts[2]), 10, "the allowance did not change");
    });

    it("increase and decrease allowance", async () => {
      await token.approve(accounts[3], 10);
      await token.allowance(coinbase, accounts[3]);
      await token.increaseAllowance(accounts[3], 1);

      assert.equal(await token.allowance(coinbase, accounts[3]), 11, "the allowance did not increase");
      await token.decreaseAllowance(accounts[3], 1);
      assert.equal(await token.allowance(coinbase, accounts[3]), 10, "the allowance did not decrease");
    });
  });

  describe("Transfers", () => {
    it("transfer from one account to another", async () => {
      assert.equal(await token.balanceOf(accounts[4]), 0, "There is an initial allowance");
      await token.approve(accounts[4], 10);
      assert.equal(await token.allowance(coinbase, accounts[4]), 10, "the allowance did not change");
      await token.transferFrom(coinbase, accounts[4], 10, {from: accounts[4]});

      assert.equal(await token.balanceOf(accounts[4]), 10, "Tokens were not transferred");
      assert.equal(await token.allowance(coinbase, accounts[4]), 0, "the allowance did not update");
    });

    it("transfer to another account", async () => {
      // let initialBalance = await token.balanceOf(coinbase);
      // let balance = await token.balanceOf(accounts[5]);
      assert.equal(await token.balanceOf(accounts[5]), 0, "There is an initial allowance");
      await token.transfer(accounts[5], 10);
      // let newbalance = await token.balanceOf(accounts[5]);
      assert.equal(await token.balanceOf(accounts[5]), 10, "The tokens were not transferred");
      // let adjustedBalance = await token.balanceOf(coinbase);
      // let finalBalance = initialBalance - adjustedBalance;
      // assert.equal(finalBalance , 10, "Difference is balance not correct");
    });
  });
});
