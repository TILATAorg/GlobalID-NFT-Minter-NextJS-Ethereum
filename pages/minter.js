import React, { useState, useEffect } from 'react';
import OpenSea from 'opensea-js';
import mintNFT from '../fun/minter';
import Link from 'next/link';
import Image from 'next/image';


export default function Minter() {
  const [formData, setFormData] = useState({
    NAME: '',
    LAST_NAME: '',
    DATE_OF_BIRTH: '',
    ORIGIN: '',
  });

  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [connectedWalletAddress, setConnectedWalletAddress] = useState(null);

  useEffect(() => {
    async function checkWalletConnection() {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWalletConnected(true);
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          setAccount(accounts[0]);
        } catch (error) {
          console.error('Error connecting wallet:', error);
          setWalletConnected(false);
        }
      } else {
        console.error('Ethereum provider not found. Please install MetaMask or another compatible wallet.');
        setWalletConnected(false);
      }
    }

    checkWalletConnection();

    const getConnectedWalletAddress = async () => {
      if (walletConnected) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setConnectedWalletAddress(accounts[0]);
      } else {
        setConnectedWalletAddress(null);
      }
    };

    getConnectedWalletAddress();
  }, [walletConnected]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleMint() {
    const { NAME, LAST_NAME, DATE_OF_BIRTH, ORIGIN, UBIGEO} = formData;

    // Check if a wallet is connected
    if (!walletConnected) {
      console.error('Wallet not connected. Please connect your wallet.');
      return;
    }

    // Check if the wallet is connected to the Sepolia testnet.
    async function isConnectedToSepolia() {
      // Get the current chain ID.
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
      // Compare the chain ID to the Sepolia testnet chain ID.
      return chainId === '0xaa36a7';
    }
    
    

    // Perform the minting process using the connected account and form data
    try {
      isConnectedToSepolia();
      const asset = await mintNFT(NAME, LAST_NAME, DATE_OF_BIRTH, ORIGIN);
      // Display the NFT asset to the user.
      console.log('Minted NFT:', asset);
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  }

  async function handleConnectWallet() {
    // Connect to the Sepolia testnet.
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }],
    });
  
    // Add an event listener to be notified when the list of connected accounts changes.
    window.ethereum.on('accountsChanged', () => {
      // Update or refresh the page.
    });
  }

  const [location, setLocation] = useState({ lat: 0, lng: 0 }); // Default location

  const handleLocationChange = (e) => {
    setLocation(e.latlng);
  };



  return (
    <div className='p-4 mx-auto my-auto grid place-content-center pt-12'>
      {!walletConnected && (
        <button onClick={handleConnectWallet} className='bg-white p-4 text-black mb-4'>
          Connect wallet
        </button>
      )}

      {walletConnected && (
        <div id="minter-div">
          <h1 className='rounded-sm border-gray'><strong>Sign up Global ID</strong></h1>
          <br></br>
          <button className='bg-gray-50 p-4 text-black mb-4 rounded-lg border-2 w-full'>PICTURE</button>
            <input
              key='NAME'
              type='text'
              name='NAME'
              placeholder='NAME'
              value=''
              onChange={handleInputChange}
              className='block mb-2 p-4 w-full text-black rounded-lg border-2'
            />
            <input
              key='LAST_NAME'
              type='text'
              name='LAST_NAME'
              placeholder='LAST_NAME'
              value=''
              onChange={handleInputChange}
              className='block mb-2 p-4 w-full text-black rounded-lg border-2'
            />
            <input
              key='DATE_OF_BIRTH'
              type='date'
              name='DATE_OF_BIRTH'
              placeholder='DATE_OF_BIRTH'
              value=''
              onChange={handleInputChange}
              className='block mb-2 p-4 w-full text-black rounded-lg border-2'
            />
          <button
            className="bg-gray-50 p-4 text-black mb-4 rounded-lg border-2 w-full"
          >
            ORIGIN
          </button>
          <br></br>
          {connectedWalletAddress && (
            <button id="connected-wallet-address" className='bg-blue-50 p-4 text-slate-500 mb-4 rounded-lg border-2 border-blue-50'>
              {connectedWalletAddress}
            </button>
          )}
          <br></br>
          <button onClick={handleMint} className='bg-black p-4 text-white mb-4 rounded-lg w-full'>
            SIGN
          </button>
        </div>
      )}
      <Link href="/minter">
            <Image src="/logo.svg" height="72" width="72" alt="tilata" className="invert mx-auto pt-8 h-full" />
        </Link>
    </div>
  );
}
