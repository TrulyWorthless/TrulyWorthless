/********* requirements *********/
const Web3 = require('web3')
const Transaction = require("ethereumjs-tx").Transaction
const FileSystem = require('fs')

/********* web3 *********/
const rinkeby = 'https://rinkeby.infura.io/v3/' + process.env.INFURA_API_KEY
const web3 = new Web3(rinkeby)

/********* token values *********/
const TOKEN_ABI = fileToJSON('build/contracts/StableCoin.json').abi

/********* addresses *********/
//safe
const GNOSIS_SAFE_ADDRESS = "0xbc2c33441d087Ed4521e27866710b69c12ab4ee7"
//tokens
const EAUD_ADDRESS = fileToJSON('ethereum/stable_coin_addresses_rinkeby.json').eAUD
const ECAD_ADDRESS = fileToJSON('ethereum/stable_coin_addresses_rinkeby.json').eCAD
const ECNY_ADDRESS = fileToJSON('ethereum/stable_coin_addresses_rinkeby.json').eCNY
const EEUR_ADDRESS = fileToJSON('ethereum/stable_coin_addresses_rinkeby.json').eEUR
const EGBP_ADDRESS = fileToJSON('ethereum/stable_coin_addresses_rinkeby.json').eGBP
const EIDR_ADDRESS = fileToJSON('ethereum/stable_coin_addresses_rinkeby.json').eIDR
const EJPY_ADDRESS = fileToJSON('ethereum/stable_coin_addresses_rinkeby.json').eJPY
const EPHP_ADDRESS = fileToJSON('ethereum/stable_coin_addresses_rinkeby.json').ePHP
const ESGD_ADDRESS = fileToJSON('ethereum/stable_coin_addresses_rinkeby.json').eSGD
const EUSD_ADDRESS = fileToJSON('ethereum/stable_coin_addresses_rinkeby.json').eUSD

/********* helper functions *********/
function fileToJSON(file) {
  let rawdata = FileSystem.readFileSync(file);
  return JSON.parse(rawdata);
}

async function encodeParameters(parameter) {
  return web3.eth.abi.encodeParameters(['string', 'string', 'uint8', 'uint256'], parameter)
}

/********* token functions *********/
//create token
async function createToken(coinbase, privateKey, data) {
  let transactionArgs = await getTransactionArgs(coinbase)

  const transactionObject = {
    nonce: transactionArgs[0],
    gasLimit: transactionArgs[1],
    gasPrice: transactionArgs[2],
    data: data
  }

  return await submitTransactionWithTokenAddressReturn(privateKey, transactionObject)
}

//create token with parameters
async function createTokenWithParams(coinbase, privateKey, contractBytecode, encodedParameters) {
  let transactionArgs = await getTransactionArgs(coinbase)
  const data = contractBytecode + encodedParameters;

  const transactionObject = {
    nonce: transactionArgs[0],
    gasLimit: transactionArgs[1],
    gasPrice: transactionArgs[2],
    data: data
  }

  return await submitTransactionWithTokenAddressReturn(privateKey, transactionObject)
}

//transfer
async function transfer(coinbase, privateKey, tokenAddress, recipient, amount) {
  const token = new web3.eth.Contract(TOKEN_ABI, tokenAddress)
  let transactionArgs = await getTransactionArgs(coinbase)

  const transactionObject = {
    nonce: transactionArgs[0],
    gasLimit: transactionArgs[1],
    gasPrice: transactionArgs[2],
    to: tokenAddress,
    data: token.methods.transfer(recipient, amount).encodeABI()
  }

  return await submitTransaction(privateKey, transactionObject)
}

//create allowances
async function approve(coinbase, privateKey, tokenAddress, spender, amount) {
  const token = new web3.eth.Contract(TOKEN_ABI, tokenAddress)
  let transactionArgs = await getTransactionArgs(coinbase)

  const transactionObject = {
    nonce: transactionArgs[0],
    gasLimit: transactionArgs[1],
    gasPrice: transactionArgs[2],
    to: tokenAddress,
    data: token.methods.approve(spender, amount).encodeABI()
  }

  return await submitTransaction(privateKey, transactionObject)
}

//add owner
async function addOwner(coinbase, privateKey, tokenAddress, newOwner) {
  const token = new web3.eth.Contract(TOKEN_ABI, tokenAddress)
  let transactionArgs = await getTransactionArgs(coinbase)

  const transactionObject = {
    nonce: transactionArgs[0],
    gasLimit: transactionArgs[1],
    gasPrice: transactionArgs[2],
    to: tokenAddress,
    data: token.methods.addOwner(newOwner).encodeABI()
  }

  return await submitTransaction(privateKey, transactionObject)
}

