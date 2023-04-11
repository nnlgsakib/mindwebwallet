import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { abi } from './abi';
import { Buffer } from 'buffer';
import "./App.css";
import base64js from 'base64-js';


const web3 = new Web3(Web3.givenProvider || 'https://mainnet-rpc.metaviralscan.com');
const contractAddress = '0x0000000000000000000000000000000000001001';

function App() {
  const [account, setAccount] = useState('');
  const [stakedAmount, setStakedAmount] = useState(0);
  const [blsKey, setBlsKey] = useState('');
  const [validators, setValidators] = useState([]);

  useEffect(() => {
    const loadAccount = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    };

    const loadStakedAmount = async () => {
      const stakingInstance = new web3.eth.Contract(abi, contractAddress);
      const amount = await stakingInstance.methods.stakedAmount().call();
      setStakedAmount(web3.utils.fromWei(amount));
    };

    const loadValidators = async () => {
        const stakingInstance = new web3.eth.Contract(abi, contractAddress);
        const validators = await stakingInstance.methods.validators().call();
        const publicKeys = await stakingInstance.methods.validatorBLSPublicKeys().call();
        const validatorList = [];
      
        for (let i = 0; i < validators.length; i++) {
          const addr = validators[i];
          const publicKeyBuffer = Buffer.from(publicKeys[i].slice(2), 'hex');
          const publicKeyArray = new Uint8Array(publicKeyBuffer);
          const publicKeyString = web3.utils.bytesToHex(publicKeyArray);
          validatorList.push({ address: addr, publicKey: publicKeyString });
        }
      
        setValidators(validatorList);
      };
      
      
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        loadAccount();
      });
    }

    loadAccount();
    loadStakedAmount();
    loadValidators();
  }, []);

  const handleStake = async () => {
    const weiAmount = web3.utils.toWei('10000');
    const stakingInstance = new web3.eth.Contract(abi, contractAddress);
    await stakingInstance.methods.stake().send({
      from: account,
      value: weiAmount,
    });
    setStakedAmount(stakedAmount + 10000);
  };

  const handleUnstake = async () => {
    const weiAmount = web3.utils.toWei('10000');
    const stakingInstance = new web3.eth.Contract(abi, contractAddress);
    await stakingInstance.methods.unstake().send({
      from: account,
    });
    setStakedAmount(stakedAmount - 10000);
  };

  const handleBlsKeyChange = (event) => {
    setBlsKey(event.target.value);
  };

  const handleRegisterValidator = async () => {
    const stakingInstance = new web3.eth.Contract(abi, contractAddress);
    await stakingInstance.methods.registerValidator(web3.utils.utf8ToHex(blsKey)).send({
      from: account,
    });
    setValidators([...validators, { address: account, publicKey: blsKey }]);
  };

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Metamask is not installed.');
    }
  };

  return (
    <div>
      <h1>METAVIRAL  STAKING DAPP</h1>
      <div className="account-info">
    <h2>Account: {account}</h2>
    <p>Staked Amount: {stakedAmount} MIND</p>
    <button onClick={handleConnectWallet}>Connect Wallet</button>
  </div>
  
  <div className="validators">
   
    <form onSubmit={handleRegisterValidator}>
      <input type="text" placeholder="Enter your BLS public key" value={blsKey} onChange={handleBlsKeyChange} />
      <button type="submit">Register as Validator</button>
    </form>
  </div>

  <div className="staking">
    <h2>Staking</h2>
    <p>Stake MTV tokens to become a validator .</p>
    <button onClick={handleStake}>Stake 10000 MTV</button>
    <button onClick={handleUnstake}>Unstake 10000 MTV</button>
    <h2>Validators</h2>
    <ul>
      {validators.map((validator, index) => (
        <li key={index}>
          <p>Address: {validator.address}</p>
          <p>Public Key: {validator.publicKey}</p>
        </li>
      ))}
    </ul>
  </div>
</div>
);
}

export default App;