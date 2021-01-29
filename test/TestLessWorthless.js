const TokenContract = artifacts.require("LessWorthless")
const FactoryContract = artifacts.require("WorthlessFactory")

contract("LessWorthless", accounts => {
  const coinbase = accounts[1]
  var factory;
  var token;

  beforeEach(async () => {
    factory = await FactoryContract.new()
    token = await TokenContract.new({from: coinbase})
  });

  describe("Can trigger additional contract with transfer", () => {
    it("New token should be created", async () => {
      // assert.equal(await token.balanceOf(coinbase), 1000000, "Wrong initial balance")
      // let see = await token.transferAndCall(coinbase, 100, "0x1234")
      // console.log(see)
    });
  });
});
