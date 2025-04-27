const { ethers } = require('ethers');

async function checkBalance(address) {
  const provider = new ethers.JsonRpcProvider(
    'https://westend-asset-hub-eth-rpc.polkadot.io',
    {
      chainId: 420420421,
      name: 'Westend Asset Hub'
    }
  );

  try {
    const balance = await provider.getBalance(address);
    console.log(`Balance for ${address}:`);
    console.log(`${ethers.formatEther(balance)} ETH`);
  } catch (error) {
    console.error('Error checking balance:', error);
  }
}

// Check balance for the specified address
checkBalance('0xBe7E1AA6C0A50F3f6Cc03FDc5F7a8fd1f855ab55');