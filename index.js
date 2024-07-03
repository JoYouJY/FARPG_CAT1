console.log("start");
// document.body.appendChild(Object.assign(document.createElement("script"), { type: "text/javascript", src: "./web3modal.js" }));
// document.body.appendChild(Object.assign(document.createElement("script"), { type: "text/javascript", src: "./web3.min.js" }));
// Create script elements and set their src attributes
////const web3ModalScript = document.createElement("script");
////web3ModalScript.type = "text/javascript";
////web3ModalScript.src = "./web3modal.js";

////const web3Script = document.createElement("script");
////web3Script.type = "text/javascript";
//dont know what version you got
////web3Script.src = "./web3.min.js";

//const web3 = new Web3(Web3.givenProvider) ;

var providerNEW;
var signerNEW;
var userAccountNEW;
const MasterChainID = 64165; //250 is Fantom Mainnet, 64165


 

 const call_type = {
  CONNECT: 1,
  SEND_CONTRACT: 2,
  FULL_SCREEN: 3,
};

  const response_type = {
    ERROR   : 1,
    HASH    : 2,
    RECEIPT : 3,
    ACCOUNT_NUMBER: 4,
    READ_RESPONSE: 5,
    ROTATE: 6,
    UPDATE: 7,
  };




// document.getElementById('btn-connectwallet').addEventListener("click", function(event) {
//   ConnectWallet()
// }, {once: false});

// const web3 = new Web3(Web3.givenProvider) ;
// const from = await web3.eth.getAccounts();

async function ConnectWallet(){
  console.log("ConnectWallet()");

  if (window.ethereum == null) {

    // If MetaMask is not installed, we use the default provider,
    // which is backed by a variety of third-party services (such
    // as INFURA). They do not have private keys installed so are
    // only have read-only access
    console.log("MetaMask not installed; using read-only defaults")
    //provider = ethers.getDefaultProvider()
    //providerNEW = new ethers.JsonRpcProvider('https://rpcapi.sonic.fantom.network/');

  } else {

    // Connect to the MetaMask EIP-1193 object. This is a standard
    // protocol that allows Ethers access to make all read-only
    // requests through MetaMask.
    providerNEW = new ethers.BrowserProvider(window.ethereum)
    console.log(window.ethereum);

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
    signerNEW = await providerNEW.getSigner();
  } 

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    if (error.code === 4001) {
      window.location.href = 'ethereum:';
    } else {
      console.log(error);
    }
  }

  userAccountNEW = await signerNEW.getAddress();

  console.log(userAccountNEW);

  console.log("ConnectWallet() getweb3 done");

  import("./reroute.js")
  walkaround();

  response(response_type.ACCOUNT_NUMBER, userAccountNEW);
}

var isfullscreen = false;
function EnterFullScreen(){
  if (isfullscreen){
    window.unityInstance.SetFullscreen(0);
    isfullscreen = false;
  } 
  else{
    window.unityInstance.SetFullscreen(1);
    isfullscreen = true;
  }
}

// ConnectWallet();

function JsCallFunction(type, arg_string){
  console.log("JsCallFunction")
  console.log(type)
  console.log(arg_string)


  if(type == call_type.CONNECT){    
    ConnectWallet()  
  }  
  else if(type == call_type.FULL_SCREEN){    
    EnterFullScreen()  
  }
  else if (type == call_type.SEND_CONTRACT){
    arg_string = arg_string.toString()
    if (arg_string.startsWith("<sendContract>") && arg_string.endsWith("</sendContract>")){
      const removeSyntax = arg_string.substring("<sendContract>".length).slice(0,arg_string.length-("<sendContract>".length+"</sendContract>".length));
      const splited_text = removeSyntax.split("_%_");
      
      if (splited_text.length == 8){

          var bridge_id   = splited_text[0];
          var address     = splited_text[1];
          var method      = splited_text[2];
          var args        = splited_text[3];
          var price       = splited_text[4];
          var gasLimit    = splited_text[5];
          var gasPrice    = splited_text[6];
          var abi         = splited_text[7];



          sendContract(bridge_id, method, abi, address, args, price, gasLimit, gasPrice) 

      }
    }

  }

}
window.JsCallFunction = JsCallFunction;



