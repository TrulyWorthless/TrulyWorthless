const TokenContract = artifacts.require("TrulyWorthless");

contract("TrulyWorthless", accounts => {
  const coinbase = accounts[0];
  var token;

  beforeEach(async () => {
    token = await TokenContract.new()
  });

  describe("Evaluating fields", () => {
    it("The names should match", async () => {
      let tokenName = await token.name();
      assert.equal(tokenName, "TrulyWorthless", "The name is incorrect");
    });

    it("The symbols should match", async () => {
      let tokenSymbol = await token.symbol();
      assert.equal(tokenSymbol, "TWC", "The symbol is incorrect");
    });

    it("The decimal count should match", async () => {
      let decimals = await token.decimals();
      assert.equal(decimals, 18, "The decimal count is incorrect");
    });

    it("The initial mint count should match", async () => {
      let supply = await token.totalSupply();
      // assert.equal(supply.toNumber(), 100000000000000000000000000000, "The decimal count is incorrect");
    });
  });

  describe("Allowance and transfer", () => {
    it("correct initial balance", async () => {
      let balance = await token.balanceOf(accounts[1]);
      assert.equal(balance, 0, "There is an initial allowance");
    });

    it("initial allowance should be zero", async () => {
      let allowance = await token.allowance(coinbase, accounts[1]);
      assert.equal(allowance, 0, "There is an initial allowance");
    });

    it("create an allowance", async () => {
      let approval = await token.approve(accounts[2], 10, {from: coinbase});
      let allowance = await token.allowance(coinbase, accounts[2]);
      assert.equal(allowance, 10, "the allowance did not change");
    });

    it("increase and decrease allowance", async () => {
      await token.approve(accounts[3], 10, {from: coinbase});
      await token.allowance(coinbase, accounts[3]);
      await token.increaseAllowance(accounts[3], 1, {from: coinbase});

      let increasedAllowance = await token.allowance(coinbase, accounts[3]);
      assert.equal(increasedAllowance, 11, "the allowance did not increase");
      await token.decreaseAllowance(accounts[3], 1, {from: coinbase});
      let decreasedAllowance = await token.allowance(coinbase, accounts[3]);
      assert.equal(decreasedAllowance, 10, "the allowance did not decrease");
    });

    it("transfer from one account to another", async () => {
      let balance = await token.balanceOf(accounts[3]);
      assert.equal(balance, 0, "There is an initial allowance");
      await token.approve(accounts[3], 10, {from: coinbase});
      let allowance = await token.allowance(coinbase, accounts[3]);
      assert.equal(allowance, 10, "the allowance did not change");
      await token.transferFrom(coinbase, accounts[3], 10, {from: accounts[3]});
      
      let newbalance = await token.balanceOf(accounts[3]);
      assert.equal(newbalance, 10, "Tokens were not transferred");
      let newAllowance = await token.allowance(coinbase, accounts[3]);
      assert.equal(newAllowance, 0, "the allowance did not update");
    });

    it("transfer to another account", async () => {
      // let initialBalance = await token.balanceOf(coinbase);
      let balance = await token.balanceOf(accounts[4]);
      assert.equal(balance, 0, "There is an initial allowance");
      await token.transfer(accounts[4], 10, {from: coinbase});
      let newbalance = await token.balanceOf(accounts[4]);
      assert.equal(newbalance, 10, "The tokens were not transferred");
      // let adjustedBalance = await token.balanceOf(coinbase);
      // let finalBalance = initialBalance - adjustedBalance;
      // assert.equal(finalBalance , 10, "Difference is balance not correct");
    });
  });
});
