const BridgeContract = artifacts.require("RivendellNetworkBridgeContract");
const TokenContract = artifacts.require("WorthlessWrapper");

contract("RivendellNetworkBridgeContract", accounts => {
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

  describe("transfer tokens to and from accounts", () => {
    it("tokens were distributed", async () => {
      await token.setBridge(bridge.address);
      await bridge.setToken(token.address);
      assert.equal(await token.balanceOf(accounts[3]), 0, "not the correct balance");

      //transactionHash is of testing purposes only
      assert(await bridge.allocateTokens(accounts[3], 10, token.transactionHash), "failed to allocate tokens");
      assert.equal(await token.balanceOf(accounts[3]), 10, "not the correct balance");
    });

    it("tokens were returned", async () => {
      await token.setBridge(bridge.address);
      await bridge.setToken(token.address);

      //transactionHash is of testing purposes only
      assert(await bridge.allocateTokens(accounts[4], 10, token.transactionHash), "failed to allocate tokens");
      assert.equal(await token.balanceOf(accounts[4]), 10, "not the correct balance");
      assert(await token.transferAndCall(10, {from: accounts[4]}), "failed to transfer tokens");
    });

    it("calls only from token to bridge", async () => {
      await token.setBridge(bridge.address);
      await bridge.setToken(token.address);

      //transactionHash is of testing purposes only
      assert(await bridge.allocateTokens(accounts[4], 10, token.transactionHash), "failed to allocate tokens");
      try {
        await bridge.onTokenTransfer(accounts[4], 10);
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "RivendellNetworkBridgeContract: sender needs to be ERC677 token", "failed for reason other than 'sender needs to be ERC677 token'");
      }
    });
  });

  describe("Get state values of bridge", () => {
    it("the nonce count is correct", async () => {
      await token.setBridge(bridge.address);
      await bridge.setToken(token.address);

      assert.equal(await bridge.getCurrentNonce(), 0, "the nonce has already been modified");
      assert(await bridge.allocateTokens(accounts[5], 10, token.transactionHash), "failed to allocate tokens");
      assert(await token.transferAndCall(10, {from: accounts[5]}), "failed to transfer tokens");
      assert.equal(await bridge.getCurrentNonce(), 1, "the nonce has already been modified");
    });

    it("the transaction values", async () => {
      await token.setBridge(bridge.address);
      await bridge.setToken(token.address);

      assert(await bridge.allocateTokens(accounts[6], 10, token.transactionHash), "failed to allocate tokens");
      assert(await token.transferAndCall(10, {from: accounts[6]}), "failed to transfer tokens");
      let transaction = await bridge.getTransaction(await bridge.getCurrentNonce());
      assert.equal(transaction[0], accounts[6], "not the correct address");
      assert.equal(transaction[1], 10, "not the correct amount");
    });
  });
});