async function JsGetFunction(type, arg_string){
  console.log("JsGetFunction")
  console.log(type)
  // console.log(arg_string)


  arg_string = arg_string.toString()
  if (arg_string.startsWith("<readContract>") && arg_string.endsWith("</readContract>")){
    const removeSyntax = arg_string.substring("<readContract>".length).slice(0,arg_string.length-("<readContract>".length+"</sendContract>".length));
    const splited_text = removeSyntax.split("_%_");
    
    if (splited_text.length == 5){

      var bridge_id   = splited_text[0];
      var address     = splited_text[1];
      var method      = splited_text[2];
      var args        = splited_text[3];
      var abi         = splited_text[4];

      console.log(bridge_id);
      console.log(address);
      console.log(method);
      console.log(args);
      // console.log(abi);



      var responseString = await readContract(bridge_id, method, abi, address, args, ) 

      
      console.log(JSON.stringify(responseString));

      response(response_type.READ_RESPONSE, bridge_id.toString() + "_%_" + JSON.stringify(responseString))

      return(JSON.stringify(responseString));
    }
  }


}
window.JsGetFunction = JsGetFunction;

//////////// WEB3 1.3.6 version of readcontract //////////////
/*
async function readContract(id, method, abi, contract, args) {
  
  // navigator.clipboard.writeText("<ContractRead>")
  return new Promise(async (resolve, reject) => {
    try {
      const from = (await web3.eth.getAccounts())[0];
      console.log("readContract");
      console.log(method);
      const result = await new web3.eth.Contract(JSON.parse(abi), contract).methods[method](...JSON.parse(args)).call();
      console.log(result);
      resolve(result); // Resolve the Promise with the result
    } catch (error) {
      console.error(error);
      reject(error); // Reject the Promise in case of an error
    }
  });
}
*/
//--------------------------------------------------------------- -READ- ---------------------------------------------
async function readContract(id, method, abi, contract, args) {
  // navigator.clipboard.writeText("<ContractRead>")
  return new Promise(async (resolve, reject) => {
    try {
      //const from = (await web3.eth.getAccounts())[0];
      console.log("readContract");
      console.log(method);
      console.log(contract);
      const contracts = new ethers.Contract(contract, abi, providerNEW);
      const resulttemp = await contracts[method](...JSON.parse(args));
      //const result = resulttemp.map(value => value.toString());
      /*const result = {};
      for (const key in resulttemp) {
        result[key] = Array.from(resulttemp[key], val => val.toString());
      }*/

      //const result = JSON.stringify(resulttemp);
      //const result = await new web3.eth.Contract(JSON.parse(abi), contract).methods[method](...JSON.parse(args)).call();
      
      //const result = recursivelyConvertToString(resulttemp);
      //CHOOSE ONE to USE. the rest obsolate to reduce redundant.
      console.log(resulttemp);
      

      const unwraplog = unwrapProxy(resulttemp);
      console.log("Unwrapped proxy: ",unwraplog);

      
      const serializelog = convertBigIntsToStrings(unwraplog);
      console.log("serialize log: ",serializelog);
    
      
      console.log(serializelog);
      //-------------------------
      resolve(serializelog); // Resolve the Promise with the result
    } catch (error) {
      console.error(error);
      reject(error); // Reject the Promise in case of an error
    }
  });
}
//---------------------------------- SEND --------------------------------------------------------------------------------
async function sendContract(id, method, abi, contract, args, value, gasLimit, gasPrice) {
// Get network object
  const network = await providerNEW.getNetwork();
  var chainId = network.chainId;
  // Convert chainId to a number before comparison
  chainId = parseInt(chainId, 10);
  console.log("Chain ID:", chainId);

  // Check if chain ID is not 250
  if (chainId !== MasterChainID) {
    response(response_type.ERROR, method + "_%%_" + "wrong RPC, switch to Fantom Mainnet and Restart/Refresh(F5).");
  } else {
    //const from = (await web3.eth.getAccounts())[0];
    const contracts = new ethers.Contract(contract, abi, providerNEW);
		const contractWithSigner = contracts.connect(signerNEW);
	  
    var options = {};
    if (gasLimit != "") { options.gasLimit = gasLimit; }
    if (gasPrice != "") { options.gasPrice = gasPrice; }
    if (value    != "") { options.value    = value; }

	  console.log("waiting metamask");
    
    //console.log(from)
    console.log(id)
    console.log(contract)
    console.log(method)
    console.log(args)
	  console.log(options);
    console.log(value)
    console.log(gasLimit)
    console.log(gasPrice)


    // args = "[\"0xC69658BC4Ec4e903Bc0A04e50705A5225Aa88dfc\", 1]";
    // console.log(args)
/*
    new web3.eth.Contract(JSON.parse(abi), contract).methods[method](...JSON.parse(args))
        .send({
          from,
          value,
          gas: gasLimit ? gasLimit : undefined,
          gasPrice: gasPrice ? gasPrice : undefined,
        })
        .on("transactionHash", (transactionHash) => {
          response(response_type.HASH, transactionHash)
        })
        .on("error", (error) => {
          response(response_type.ERROR, error.message)
        })
        .on("receipt", function(receipt) {
  
          receipt["method"] = method;
          console.log(method);
          console.log(String(receipt));
          response(response_type.RECEIPT, JSON.stringify(receipt))
          
        });*/
/*
        try {
          const result = await new web3.eth.Contract(JSON.parse(abi), contract)
            .methods[method](...JSON.parse(args))
            .send({
              from,
              value,
              gas: gasLimit ? gasLimit : undefined,
              gasPrice: gasPrice ? gasPrice : undefined,
            });
          console.log("result is...", result);
          if (result.status) {
            const receipt = await web3.eth.getTransactionReceipt(result.transactionHash);
            console.log("hheelloo", receipt);
            receipt["method"] = method;
            console.log(method);
            console.log(String(receipt));
            response(response_type.RECEIPT, JSON.stringify(receipt));
          } else {
            throw new Error("Transaction failed");
          }
        } catch (error) {
          response(response_type.ERROR, error.message);
        }
*/
try {
  console.log("HERE123");
      console.log(...JSON.parse(args));
      const transaction = await contractWithSigner[method](...JSON.parse(args), options);
      console.log("HERE321");
		  const startTime = new Date();
		  // Wait for the transaction to be mined and get receipt
      console.log(transaction.hash);
      response(response_type.HASH, method);
      const receipt = await getTransactionReceiptWithRetry(transaction.hash, 120);
      console.log("USE OTHER METHOD",receipt )
      const endTime2 = new Date();
		  const timeTaken2 = endTime2 - startTime;
      console.log('First Time taken (ms):', timeTaken2);
      //----------------------------------------
      console.log('log', receipt.logs);
      const parsedLogs = [];
      for (const log of receipt.logs) {
        const parsedLog = contracts.interface.parseLog(log);
        
        if (parsedLog) {
          parsedLogs.push(parsedLog);
        } else {
          parsedLogs.push(log);
        }
      }
      console.log("this is parsed log: ", parsedLogs);
      // Now parsedLogs contains the parsed logs and raw logs if they didn't match the ABI
      

      const unwraplog = unwrapProxy(parsedLogs);
      console.log("Unwrapped proxy: ",unwraplog);

      
      const serializelog = convertBigIntsToStrings(unwraplog);
      console.log("serialize log: ",serializelog);

      const jsonlog = JSON.stringify(serializelog);
      console.log("This is JSONstringfy: ",jsonlog);
      response(response_type.RECEIPT, method + "_%%_" + JSON.stringify(serializelog));
		  return receipt;
		} catch (error) {
		  console.error('Error sending transaction:', error);
      response(response_type.ERROR, method + "_%%_" + error.message);
      //throw error; // rethrow the error to handle it at a higher level
}
		}
	  }
	  

