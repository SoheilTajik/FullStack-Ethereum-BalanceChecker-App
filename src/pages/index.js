import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Image from "next/image";

import creator from "/Photo.jpg";
import ethLogo from "/EthWhite.png";

export default function Home() {
  // State variables
  const [currentAccount, setCurrentAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [connected, setConnected] = useState(false); // New state variable

  // Messages
  const failMessage = "Connect your MetaMask wallet to check your balance";
  const successMessage = "Your account successfully connected to MetaMask";

  // Web3 provider configuration
  const INFURA_ID = "0e8e86112c49470085a5c17100169a7e";
  const provider = new Web3.providers.HttpProvider(
    `https://goerli.infura.io/v3/${INFURA_ID}`
  );

  // Function to check if the user is connected to a wallet and retrieve account balance
  const checkIfWalletConnected = async () => {
    // Check if the Ethereum provider is available
    if (!window.ethereum) return;

    // Initialize the web3 instance with the Ethereum provider
    const web3 = new Web3(window.ethereum);

    try {
      // Request access to the user's accounts
      const accounts = await web3.eth.getAccounts();

      // Check if accounts are available
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        setConnected(true); // Set connected to true
        // Get balance using web3
        const balance = await web3.eth.getBalance(accounts[0]);
        setBalance(web3.utils.fromWei(balance, "ether"));
      } else {
        console.log("Fail");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle account change event
  const handleAccountChange = (accounts) => {
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
      checkIfWalletConnected(); // Call checkIfWalletConnected to update the balance
    } else {
      setCurrentAccount(""); // Clear current account
      setConnected(false); // Set connected to false
    }
  };

  // Function to handle wallet connection
  const connectWallet = async () => {
    if (!window.ethereum) return console.log(failMessage);

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setCurrentAccount(accounts[0]);
    setConnected(true); // Set connected to true

    checkIfWalletConnected();
  };

  // Call the checkIfWalletConnected function on component mount
  useEffect(() => {
    // Check if the Ethereum provider is available
    if (!window.ethereum) {
      console.log(failMessage);
    } else {
      checkIfWalletConnected();

      // Listen for account changes in MetaMask
      window.ethereum.on("accountsChanged", handleAccountChange);

      return () => {
        // Cleanup the event listener when component unmounts
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountChange
          );
        }
      };
    }
  }, []);

  return (
    <div className="App bg-gradient-to-r from-[#022231] via-[#296387] to-[#90e0ef] w-screen h-screen flex justify-center items-center">
      <div
        id="app-container"
        className="bg-[#231e39] rounded-3xl text-white pt-8 shadow-lg overflow-hidden w-[400px] max-w-full text-center my-5 mx-0 pb-5 flex flex-col justify-center items-center"
      >
        <Image
          className="rounded-2xl shadow-2xl"
          src={creator}
          width={100}
          height={100}
          alt="creator"
        />
        <h3 className="my-3 mx-0">Ether Account Checker</h3>

        <div className="flex justify-center items-center">
          {!connected ? (
            <div className="flex flex-col justify-center items-center">
              <div>
                <p className="">{failMessage}</p>
              </div>
              <Image
                className="my-5"
                src={ethLogo}
                width={100}
                height={100}
                alt="ethereum"
              />
            </div>
          ) : (
            <div>
              <h6 className="my-1 mx-0 text-sm">
                Account is Verified{" "}
                <span className="bg-[#febb0b] font-bold text-black ml-1 rounded-sm px-1">
                  &#10004;
                </span>
              </h6>
              <div>
                <button
                  className="bg-[#ef233c] px-4 py-2 rounded-full my-5"
                  onClick={connectWallet}
                >
                  Ether Account Details:
                </button>
              </div>
            </div>
          )}
        </div>

        {!connected ? (
          <div>
            <button
              className="bg-[#ef233c] px-4 py-2 rounded-full my-5"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="bg-[#1f1a36] text-left p-6 rounded-2xl">
            <h6>Your Ether</h6>
            <ul className="list-none text-sm text-[12px]">
              <li className="border border-solid inline-block border-[#2d2747] rounded-md my-2 px-2">
                Account
              </li>
              <li className="border border-solid border-[#2d2747] rounded-md text-sm text-[12px] px-2">
                {currentAccount}
              </li>
              <li className="border border-solid inline-block border-[#2d2747] rounded-md text-sm text-[12px] my-2 px-2">
                Balance
              </li>
              <li className="border border-solid inline-block border-[#2d2747] rounded-md text-sm text-[12px] px-2">
                {balance} ETH
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
