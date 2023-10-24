import React, { useState, useEffect } from 'react';
import { mintNFT } from '../fun/minter';

export default function Minter() {
  const [formData, setFormData] = useState({
    NAME: 'FABO',
    LAST_NAME: 'HAX',
    DATE_OF_BIRTH: '1991-11-19',
    COUNTRY: 'X',
    PASSPORT: '987654321',
    EMAIL: 'FABOHAX@GMAIL.COM',
    SITE: 'FABOHAX.XYZ',
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
    const { NAME, LAST_NAME, DATE_OF_BIRTH, COUNTRY, PASSPORT, EMAIL, SITE } = formData;

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
      const asset = await mintNFT(NAME, LAST_NAME, DATE_OF_BIRTH, COUNTRY, PASSPORT, EMAIL, SITE);
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
  
  

  return (
    <div className='p-4 mx-auto my-auto grid place-content-center pt-12'>
      {!walletConnected && (
        <button onClick={handleConnectWallet} className='bg-white p-4 text-black mb-4'>
          Connect wallet
        </button>
      )}

      {walletConnected && (
        <div id="minter-div">
          <h1 className='rounded-sm border-gray'><strong>Sign Global ID</strong></h1>
          <br></br>
          {Object.entries(formData)
          .filter(([field]) => field !== 'PICTURE')
          .map(([field, value]) => (
            <input
              key={field}
              type={field === 'DATE_OF_BIRTH' ? 'date' : 'text'}
              name={field}
              placeholder={field}
              value={value}
              onChange={handleInputChange}
              className='block mb-2 p-4 w-full text-black rounded-lg'
            />
          ))}
          <button className='bg-white p-4 text-black mb-4 rounded-lg w-full'>Birth Location</button>
          <button className='bg-white p-4 text-black mb-4 rounded-lg w-full'>Residence Location</button>
          <br></br>
          {connectedWalletAddress && (
            <button id="connected-wallet-address" className='bg-black p-4 text-gray mb-4 rounded-lg'>
              {connectedWalletAddress}
            </button>
          )}
          <br></br>
          <button onClick={handleMint} className='bg-white p-4 text-black mb-4 rounded-lg w-full'>
            Mint
          </button>
        </div>
      )}
    </div>
  );
}