//------------------------------------------------------Assisting Decoding function--------------------
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
////////////////////
async function getTransactionReceiptWithRetry(txHash, maxRetries) {
  let retries = 0;
  let txReceipt = null;
  await delay(800); // Wait for 0.5 seconds before retrying
  while (retries < maxRetries) {
    await delay(450); // Wait for 0.5 seconds before retrying
    txReceipt = await providerNEW.getTransactionReceipt(txHash);

    if (txReceipt) {
      console.log("retried: " ,retries, " times.")
      return txReceipt;
    }

    retries++;
    
  }
  
  return null;
}
////////////////////
function unwrapProxy(proxy) {
  if (typeof proxy !== 'object' || proxy === null) {
    return proxy;
  }
  if (Array.isArray(proxy)) {
    return proxy.map(unwrapProxy);
  }
  // Check if the object being unwrapped is a private function
  if (proxy.stateMutability === 'private') {
    // Decode the private function's ABI and extract its arguments
    const args = abi.decode(proxy.signature, proxy.args);

    // Return the private function's arguments
    return args;
  }
  const result = {};
  for (let key in proxy) {
    result[key] = unwrapProxy(proxy[key]);
  }

  return result;
}
//////////////////
function convertBigIntsToStrings(obj) {
  if (typeof obj === 'bigint') {
      return obj.toString();
  } else if (Array.isArray(obj)) {
      return obj.map(item => convertBigIntsToStrings(item));
  } else if (typeof obj === 'object' && obj !== null) {
      const result = {};
      for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
              result[key] = convertBigIntsToStrings(obj[key]);
          }
      }
      return result;
  } else {
      return obj;
  }
}


