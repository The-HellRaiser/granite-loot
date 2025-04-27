const { compile } = require('@parity/revive');
const { readFileSync, writeFileSync, mkdirSync, existsSync } = require('fs');
const { basename, join } = require('path');

const compileContract = async (solidityFilePath, outputDir) => {
  try {
    // Ensure output directories exist
    const abiDir = join(outputDir, 'abis');
    const artifactsDir = join(outputDir, 'artifacts');
    
    if (!existsSync(abiDir)) mkdirSync(abiDir, { recursive: true });
    if (!existsSync(artifactsDir)) mkdirSync(artifactsDir, { recursive: true });

    // Read the Solidity file
    const source = readFileSync(solidityFilePath, 'utf8');
    const contractName = basename(solidityFilePath, '.sol');

    console.log(`Compiling contract: ${contractName}...`);

    // Construct the input object for the compiler
    const input = {
      [basename(solidityFilePath)]: { content: source }
    };

    // Compile the contract
    const out = await compile(input);

    for (const contracts of Object.values(out.contracts)) {
      for (const [name, contract] of Object.entries(contracts)) {
        console.log(`Compiled contract: ${name}`);

        // Write the ABI
        const abiPath = join(abiDir, `${name}.json`);
        writeFileSync(abiPath, JSON.stringify(contract.abi, null, 2));
        console.log(`ABI saved to ${abiPath}`);

        // Write the bytecode
        const bytecodePath = join(artifactsDir, `${name}.polkavm`);
        writeFileSync(
          bytecodePath,
          Buffer.from(contract.evm.bytecode.object, 'hex')
        );
        console.log(`Bytecode saved to ${bytecodePath}`);
      }
    }

    return true;
  } catch (error) {
    console.error('Error compiling contracts:', error);
    throw error;
  }
};

// Run compilation if script is executed directly
if (require.main === module) {
  const contractPath = join(__dirname, '..', 'contracts', 'GraniteLoot.sol');
  compileContract(contractPath, join(__dirname, '..')).catch(console.error);
}

module.exports = { compileContract };