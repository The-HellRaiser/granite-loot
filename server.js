require('dotenv').config();
const express = require('express');
const path = require('path');
const GraniteLLMService = require('./services/llm-service');
const IPFSService = require('./services/ipfs-service');
const PolkadotService = require('./services/polkadot-service');

const app = express();
const port = process.env.PORT || 3000;

// Configure middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize services
const llmService = new GraniteLLMService();
const ipfsService = new IPFSService();
const polkadotService = new PolkadotService();

// Initialize services on startup
(async () => {
  await ipfsService.testConnection();
  await polkadotService.initialize();
})();

// API endpoints
app.post('/api/mint', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    
    // Generate loot item metadata using LLM
    console.log('Generating loot item...');
    const lootItem = await llmService.generateLootItem();
    
    // Upload metadata to IPFS
    console.log('Uploading to IPFS...');
    const ipfsHash = await ipfsService.uploadMetadata({
      name: lootItem.name,
      description: lootItem.backstory,
      attributes: [
        { trait_type: 'Type', value: lootItem.type },
        { trait_type: 'Rarity', value: lootItem.rarity },
        { trait_type: 'Stats', value: lootItem.stats }
      ]
    });
    
    const metadataURI = `ipfs://${ipfsHash}`;
    
    // Mint NFT on Polkadot Asset Hub
    console.log('Minting NFT on Polkadot Asset Hub...');
    const mintResult = await polkadotService.mintNFT(
      address,
      metadataURI,
      lootItem.rarity
    );
    
    res.json({
      success: true,
      item: lootItem,
      ipfsHash,
      metadataURI,
      mintResult
    });
  } catch (error) {
    console.error('Error in minting process:', error);
    res.status(500).json({ error: 'Failed to mint NFT', details: error.message });
  }
});

app.get('/api/balance', async (req, res) => {
  try {
    const balance = await polkadotService.getBalance();
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get balance', details: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Granite-Loot server running on port ${port}`);
});