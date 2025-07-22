import { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";

const contractAddress = "0x09eeAa5da8F69E313B1FF568F0d6C2BA35d4e533";

function App() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");


  async function requestAccount() {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }else {
      alert("Please install MetaMask to use this application.");
    }
    
  }

  const handleSet = async () => {
    try {
      if (!text) {
        alert("Please enter a message before setting.");
        return;
      }

      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        
            try {
              await contract.setMessage.estimateGas(text);
            } catch (err) {
              console.error("Gas estimation failed. Likely a contract or input issue.", err);
              alert("Transaction would fail. Check your input, contract address, or network.");
              return;
            }


        const tx = await contract.setMessage(text); 
        const txReceipt = await tx.wait();
        console.log("Transaction successful:", txReceipt);
      } else {
        console.error("MetaMask not found. Please install MetaMask to use this application.");
      }
    } catch (error) {
      console.error("Error setting message:", error);
      alert(error.message || error);
    }
  };

  const getMessage = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);

      try {
        const message = await contract.getMessage();
        setMessage(message.toString());
      } catch (error) {
        console.error("Error getting message:", error);
        alert(error.message || error);
      }
    }
  };

  return (
    <main>
      <div style={{ padding: "2rem" }}>
      <h1>Set Message on Smart Contract</h1>
      <input
        type="text"
        placeholder="Set message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSet}>Set Message</button>
    </div>

    <div style={{ padding: "2rem" }}>
      <h2>Get Message from Smart Contract</h2>
      <button onClick={getMessage}>Get Message</button>
      {message && <p>Current Message: {message}</p>}
    </div>
  </main>
  );
}

export default App;