import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";


function App() {
  const [provider, setProvider] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [address, setAddress] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [amount, setAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");




  useEffect(() => {
    const connectProvider = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider("https://rpc-msc.mindchain.info/");
        setProvider(provider);
        if (localStorage.getItem("privateKey")) {
          const wallet = new ethers.Wallet(localStorage.getItem("privateKey"), provider);
          setWallet(wallet);
          setAddress(wallet.address);
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectProvider();
  }, []);

 


  const generateWallet = () => {
    const wallet = ethers.Wallet.createRandom();
    localStorage.setItem("privateKey", wallet.privateKey);
    setWallet(wallet);
    setAddress(wallet.address);
    setBalance(0);
  };

  const importWallet = () => {
    const input = prompt("Enter your private key");
    if (input === null) {
      return;
    }
    try {
      const wallet = new ethers.Wallet(input.trim(), provider);
      localStorage.setItem("privateKey", wallet.privateKey);
      setWallet(wallet);
      setAddress(wallet.address);
      setBalance(0);
    } catch (error) {
      console.log(error);
      alert("Invalid private key");
    }
  };

  const exportWallet = () => {
    const wallet = new ethers.Wallet(localStorage.getItem("privateKey"));
    alert(`Your private key is: ${wallet.privateKey}`);
  };

  const updateBalance = async () => {
    if (wallet) {
      const balance = await wallet.getBalance();
      setBalance(ethers.utils.formatEther(balance));
      localStorage.setItem("balance", balance.toString());
    }
  };



  const handleSend = async () => {
    try {
      setTransactionStatus("Pending");
      const tx = await wallet.sendTransaction({
        to: recipientAddress,
        value: ethers.utils.parseEther(amount),
        gasLimit: 21000,
        gasPrice: ethers.utils.parseUnits("1", "gwei")
      });
      setTransactionHash(tx.hash);
      await tx.wait();
      setTransactionStatus("Success");
      updateBalance();
      setAddress(""); 
    } catch (error) {
      console.log(error);
      setTransactionStatus("Failed");
    }
  };
  

  const logout = () => {
    localStorage.removeItem("privateKey");
    localStorage.removeItem("balance");
    setWallet(null);
    setBalance(null);
    setAddress("");
  };

  if (!provider) {
    return <div>Loading...</div>;
  }

  if (!wallet) {
    return (
      <div>
        <h1>MIND Web Wallet</h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src="https://i.postimg.cc/ncXf64mB/logo.png" alt="mind logo" height="100" />
        </div>
        <div>
          <button onClick={generateWallet}>Generate Wallet</button>
          <button onClick={importWallet}>Import Wallet</button>
        </div>
      
</div>
);
}

return (
<div>
<h1>MIND Web Wallet</h1>
<div style={{ display: "flex", justifyContent: "center" }}>
<img src="https://i.postimg.cc/ncXf64mB/logo.png" alt="mind  logo" height="100" />
</div>
<div>
<h2>Wallet Address: {address}</h2>
<h2>Balance: {balance} MIND</h2>
<button onClick={updateBalance}>Refresh Balance</button>
<button onClick={exportWallet}>Export Private Key</button>
<button onClick={logout}>Logout</button>
</div>
<div>
<div>
  <h3>Send MIND</h3>
  <div>
    <label>Recipient Address:</label>
    <input type="text" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} />
  </div>
  <div>
    <label>Amount:</label>
    <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
  </div>
  <button onClick={handleSend}>Send</button>
  {transactionStatus && (
    <div>
      <p>Transaction Status: {transactionStatus}</p>
      {transactionHash && <p>Transaction Hash: {transactionHash}</p>}
    </div>
  )}
</div>

</div>
</div>
);
}

export default App;
