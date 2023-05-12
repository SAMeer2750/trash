import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "./metadata";

function App() {
  const [provider, setProvider] = useState("");
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [number, setnumber] = useState(0);
  const [contractInstance, setContractInstance] = useState(null);
  const [chainNu, setchainNu] = useState(null);

  async function fetchblockchainData() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      console.log("hello");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      const ci = new ethers.Contract(contractAddress, contractABI, signer);
      setContractInstance(ci);
      console.log("hello11");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchblockchainData();
  }, []);

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = ethers.utils.getAddress(accounts[0]);
        setAccount(account);
        console.log("Metamask Connected " + account);
        setIsConnected(true);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Metamask not detected in browser");
    }
  }

  async function changeNU(){
    const tx = await contractInstance.changeNu(number);
    await tx.wait();
    const tx2 = await contractInstance.getNu();
    // let x = parseInt(tx2,16);

    setchainNu(parseInt(tx2));
  }

  function changenumber(e) {
    setnumber(e.target.value);
  }

  return (
    <div className="App">
      <h1>Hello</h1>
      {account ? (
        <button>{account.slice(0, 6) + "..." + account.slice(38, 42)} </button>
      ) : (
        <button onClick={connectToMetamask}>Connect Wallet</button>
      )}
      <br />
      <br />
      <input type="number" onChange={changenumber} />
      <button onClick={changeNU} >Submit</button>
      <br /><br />
      <h1>{chainNu}</h1>
    </div>
  );
}

export default App;
