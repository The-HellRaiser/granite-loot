require('dotenv').config();
const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const { mnemonicGenerate } = require('@polkadot/util-crypto');

class PolkadotService {
  constructor() {
    this.api = null;
    this.account = null;
  }

  async initialize() {
    try {
      // Connect to Westend testnet
      const wsProvider = new WsProvider('wss://westend-rpc.polkadot.io');
      this.api = await ApiPromise.create({ provider: wsProvider });
      
      // Set up account from seed
      const keyring = new Keyring({ type: 'sr25519' });
      const seed = process.env.WESTEND_ACCOUNT_SEED || mnemonicGenerate();
      
      if (!process.env.WESTEND_ACCOUNT_SEED) {
        console.log('No seed provided, generated new mnemonic:', seed);
        console.log('Please fund this account on Westend and add the seed to your .env file');
      }
      
      this.account = keyring.addFromMnemonic(seed);
      
      console.log('Connected to Polkadot Westend testnet');
      console.log('Account address:', this.account.address);
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Polkadot connection:', error);
      return false;
    }
  }

  async getBalance() {
    if (!this.api || !this.account) {
      throw new Error('Polkadot service not initialized');
    }
    
    const { data: balance } = await this.api.query.system.account(this.account.address);
    return balance.free.toHuman();
  }

  async mintNFT(recipientAddress, metadataURI, itemRarity) {
    // For this demo, we'll simulate the NFT minting on Asset Hub
    // In a real implementation, you would interact with the Contracts pallet
    // or use a cross-chain message to the Asset Hub
    
    console.log(`Simulating NFT mint to ${recipientAddress}`);
    console.log(`Metadata URI: ${metadataURI}`);
    console.log(`Item Rarity: ${itemRarity}`);
    
    // Create a mock transaction result
    const mockTxHash = Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    
    return {
      success: true,
      txHash: `0x${mockTxHash}`,
      recipient: recipientAddress,
      metadataURI: metadataURI
    };
  }
}

module.exports = PolkadotService;