//----------------------------------------------------------


async function response(respondType, message){

  var responseString = "<response>" + respondType + "_%_" + message + "</response>"

  window.unityInstance.SendMessage("JavascriptBridgeManager", "ResponseToUnity", responseString);

}



window.getAggressiveGasPrice = async function() {
  try {
    /*
    // Retrieve the current gas price
    const gasPrice = await web3.eth.getGasPrice();

    // Convert the gas price to BigInt
    const gasPriceBigInt = BigInt(gasPrice);

    // Adjust the gas price by multiplying with a factor (e.g., 2 for 100% increase)
    const aggressiveGasPrice = gasPriceBigInt * BigInt(15) / BigInt(10); // Multiplies by 1.5 as an example

    // Convert the gas price to Gwei or other units if desired
    const aggressiveGasPriceGwei = web3.utils.fromWei(aggressiveGasPrice.toString(), 'gwei');

    console.log('Aggressive gas price:', aggressiveGasPriceGwei, 'Gwei');
    window.unityInstance.SendMessage("Web3Manager", "UpdateGasPrice", aggressiveGasPrice.toString());
    return aggressiveGasPrice.toString(); // Return the aggressive gas price
    */

    //const contract = new ethers.Contract(contractAddress, contractABI, providerNEW);
		//const contractWithSigner = contract.connect(signerNEW);
    //const startTime3 = new Date();
      //const gasEstimate = await contractWithSigner.BattlePet.estimateGas('0', '3');
      //console.log("Gaslimit estimate", gasEstimate.toString());
      // Get current gas price
      
      const feeData = await providerNEW.getFeeData();
      const bignumgas = feeData.gasPrice * BigInt(15) / BigInt(10);
      //const gasPrice = numbergas.toString();
      console.log("GasPrice estimate", bignumgas);

      return bignumgas;

  } catch (error) {
    console.error('Error:', error);
    throw error; // Throw the error
  }
};




//const { ethers, providers } = require('ethers');
/*
const fantomChain = {
  chainId: "0x190",
  chainName: "Fantom Opera",
  rpcUrls: ["https://rpc.ankr.com/fantom/"],
  nativeCurrency: {
    symbol: "FTM",
    decimals: 18,
  },
  blockExplorerUrls: ["https://ftmscan.com/"],
};
*/
async function switchToFantom() {
const hexValue = "0x" + MasterChainID.toString(16);
  try{
    await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: hexValue }],    // sonic testnet is 0xFAA5 mainnet 0xFA
    });
  }catch (error) {
    // Handle errors appropriately:
    if (error.code === 4902) { // Check for "User rejected the request" error code
      console.error("User rejected the network switch request.");
      // Optionally display a user-friendly message explaining the situation
    } else if (error.code === 4901) { // Check for "Chain not found" error code
      console.error("Fantom Chain not found in your wallet.");
      // Provide clear instructions on how to add the Fantom Chain (e.g., link to a guide)
    } else {
      console.error("Error switching to Fantom Chain:", error);
      // Optionally display a generic error message for other unexpected errors
    }
  }
}

// Call the connectToFantom function to connect to the Fantom chain
//connectToFantom();
setTimeout(switchToFantom, 1000);

//Resize Canvas
document.addEventListener("DOMContentLoaded", function() {
  
  // Add click event listener to the button
  document.getElementById("unity-rotate-button").addEventListener("click", rotateCanvas);
  console.log("resizeclicked");

});

var isHorizontal = true;
function rotateCanvas() {
  console.log("resize");
  isHorizontal = ! isHorizontal;
  console.log(isHorizontal);
  var canvas = document.getElementById('unity-canvas');
  var temp = canvas.style.width;
  canvas.style.width = canvas.style.height;
  canvas.style.height = temp;
  
  response(response_type.ROTATE, isHorizontal);
}
