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
      assert.equal(await bridge.owner(), coinbase, "The owner is not the deployer");
    });

    it("The token value should be unassigned initially", async () => {
      assert.equal(await bridge.getToken(), "0x0000000000000000000000000000000000000000", "The address is not empty");
      assert.notEqual(await bridge.getToken(), coinbase, "There is an initial address");
    });
  });

  describe("Set token to new address", () => {
    it("The token is changed to a new address", async () => {
      await bridge.setToken(token.address);
      assert.equal(await bridge.getToken(), token.address, "the address was not changed");
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
      assert.equal(await token.balanceOf(bridge.address), 0, "there should not be an initial balance");
      await token.approve(bridge.address, 10);
      assert(await bridge.onTokenTransfer(10), "fail on token transer");
      assert.equal(await token.balanceOf(bridge.address), 10, "tokens were not transferred");
    });

    it("receiving tokens", async () => {
      await bridge.setToken(token.address);
      await token.approve(bridge.address, 10);
      assert(await bridge.onTokenTransfer(10), "fail on token transfer");

      //transactionHash is of testing purposes only
      assert(await bridge.returnTokens(accounts[3], 10, token.transactionHash), "fail on return tokens");
      assert.equal(await token.balanceOf(bridge.address), 0, "tokens were not transferred");
    });

    it("repeat transactions", async () => {
      await bridge.setToken(token.address);
      await token.approve(bridge.address, 20);
      assert(await bridge.onTokenTransfer(20), "fail on token transer");

      //transactionHash is of testing purposes only
      assert(await bridge.returnTokens(accounts[4], 10, token.transactionHash), "fail on return tokens");

      try {
        await bridge.returnTokens(accounts[4], 10, token.transactionHash);
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "MainnetBridgeContract: transaction has already been recorded", "failed for reason other than 'transaction has already been recorded'");
      }
    });
  });
});
