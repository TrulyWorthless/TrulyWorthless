/********* requirements *********/
const Web3 = require('web3')
const Transaction = require("ethereumjs-tx").Transaction
const FileSystem = require('fs')

/********* web3 *********/
const kovan = 'https://eth-kovan.alchemyapi.io/v2/' + process.env.ALCHEMY_API_KEY
const web3 = new Web3(kovan)

/********* token addresses *********/
const TELCOIN_ADDRESS = "0xD2CF357588BB0B1a29d2ba5e42C0918FCA573649"

/********* helper functions *********/
function fileToJSON(file) {
  let rawdata = FileSystem.readFileSync(file);
  return JSON.parse(rawdata);
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

/********* private functions *********/
async function getTransactionArgs(coinbase) {
  let transactionCount = await web3.eth.getTransactionCount(coinbase)
  let gasLimit = 12000000
  let gasPrice = await web3.eth.getGasPrice()

  transactionCount = web3.utils.toHex(transactionCount)
  gasLimit = web3.utils.toHex(gasLimit)
  gasPrice = web3.utils.toHex(gasPrice)

  return [transactionCount, gasLimit, gasPrice]
}

async function submitTransaction(privateKey, transactionObject) {
  const transaction = new Transaction(transactionObject, {chain:'kovan'})
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
  const transaction = new Transaction(transactionObject, {chain:'kovan'})
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
  const transaction = new Transaction(transactionObject, {chain:'kovan'})
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
  const transaction = new Transaction(transactionObject, {chain:'kovan'})
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
  telcoin: TELCOIN_ADDRESS,
  //view methods

  //helper methods
  fileToJSON: fileToJSON,
  //token methods
  createToken: createToken,
  transfer: transfer,
  approve: approve,
}
