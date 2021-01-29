const FactoryContract = artifacts.require("WorthlessFactory")
const Web3 = require('web3')
const FileSystem = require('fs')

function fileToJSON(file) {
  let rawdata = FileSystem.readFileSync(file)
  return JSON.parse(rawdata)
}

contract("WorthlessFactory", accounts => {
  const coinbase = accounts[1]
  var factory

  beforeEach(async () => {
    factory = await FactoryContract.new()
  });

  describe("Deploy Tokens", () => {
    it("New token should be created with token transfer", async () => {
      let receipt = await factory.onTokenTransfer(coinbase, 25, "0x1234", {from: coinbase})
      let tokenAddress = (await web3.eth.getTransactionReceipt(receipt.tx)).logs[0].address
      assert(await factory.isToken(tokenAddress), "Token not created")
      let tokenABI = fileToJSON('build/contracts/ERC20.json').abi
      const tokenInstance = new web3.eth.Contract(tokenABI, tokenAddress)
      assert(await tokenInstance.methods.symbol().call((err, result) => { return result }), "WFC", "Token values do not match")
    });

    it("New token should be created with default decimals", async () => {
      let receipt = await factory.deploy("TheGoodLife", "GLC", 100, {from: coinbase})
      let tokenAddress = (await web3.eth.getTransactionReceipt(receipt.tx)).logs[0].address
      assert(await factory.isToken(tokenAddress), "Token not created")
    });

    it("New token should be created with varible decimals", async () => {
      let receipt = await factory.deployWithDecimals("TheGoodLife", "GLC", 2, 100, {from: coinbase})
      let tokenAddress = (await web3.eth.getTransactionReceipt(receipt.tx)).logs[0].address
      let tokenABI = fileToJSON('build/contracts/ERC20.json').abi
      const tokenInstance = new web3.eth.Contract(tokenABI, tokenAddress)
      assert(await tokenInstance.methods.decimals().call((err, result) => { return result }), 2, "Token values do not match")
    });

    it("Factory should correctly identify tokens", async () => {
      assert(!(await factory.isToken(accounts[0])), "Token should not have been verified")
      let receipt = await factory.deploy("TheGoodLife", "GLC", 100, {from: coinbase})
      let tokenAddress = (await web3.eth.getTransactionReceipt(receipt.tx)).logs[0].address
      let tokenABI = fileToJSON('build/contracts/ERC20.json').abi
      const tokenInstance = new web3.eth.Contract(tokenABI, tokenAddress)
      assert(await tokenInstance.methods.name().call((err, result) => { return result }), "TheGoodLife", "Token values do not match")
    });
  });
});
