const BridgeContract = artifacts.require("MainnetBridgeContract");
const TokenContract = artifacts.require("TrulyWorthless");

contract("MainnetBridgeContract", accounts => {
  const coinbase = accounts[0];
  var bridge;
  var token;

  beforeEach(async () => {
    bridge = await BridgeContract.new();
    token = await TokenContract.new();
  });

  describe("Initial values", () => {
    it("The owner should be the account that deployed the contract", async () => {
      let owner = await bridge.owner();
      assert.equal(owner, coinbase, "The owner is not the deployer");
    });

    it("The token value should be unassigned initially", async () => {
      let tokenAddress = await bridge.getToken();
      assert.equal(tokenAddress, "0x0000000000000000000000000000000000000000", "The address is not empty");
      assert.notEqual(tokenAddress, coinbase, "There is an initial address");
    });
  });

  describe("Set token to new address", () => {
    it("The token is changed to a new address", async () => {
      await bridge.setToken(token.address);
      let tokenAddress = await bridge.getToken();
      assert.equal(tokenAddress, token.address, "the address was not changed");
    });

    it("The token cannot be changed by a non-owner", async () => {
      try {
        await bridge.setToken(token.address, {from: accounts[2]});
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "Ownable: caller is not the owner", "failed for reason other than 'Owner is not the caller'");
      }
    });
  });

  describe("Transfer tokens", () => {
    it("sending tokens to recipient", async () => {
      await bridge.setToken(token.address);
      let initialBalance = await token.balanceOf(bridge.address);
      assert.equal(initialBalance, 0, "there should not be an initial balance");
      await token.approve(bridge.address, 10);
      await bridge.onTokenTransfer(10);
      let finalBalance = await token.balanceOf(bridge.address);
      assert.equal(finalBalance, 10, "tokens were not transferred");
    });

    it("receiving tokens", async () => {
      await bridge.setToken(token.address);
      await token.approve(bridge.address, 10);
      await bridge.onTokenTransfer(10);

      //transactionHash is of testing purposes only
      await bridge.returnTokens(accounts[2], 10, token.transactionHash);

      let balance = await token.balanceOf(bridge.address);
      assert.equal(balance, 0, "tokens were not transferred");
    });

    it("repeat transactions", async () => {
      await bridge.setToken(token.address);
      await token.approve(bridge.address, 20);
      await bridge.onTokenTransfer(20);

      //transactionHash is of testing purposes only
      await bridge.returnTokens(accounts[2], 10, token.transactionHash);

      try {
        await bridge.returnTokens(accounts[2], 10, token.transactionHash);
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "MainnetBridgeContract: transaction has already been recorded", "failed for reason other than 'transaction has already been recorded'");
      }
    });
  });
});
