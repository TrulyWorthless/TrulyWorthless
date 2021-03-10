const BraavosDriver = require('./BraavosDriver.js');

const coinbase = process.env.ADDRESS_COINBASE
const privateKey = Buffer.from(process.env.PRIVATE_KEY_COINBASE, 'hex')

const secondary = process.env.ADDRESS_SECONDARY
const privateKeyS = Buffer.from(process.env.PRIVATE_KEY_SECONDARY, 'hex')

contolCenter()
async function contolCenter() {
  await createTokens()
  // await addTokenOwner()
  // await isOwner()
  // await approveTokens()
  // await mintTokens()
  // await burnTokens()
}

async function createTokens() {
  console.log("Creating Tokens...")
  console.log("eAUD")
  console.log(await BraavosDriver.createStableCoin(coinbase, privateKey, (BraavosDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await BraavosDriver.encodeParameters(["Australian Dollar", "eAUD", "2", "100000"])).slice(2)))
  // console.log("eCAD")
  // console.log(await BraavosDriver.createStableCoin(coinbase, privateKey, (BraavosDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await BraavosDriver.encodeParameters(["Canadian Dollar", "eCAD", "2", "100000"])).slice(2)))
  // console.log("eCNY")
  // console.log(await BraavosDriver.createStableCoin(coinbase, privateKey, (BraavosDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await BraavosDriver.encodeParameters(["Chinese Yuan", "eCNY", "2", "100000"])).slice(2)))
  // console.log("eEUR")
  // console.log(await BraavosDriver.createStableCoin(coinbase, privateKey, (BraavosDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await BraavosDriver.encodeParameters(["Euro", "eEUR", "2", "100000"])).slice(2)))
  // console.log("eGBP")
  // console.log(await BraavosDriver.createStableCoin(coinbase, privateKey, (BraavosDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await BraavosDriver.encodeParameters(["Pound Sterling", "eGBP", "2", "100000"])).slice(2)))
  // console.log("eIDR")
  // console.log(await BraavosDriver.createStableCoin(coinbase, privateKey, (BraavosDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await BraavosDriver.encodeParameters(["Indonesian Rupiah", "eIDR", "2", "100000"])).slice(2)))
  // console.log("eJPY")
  // console.log(await BraavosDriver.createStableCoin(coinbase, privateKey, (BraavosDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await BraavosDriver.encodeParameters(["Japanese Yen", "eJPY", "0", "100000"])).slice(2)))
  // console.log("ePHP")
  // console.log(await BraavosDriver.createStableCoin(coinbase, privateKey, (BraavosDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await BraavosDriver.encodeParameters(["Philippine Peso", "ePHP", "2", "100000"])).slice(2)))
  // console.log("eSGD")
  // console.log(await BraavosDriver.createStableCoin(coinbase, privateKey, (BraavosDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await BraavosDriver.encodeParameters(["Singapore Dollar", "eSGD", "2", "100000"])).slice(2)))
  // console.log("eUSD")
  // console.log(await BraavosDriver.createStableCoin(coinbase, privateKey, (BraavosDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await BraavosDriver.encodeParameters(["US Dollar", "eUSD", "2", "3000000"])).slice(2)))
}

async function addTokenOwner() {
  console.log("Add Owner...")
  console.log(await BraavosDriver.addOwner(coinbase, privateKey, BraavosDriver.eAUD, BraavosDriver.gnosisAddress))
  console.log(await BraavosDriver.addOwner(coinbase, privateKey, BraavosDriver.eCAD, BraavosDriver.gnosisAddress))
  console.log(await BraavosDriver.addOwner(coinbase, privateKey, BraavosDriver.eCNY, BraavosDriver.gnosisAddress))
  console.log(await BraavosDriver.addOwner(coinbase, privateKey, BraavosDriver.eEUR, BraavosDriver.gnosisAddress))
  console.log(await BraavosDriver.addOwner(coinbase, privateKey, BraavosDriver.eGBP, BraavosDriver.gnosisAddress))
  console.log(await BraavosDriver.addOwner(coinbase, privateKey, BraavosDriver.eIDR, BraavosDriver.gnosisAddress))
  console.log(await BraavosDriver.addOwner(coinbase, privateKey, BraavosDriver.eJPY, BraavosDriver.gnosisAddress))
  console.log(await BraavosDriver.addOwner(coinbase, privateKey, BraavosDriver.ePHP, BraavosDriver.gnosisAddress))
  console.log(await BraavosDriver.addOwner(coinbase, privateKey, BraavosDriver.eSGD, BraavosDriver.gnosisAddress))
  console.log(await BraavosDriver.addOwner(coinbase, privateKey, BraavosDriver.eUSD, BraavosDriver.gnosisAddress))
}

async function isOwner() {
  console.log("Checking Owners...")
  console.log("eAUD: ", await BraavosDriver.isOwner(BraavosDriver.eAUD, BraavosDriver.gnosisAddress))
  console.log("eCAD: ", await BraavosDriver.isOwner(BraavosDriver.eCAD, BraavosDriver.gnosisAddress))
  console.log("eCNY: ", await BraavosDriver.isOwner(BraavosDriver.eCNY, BraavosDriver.gnosisAddress))
  console.log("eEUR: ", await BraavosDriver.isOwner(BraavosDriver.eEUR, BraavosDriver.gnosisAddress))
  console.log("eGBP: ", await BraavosDriver.isOwner(BraavosDriver.eGBP, BraavosDriver.gnosisAddress))
  console.log("eIDR: ", await BraavosDriver.isOwner(BraavosDriver.eIDR, BraavosDriver.gnosisAddress))
  console.log("eJPY: ", await BraavosDriver.isOwner(BraavosDriver.eJPY, BraavosDriver.gnosisAddress))
  console.log("ePHP: ", await BraavosDriver.isOwner(BraavosDriver.ePHP, BraavosDriver.gnosisAddress))
  console.log("eSGD: ", await BraavosDriver.isOwner(BraavosDriver.eSGD, BraavosDriver.gnosisAddress))
  console.log("eUSD: ", await BraavosDriver.isOwner(BraavosDriver.eUSD, BraavosDriver.gnosisAddress))
}

async function approveTokens() {
  console.log("Minting Tokens...")
  console.log(await BraavosDriver.approve(coinbase, privateKey, BraavosDriver.eUSD, BraavosDriver.gnosisAddress, 1000))
}

async function mintTokens() {
  console.log("Minting Tokens...")
  console.log(await BraavosDriver.mint(coinbase, privateKey, BraavosDriver.eUSD, 100))
}

async function burnTokens() {
  console.log("Burning Tokens...")
  console.log(await BraavosDriver.burn(coinbase, privateKey, BraavosDriver.eUSD, 100))
}
