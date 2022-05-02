import React, { useState,useEffect } from "react";
import "./App.css";
import {ethers} from "ethers";
import abi from "./utils/WavePortal.json"
import LoadingBar from 'react-top-loading-bar'
let resultDisplay = document.getElementById("result");

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(""); 
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0x3848Be1Cef2C69d88b1FECB01d1f202C120132c7";
  const contractABI = abi.abi;
  const [progress, setProgress] = useState(0)
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
  
      if (!ethereum) {
        console.log("Make sure you have metamask!");
      } else {
        console.log("We have the ethereum object", ethereum);
      }
  
    const accounts = await ethereum.request({ method: "eth_accounts" });
    
      if (accounts.lenght !=0) {
        const account = accounts[0];
        console.log("Found Authorised account ", account);
        setCurrentAccount(account)
      }else{
        console.log("no authorised account found");
      }
    }catch(error) {
      console.log(error);
   }
 } 
  
  const connectWallet = async () => {
    try {
      const {ethereum} = window;
      if (!ethereum ){
        alert("Get Metamask")
      }
      const accounts  = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("account: ", accounts[0]);
      setCurrentAccount(accounts[0])
    }catch(error){
      console.log(error);
    }
  }

  const wave = async () => {
    try{
      const {ethereum} = window;

      if (ethereum){
       const provider = new ethers.providers.Web3Provider(ethereum);
       const signer = provider.getSigner();
       const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
  
       let waveCount = await wavePortalContract.GetTotalWaves();
       console.log("Total wave count ",waveCount.toNumber());

       let waveTxn = await wavePortalContract.Wave("Hi there",{gasLimit:300000});
       setProgress(progress+30)
       console.log("mining ....");
       waveTxn.wait();
       setProgress(100)
       console.log("mined ....");
      
       waveCount = await wavePortalContract.GetTotalWaves();
       console.log("Total wave count ",waveCount.toNumber()); 
       resultDisplay = waveCount.toNumber();
        
      }else{
        console.log("Ethereum object does not exist");
      }   
    }catch(error){
      console.log(error);
    }
  }

  const sendMsg = async () => {
    try {
      var m = document.getElementById("msg").value;
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI,signer);
        let waveTxn = await wavePortalContract.Wave(m,{gasLimit:300000});
        waveTxn.wait();
        let waveHistory = await wavePortalContract.getAllwaves();
        let wavesCleaned = [];
        waveHistory.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp *1000),
            message: wave.message
          });
        });
        setAllWaves(wavesCleaned);
        console.log("waves History ", waveHistory);
      }else{
        console.log("metamask object is not found");
      }
    }catch(error){
      console.log(error);
    }
  }
useEffect(() => {
    checkIfWalletIsConnected();
}, [])
  
  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    let wavePortalContract;
    
    const onNewWave = (from, timestamp, message) => {
    console.log("NewWave", from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
  };
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          
        </div>

        <LoadingBar color="#f11946" progress={progress} onLoaderFinished={() => setProgress(0)} />
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        <input className="waveMsgButton" type="text" name ="" id="msg"/>
        <button onClick={sendMsg}> send message </button>

        
        {!currentAccount && ( 
        <button className="waveButton" onClick={connectWallet}>
          connect wallet
        </button>
          )}
        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App 