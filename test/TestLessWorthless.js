const TokenContract = artifacts.require("LessWorthless")
const FactoryContract = artifacts.require("WorthlessFactory")
const Web3 = require('web3')
const FileSystem = require('fs')

function fileToJSON(file) {
  let rawdata = FileSystem.readFileSync(file)
  return JSON.parse(rawdata)
}

contract("LessWorthless", accounts => {
  const coinbase = accounts[1]
  var factory;
  var token;

  beforeEach(async () => {
    factory = await FactoryContract.new()
    token = await TokenContract.new({from: coinbase})
  });

  describe("Can trigger additional contract with transfer", () => {
    it("The tokens should be paid out appropriately", async () => {
      assert.equal(await token.balanceOf(coinbase), 1000000, "Wrong initial balance")
      let receipt = await token.transferAndCall(factory.contract._address, 100, "0x1234", {from: coinbase})
      assert.equal(await token.balanceOf(coinbase), 999900, "Wrong balance")
    });

    it("New token should be created", async () => {
      let receipt = await token.transferAndCall(factory.contract._address, 100, "0x1234", {from: coinbase})
      let tokenAddress = (await web3.eth.getTransactionReceipt(receipt.tx)).logs[1].address
      assert(await factory.isToken(tokenAddress), "Token not created")
    });

    it("New token should have correct values", async () => {
      let receipt = await token.transferAndCall(factory.contract._address, 100, "0x1234", {from: coinbase})
      let tokenAddress = (await web3.eth.getTransactionReceipt(receipt.tx)).logs[1].address
      let tokenABI = fileToJSON('build/contracts/ERC20.json').abi
      const tokenInstance = new web3.eth.Contract(tokenABI, tokenAddress)
      assert.equal(await tokenInstance.methods.symbol().call((err, result) => { return result }), "WFC", "Token symbols do not match")
      assert.equal(await tokenInstance.methods.balanceOf(coinbase).call((err, result) => { return result }), 100000000000000000000, "Token amount do not match")
      assert.equal(await tokenInstance.methods.totalSupply().call((err, result) => { return result }), 100000000000000000000, "Token supply do not match")
    });
  });
});
