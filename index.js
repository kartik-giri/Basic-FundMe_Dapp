import { ethers } from "./ethers-5.6.esm.min.js";
import { abi } from "./constants.js";
import { address } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balButton = document.getElementById("balButton");
const WithdrawButton = document.getElementById("WithdrawButton");

const connect = async () => {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "Connected!";
  } else {
    connectButton.innerHTML = "Please install metamask!";
  }
};

const fund = async () => {
  const ethAmount = document.getElementById("ethAmount").value;
  if (typeof window.ethereum !== "undefined") {
    // provider/ connection to the blockchain
    // signer / wallet / someone with some gas
    // contract we are interacting with
    // ABI & Address
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      // hey wait for this tx to finish
      await listenforTransactionMine(transactionResponse, provider);
      // listern for the tx to be mined
      // listen dor an event <- we haven't learned about yet!
      console.log("Done!");
    } catch (error) {
      console.log(error);
    }
  }
};
// fund function will invoked and only wait for listernfortransactionmine function to complette not for provider.once. 
// but listernfor transactionmine will complete before provider.once so that's why we will use promises
// because our listener is not waiting so that why we will make it promise and retrun it 
const listenforTransactionMine = (transactionResponse, provider) => {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject)=>{
       provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmation`
        );
        resolve();
      });
  })
};

const balanceFunction = async()=>{
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(address);//contract balance
        console.log(ethers.utils.formatEther(balance));

    }
}

const withdraw = async()=>{
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(address, abi, signer); 

        try {
            const transactionResponse = await contract.cheaperWithdraw();
            // hey wait for this tx to finish
            await listenforTransactionMine(transactionResponse, provider);
            // listern for the tx to be mined
            // listen dor an event <- we haven't learned about yet!
            console.log("Done!");
          } catch (error) {
            console.log(error);
          }
    }
}

connectButton.onclick = connect;
fundButton.onclick = fund;
balButton.onclick= balanceFunction;
WithdrawButton.onclick = withdraw;