//mint
async function mint(coinbase, privateKey, tokenAddress, amount) {
  const token = new web3.eth.Contract(TOKEN_ABI, tokenAddress)
  let transactionArgs = await getTransactionArgs(coinbase)

  const transactionObject = {
    nonce: transactionArgs[0],
    gasLimit: transactionArgs[1],
    gasPrice: transactionArgs[2],
    to: tokenAddress,
    data: token.methods.mint(amount).encodeABI()
  }

  return await submitTransaction(privateKey, transactionObject)
}

//burn
async function burn(coinbase, privateKey, tokenAddress, amount) {
  const token = new web3.eth.Contract(TOKEN_ABI, tokenAddress)
  let transactionArgs = await getTransactionArgs(coinbase)

  const transactionObject = {
    nonce: transactionArgs[0],
    gasLimit: transactionArgs[1],
    gasPrice: transactionArgs[2],
    to: tokenAddress,
    data: token.methods.burn(amount).encodeABI()
  }

  return await submitTransaction(privateKey, transactionObject)
}

/********* view functions *********/
async function isOwner(tokenAddress, owner) {
  const token = new web3.eth.Contract(TOKEN_ABI, tokenAddress)
  return await token.methods.isOwner(owner).call((err, result) => { return result })
}

/********* private functions *********/
async function getTransactionArgs(coinbase) {
  let transactionCount = await web3.eth.getTransactionCount(coinbase)
  let gasLimit = 2500000
  let gasPrice = await web3.eth.getGasPrice()

  transactionCount = web3.utils.toHex(transactionCount)
  gasLimit = web3.utils.toHex(gasLimit)
  gasPrice = web3.utils.toHex(gasPrice)

  return [transactionCount, gasLimit, gasPrice]
}

async function submitTransaction(privateKey, transactionObject) {
  const transaction = new Transaction(transactionObject, {chain:'rinkeby'})
  transaction.sign(privateKey)

  const serializedTransaction = transaction.serialize()
  const raw = '0x' + serializedTransaction.toString('hex')

  const transactionHash = await web3.eth.sendSignedTransaction(raw, (err, transactionHash) => {
    if (err != null) {console.log(err); return;}
    console.log('TransactionHash:', transactionHash)
    return transactionHash
  })

  return transactionHash.status
}

async function submitTransactionWithContractAddressReturn(privateKey, transactionObject) {
  const transaction = new Transaction(transactionObject, {chain:'rinkeby'})
  transaction.sign(privateKey)

  const serializedTransaction = transaction.serialize()
  const raw = '0x' + serializedTransaction.toString('hex')

  const transactionHash = await web3.eth.sendSignedTransaction(raw, (err, transactionHash) => {
    if (err != null) {console.log(err); return;}
    console.log('TransactionHash:', transactionHash)
    return transactionHash
  }).on('receipt', getContractAddress)

  return transactionHash.status
}

async function submitTransactionWithTokenAddressReturn(privateKey, transactionObject) {
  const transaction = new Transaction(transactionObject, {chain:'rinkeby'})
  transaction.sign(privateKey)

  const serializedTransaction = transaction.serialize()
  const raw = '0x' + serializedTransaction.toString('hex')

  const transactionHash = await web3.eth.sendSignedTransaction(raw, (err, transactionHash) => {
    if (err != null) {console.log(err); return;}
    console.log('TransactionHash:', transactionHash)
    return transactionHash
  }).on('receipt', getTokenAddress)

  return transactionHash.status
}

async function submitTransactionWithReceiptReturn(privateKey, transactionObject) {
  const transaction = new Transaction(transactionObject, {chain:'rinkeby'})
  transaction.sign(privateKey)

  const serializedTransaction = transaction.serialize()
  const raw = '0x' + serializedTransaction.toString('hex')

  const transactionHash = await web3.eth.sendSignedTransaction(raw, (err, transactionHash) => {
    if (err != null) {console.log(err); return;}
    console.log('TransactionHash:', transactionHash)
    return transactionHash
  }).on('receipt', console.log)

  return transactionHash.status
}

function getContractAddress(receipt) {
  console.log('Contract Address:', receipt.logs[1].address)
}

function getTokenAddress(receipt) {
  console.log('Token Address:', receipt.contractAddress)
}

module.exports = {
  //constants
  gnosisAddress: GNOSIS_SAFE_ADDRESS,
  eAUD: EAUD_ADDRESS,
  eCAD: ECAD_ADDRESS,
  eCNY: ECNY_ADDRESS,
  eEUR: EEUR_ADDRESS,
  eGBP: EGBP_ADDRESS,
  eIDR: EIDR_ADDRESS,
  eJPY: EJPY_ADDRESS,
  ePHP: EPHP_ADDRESS,
  eSGD: ESGD_ADDRESS,
  eUSD: EUSD_ADDRESS,
  //helper methods
  fileToJSON: fileToJSON,
  encodeParameters: encodeParameters,
  //token methods
  createToken: createToken,
  createTokenWithParams: createTokenWithParams,
  transfer: transfer,
  approve: approve,
  addOwner: addOwner,
  mint: mint,
  burn: burn,
  //view methods
  isOwner: isOwner,
}
