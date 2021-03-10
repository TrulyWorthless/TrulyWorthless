const NetworkDriver = require('./NetworkDriver.js');

const coinbase = process.env.ADDRESS_COINBASE
const privateKey = Buffer.from(process.env.PRIVATE_KEY_COINBASE, 'hex')

const secondary = process.env.ADDRESS_SECONDARY
const privateKeyS = Buffer.from(process.env.PRIVATE_KEY_SECONDARY, 'hex')

const trulyWorthless = (NetworkDriver.fileToJSON('build/contracts/TrulyWorthless.json')).bytecode
const nonFungibleToken = (NetworkDriver.fileToJSON('build/contracts/NFT.json')).bytecode

contolCenter()
async function contolCenter() {
  // await createTokens()
}

async function createTokens() {
  console.log("Creating Tokens...")
  console.log(await NetworkDriver.createToken(coinbase, privateKey, trulyWorthless))
  console.log(await NetworkDriver.createToken(coinbase, privateKey, nonFungibleToken))
}
