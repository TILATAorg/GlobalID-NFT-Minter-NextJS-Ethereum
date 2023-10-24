const OpenSea = require('opensea-js');

async function mintNFT(NAME, LAST_NAME, DATE_OF_BIRTH, COUNTRY, PASSPORT, EMAIL, SITE) {
  // Create a new OpenSea client.
  const client = new OpenSea();

  // Get the account address of the user who is minting the NFT.
  const accountAddress = client.getAccountId();

  // Create a new NFT asset.
  const asset = {
    NAME,
    LAST_NAME,
    DATE_OF_BIRTH,
    COUNTRY,
    PASSPORT,
    EMAIL,
    SITE
  };

  // Mint the NFT.
  const txId = await client.mintNFT(asset, {
    chainId: 11155111, // Sepolia testnet chain ID
  });

  // Wait for the transaction to be confirmed.
  await client.waitForTransactionConfirmation(txId);

  window.location('/');

  // Return the NFT asset.
  return asset;
}
