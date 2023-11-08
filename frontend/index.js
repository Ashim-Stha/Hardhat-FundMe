import { ethers } from "./ethers.js";
import { abi, contractAddress } from "./constants.js";

const connectBtn = document.getElementById("connectBtn");
const fundBtn = document.getElementById("fundBtn");
const balanceBtn = document.getElementById("balanceBtn");
const withdrawBtn = document.getElementById("withdrawBtn");

connectBtn.onclick = connect;
fundBtn.onclick = fund;
balanceBtn.onclick = getBalance;
withdrawBtn.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectBtn.innerHTML = "Connected";
  } else {
    connectBtn.innerHTML = "Please install metamask";
  }
  // if (typeof window.solana !== "undefined") {
  //   console.log("Solana");
  // }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(balance);
    console.log(ethers.utils.formatEther(balance));
    document.getElementById(
      "showBalance"
    ).innerHTML = `Balance: ${ethers.utils.formatEther(balance)}`;
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmt").value;
  console.log(`Funding with ${ethAmount} ...`);
  if (typeof window.ethereum !== "undefined") {
    //provider/connection to the blockchain
    //signer/wallet/someone with some gas
    //contract that we are interactig with
    //ABI and Address

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(signer);

    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });

      //   const transactionReceipt = await transactionResponse.wait(1);
      //   console.log(transactionResponse);
      //   console.log(transactionReceipt);

      //hey wait for this tx to finish
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done");
    } catch (err) {
      console.log(err);
    }
  }
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    console.log("Withdrawing..");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
    } catch (err) {
      console.log(err);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);

  //listen for this transaction to finish
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );

      resolve();
    });
  });
}
