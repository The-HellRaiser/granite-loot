// deploy-contract.js
require('dotenv').config();
const { join } = require('path');
const { ethers } = require('ethers');
const { readFileSync, writeFileSync, existsSync } = require('fs');

// RPC configuration for Westend Asset Hub
const PROVIDER_RPC = {
  rpc: 'https://westend-asset-hub-eth-rpc.polkadot.io',
  chainId: 420420421,
  name: 'Westend Asset Hub'
};

// Create provider helper function
const createProvider = (rpcUrl, chainId, networkName) => {
  return new ethers.JsonRpcProvider(
    rpcUrl,
    {
      chainId: chainId,
      name: networkName
    }
  );
};

// Get ABI helper function
const getAbi = (contractName) => {
  try {
    return JSON.parse(
      readFileSync(
        join(__dirname, 'abis', `${contractName}.json`),
        'utf8'
      )
    );
  } catch (error) {
    console.error(`Could not find ABI for ${contractName}:`, error.message);
    throw error;
  }
};

// Get bytecode helper function
const getBytecode = (contractName) => {
  try {
    const bytecode = readFileSync(
      join(__dirname, 'artifacts', `${contractName}.polkavm`)
    );
    return `0x${bytecode.toString('hex')}`;
  } catch (error) {
    console.error(`Could not find bytecode for ${contractName}:`, error.message);
    throw error;
  }
};

async function deployContract() {
  console.log('Deploying GraniteLoot contract to Westend Asset Hub...');

  try {
    // Set up provider and wallet
    const provider = createProvider(
      PROVIDER_RPC.rpc,
      PROVIDER_RPC.chainId,
      PROVIDER_RPC.name
    );

    if (!process.env.WESTEND_ACCOUNT_SEED) {
      throw new Error('WESTEND_ACCOUNT_SEED not found in .env file');
    }

    const wallet = ethers.Wallet.fromPhrase(process.env.WESTEND_ACCOUNT_SEED);
    const signer = wallet.connect(provider);

    // Get contract artifacts
    const abi = getAbi('GraniteLoot');
    const bytecode = getBytecode('GraniteLoot');

    // Create and deploy contract
    console.log('Creating contract factory...');
    const factory = new ethers.ContractFactory(abi, bytecode, signer);

    console.log('Deploying contract...');
    const contract = await factory.deploy();
    console.log('Waiting for deployment...');
    await contract.waitForDeployment();

    // Get contract address
    const address = await contract.getAddress();
    console.log('Contract deployed to:', address);

    // Save contract address
    const deploymentInfo = {
      address,
      chainId: PROVIDER_RPC.chainId,
      network: PROVIDER_RPC.name,
      deploymentDate: new Date().toISOString()
    };

    writeFileSync(
      join(__dirname, 'contracts', 'deployment.json'),
      JSON.stringify(deploymentInfo, null, 2)
    );

    return address;
  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  }
}

// Run deployment if script is executed directly
if (require.main === module) {
  deployContract().catch(console.error);
}

module.exports = { deployContract };