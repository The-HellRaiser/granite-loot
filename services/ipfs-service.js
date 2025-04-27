require('dotenv').config();
const pinataSDK = require('@pinata/sdk');

class IPFSService {
  constructor() {
    this.pinata = new pinataSDK({
      pinataApiKey: "c5d0862ec6084de14f4d",
      pinataSecretApiKey: "d5b1ff005227ea66d7b8f3bc7f6fcc3460599ca2034d8a4159f59774a570c4ed"
    });
  }

  async testConnection() {
    try {
      const response = await this.pinata.testAuthentication();
      console.log('Pinata connection successful:', response);
      return true;
    } catch (error) {
      console.error('Pinata connection failed:', error);
      return false;
    }
  }

  async uploadMetadata(metadata) {
    try {
      // Generate a random image URL as placeholder
      const imageId = Math.floor(Math.random() * 1000);
      metadata.image = `https://picsum.photos/seed/${imageId}/400/400`;
      
      const options = {
        pinataMetadata: {
          name: `GraniteLoot-${metadata.name.replace(/\s+/g, '-')}`
        }
      };

      const result = await this.pinata.pinJSONToIPFS(metadata, options);
      console.log('Metadata uploaded to IPFS:', result);
      return result.IpfsHash;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  }
}

module.exports = IPFSService;