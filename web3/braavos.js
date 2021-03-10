const NetworkDriver = require('./NetworkDriver.js');

const coinbase = process.env.ADDRESS_COINBASE
const privateKey = Buffer.from(process.env.PRIVATE_KEY_COINBASE, 'hex')

const secondary = process.env.ADDRESS_SECONDARY
const privateKeyS = Buffer.from(process.env.PRIVATE_KEY_SECONDARY, 'hex')

contolCenter()
async function contolCenter() {
  // await createTokens()
  // await addTokenOwner()
  // await isOwner()
  // await approveTokens()
  // await mintTokens()
  // await burnTokens()
}

async function createTokens() {
  console.log("Creating Tokens...")
  console.log("eAUD")
  console.log(await NetworkDriver.createTokenWithParams(coinbase, privateKey, (NetworkDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await NetworkDriver.encodeParameters(["Australian Dollar", "eAUD", "6", "0"])).slice(2)))
  console.log("eCAD")
  console.log(await NetworkDriver.createTokenWithParams(coinbase, privateKey, (NetworkDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await NetworkDriver.encodeParameters(["Canadian Dollar", "eCAD", "6", "0"])).slice(2)))
  console.log("eCNY")
  console.log(await NetworkDriver.createTokenWithParams(coinbase, privateKey, (NetworkDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await NetworkDriver.encodeParameters(["Chinese Yuan", "eCNY", "6", "0"])).slice(2)))
  console.log("eEUR")
  console.log(await NetworkDriver.createTokenWithParams(coinbase, privateKey, (NetworkDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await NetworkDriver.encodeParameters(["Euro", "eEUR", "6", "0"])).slice(2)))
  console.log("eGBP")
  console.log(await NetworkDriver.createTokenWithParams(coinbase, privateKey, (NetworkDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await NetworkDriver.encodeParameters(["Pound Sterling", "eGBP", "6", "0"])).slice(2)))
  console.log("eIDR")
  console.log(await NetworkDriver.createTokenWithParams(coinbase, privateKey, (NetworkDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await NetworkDriver.encodeParameters(["Indonesian Rupiah", "eIDR", "6", "0"])).slice(2)))
  console.log("eJPY")
  console.log(await NetworkDriver.createTokenWithParams(coinbase, privateKey, (NetworkDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await NetworkDriver.encodeParameters(["Japanese Yen", "eJPY", "6", "0"])).slice(2)))
  console.log("ePHP")
  console.log(await NetworkDriver.createTokenWithParams(coinbase, privateKey, (NetworkDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await NetworkDriver.encodeParameters(["Philippine Peso", "ePHP", "6", "0"])).slice(2)))
  console.log("eSGD")
  console.log(await NetworkDriver.createTokenWithParams(coinbase, privateKey, (NetworkDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await NetworkDriver.encodeParameters(["Singapore Dollar", "eSGD", "6", "0"])).slice(2)))
  console.log("eUSD")
  console.log(await NetworkDriver.createTokenWithParams(coinbase, privateKey, (NetworkDriver.fileToJSON('build/contracts/StableCoin.json')).bytecode, (await NetworkDriver.encodeParameters(["US Dollar", "eUSD", "6", "0"])).slice(2)))
}

async function addTokenOwner() {
  console.log("Add Owner...")
  console.log(await NetworkDriver.addOwner(coinbase, privateKey, NetworkDriver.eAUD, NetworkDriver.gnosisAddress))
  console.log(await NetworkDriver.addOwner(coinbase, privateKey, NetworkDriver.eCAD, NetworkDriver.gnosisAddress))
  console.log(await NetworkDriver.addOwner(coinbase, privateKey, NetworkDriver.eCNY, NetworkDriver.gnosisAddress))
  console.log(await NetworkDriver.addOwner(coinbase, privateKey, NetworkDriver.eEUR, NetworkDriver.gnosisAddress))
  console.log(await NetworkDriver.addOwner(coinbase, privateKey, NetworkDriver.eGBP, NetworkDriver.gnosisAddress))
  console.log(await NetworkDriver.addOwner(coinbase, privateKey, NetworkDriver.eIDR, NetworkDriver.gnosisAddress))
  console.log(await NetworkDriver.addOwner(coinbase, privateKey, NetworkDriver.eJPY, NetworkDriver.gnosisAddress))
  console.log(await NetworkDriver.addOwner(coinbase, privateKey, NetworkDriver.ePHP, NetworkDriver.gnosisAddress))
  console.log(await NetworkDriver.addOwner(coinbase, privateKey, NetworkDriver.eSGD, NetworkDriver.gnosisAddress))
  console.log(await NetworkDriver.addOwner(coinbase, privateKey, NetworkDriver.eUSD, NetworkDriver.gnosisAddress))
}

async function isOwner() {
  console.log("Checking Owners...")
  console.log("eAUD: ", await NetworkDriver.isOwner(NetworkDriver.eAUD, NetworkDriver.gnosisAddress))
  console.log("eCAD: ", await NetworkDriver.isOwner(NetworkDriver.eCAD, NetworkDriver.gnosisAddress))
  console.log("eCNY: ", await NetworkDriver.isOwner(NetworkDriver.eCNY, NetworkDriver.gnosisAddress))
  console.log("eEUR: ", await NetworkDriver.isOwner(NetworkDriver.eEUR, NetworkDriver.gnosisAddress))
  console.log("eGBP: ", await NetworkDriver.isOwner(NetworkDriver.eGBP, NetworkDriver.gnosisAddress))
  console.log("eIDR: ", await NetworkDriver.isOwner(NetworkDriver.eIDR, NetworkDriver.gnosisAddress))
  console.log("eJPY: ", await NetworkDriver.isOwner(NetworkDriver.eJPY, NetworkDriver.gnosisAddress))
  console.log("ePHP: ", await NetworkDriver.isOwner(NetworkDriver.ePHP, NetworkDriver.gnosisAddress))
  console.log("eSGD: ", await NetworkDriver.isOwner(NetworkDriver.eSGD, NetworkDriver.gnosisAddress))
  console.log("eUSD: ", await NetworkDriver.isOwner(NetworkDriver.eUSD, NetworkDriver.gnosisAddress))
}

async function approveTokens() {
  console.log("Minting Tokens...")
  console.log(await NetworkDriver.approve(coinbase, privateKey, NetworkDriver.eUSD, NetworkDriver.gnosisAddress, 1000))
}

async function mintTokens() {
  console.log("Minting Tokens...")
  console.log(await NetworkDriver.mint(coinbase, privateKey, NetworkDriver.eUSD, 100))
}

async function burnTokens() {
  console.log("Burning Tokens...")
  console.log(await NetworkDriver.burn(coinbase, privateKey, NetworkDriver.eUSD, 100))
}
