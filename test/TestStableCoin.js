const StableCoin = artifacts.require("StableCoin")
const Web3 = require('web3')
const FileSystem = require('fs')

function fileToJSON(file) {
  let rawdata = FileSystem.readFileSync(file)
  return JSON.parse(rawdata)
}

contract("StableCoin", accounts => {
  const coinbase = accounts[0]
  var token;

  beforeEach(async () => {
    token = await StableCoin.new("US Dollar", "eUSD", "6", "1000000")
  });

  describe("Ownable functions are operating correctly", () => {
    it("The contract creator is the owner", async () => {
      assert(await token.isOwner(coinbase), "The address to deploy contract should be owner")
      assert(!await token.isOwner(accounts[1]), "There should not be other owners initially")
    });

    it("Owners can be added", async () => {
      assert(!await token.isOwner(accounts[1]), "Address has not yet been made an owner")
      await token.addOwner(accounts[1], {from: coinbase})
      assert(await token.isOwner(accounts[1]), "Address should have been made owner")
    });

    it("Owners can be removed", async () => {
      await token.addOwner(accounts[1], {from: coinbase})
      assert(await token.isOwner(accounts[1]), "Address was not added successfully")
      await token.removeOwner(accounts[1], {from: accounts[1]})
      assert(!await token.isOwner(accounts[1]), "Address should have been removed")
    });

    it("OnlyOwners can add or remove owner", async () => {
      try {
        await token.addOwner(accounts[1], {from: accounts[1]})
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "Ownable: caller is not an owner", "Non-owners cannot add owners");
      }
      await token.addOwner(accounts[1], {from: coinbase})

      try {
        await token.removeOwner(accounts[1], {from: accounts[2]})
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "Ownable: caller is not an owner", "Non-owners cannot remove owners");
      }
    });

    it("Adding and removing owners must be done on valid addresses", async () => {
      await token.addOwner(accounts[1], {from: coinbase})
      try {
        await token.addOwner(accounts[1], {from: coinbase})
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "Ownable: address is already owner", "Owners cannont be added twice");
      }

      try {
        await token.removeOwner(accounts[2], {from: coinbase})
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "Ownable: address is not an owner", "Non-owners cannot be removed");
      }
    });

    it("There needs to always be an owner", async () => {
      try {
        await token.removeOwner(coinbase, {from: coinbase})
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "Ownable: no remaining owners", "Only one owner remained");
      }
    });
  });

  describe("Allows minting", () => {
    it("The correct amount should be minted", async () => {
      assert.equal(new Web3.utils.BN(await token.totalSupply()).toString(), "1000000000000", "Wrong initial total supply")
      await token.mint(100, {from: coinbase})
      assert.equal(new Web3.utils.BN(await token.totalSupply()).toString(), "1000000000100", "Wrong total supply")
    });

    it("Mint to another address", async () => {
      assert.equal(new Web3.utils.BN(await token.balanceOf(accounts[1])).toString(), "0", "Wrong initial balance")
      await token.mintTo(accounts[1], 100, {from: coinbase})
      assert.equal(new Web3.utils.BN(await token.balanceOf(accounts[1])).toString(), "100", "Wrong minted balance")
    });

    it("OnlyOwners can mint", async () => {
      assert.equal(new Web3.utils.BN(await token.totalSupply()).toString(), "1000000000000", "Wrong initial balance")
      try {
        await token.mint(100, {from: accounts[1]})
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "Ownable: caller is not an owner", "Non-owners cannot mint tokens");
      }

      try {
        await token.mintTo(accounts[1], 100, {from: accounts[1]})
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "Ownable: caller is not an owner", "Non-owners cannot mint tokens to other addresses");
      }
      assert.equal(new Web3.utils.BN(await token.totalSupply()).toString(), "1000000000000", "Tokens were minted")
    });
  });

  describe("Allows burning", () => {
    it("The correct amount should be burned", async () => {
      assert.equal(new Web3.utils.BN(await token.totalSupply()).toString(), "1000000000000", "Wrong initial total supply")
      await token.burn("1000000000000", {from: coinbase})
      assert.equal(new Web3.utils.BN(await token.totalSupply()).toString(), "0", "Wrong total supply")

      try {
        await token.burn("1000000000000", {from: coinbase})
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "ERC20: burn amount exceeds balance", "Cannot burn more than balance");
      }
    });

    it("Burn from another address", async () => {
      assert.equal(new Web3.utils.BN(await token.balanceOf(accounts[1])).toString(), "0", "Wrong initial balance")
      await token.transfer(accounts[1], 100, {from: coinbase})
      assert.equal(new Web3.utils.BN(await token.balanceOf(accounts[1])).toString(), "100", "Wrong balance")
      await token.approve(coinbase, 50, {from: accounts[1]})

      try {
        await token.burnFrom(accounts[1], 51, {from: coinbase})
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "ERC20: burn amount exceeds allowance", "Cannot burn more than allowance");
      }

      await token.burnFrom(accounts[1], 50, {from: coinbase})
      assert.equal(new Web3.utils.BN(await token.balanceOf(accounts[1])).toString(), "50", "Wrong burned balance")
    });

    it("OnlyOwners can burn", async () => {
      assert.equal(new Web3.utils.BN(await token.totalSupply()).toString(), "1000000000000", "Wrong initial balance")
      await token.transfer(accounts[1], 100, {from: coinbase})
      try {
        await token.burn(100, {from: accounts[1]})
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "Ownable: caller is not an owner", "Non-owners cannot burn tokens");
      }

      try {
        await token.burnFrom(coinbase, 100, {from: accounts[1]})
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "Ownable: caller is not an owner", "Non-owners cannot burn tokens belonging to others");
      }

      assert.equal(new Web3.utils.BN(await token.totalSupply()).toString(), "1000000000000", "Tokens were burned")
    });
  });
});
