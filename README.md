# Granite-Loot NFT Forge

Digital items already outsell physical ones in many games, yet most “loot boxes” are static JPGs or server-side JSON.
Gamers want uniqueness, provenance, and cross-game portability—publishers want new revenue streams.
Granite-Loot creates one-of-one NFTs whose lore, stats, and appearance are authored on-demand by an enterprise-grade LLM (IBM Granite) and minted on Polkadot. The result is collectible IP with built-in scarcity and verifiable ownership that can jump between games and chains.


## Description and impact of polkadot

As explained in the project summary, polkadot has got host of games that use these NFTs building process, some of the reseach doen is shared below on its impact and how gaming studios, players and designers made money.
How i used polkadot:
I used to deploy the smart contract on it, then use it to mint NFTs. Below are the expansions which will have the most impact
Potential use cases:
1. Astar already supports ink! contracts and rewards dApps that lock up ASTR. Granite-Loot NFTs minted on Asset Hub can be teleported via a one-line XCM to Astar where games can read/write them at sub-cent fees.

2. Mythical’s own chain already speaks Polkadot’s cross-para NFT format. Granite-Loot CIDs can be mirrored to Mythos for use as new cosmetics or power-ups.

3. Enjin wallets already sideload IPFS-hosted JSON (ERC-1155-like). Granite-Loot mints on Asset Hub, then pushes to Efinity via XCM to tap that tooling.



## ScreenShots :
I have added them in the canva slide so that they  are more organsied.
Also added them to screen shot folder,in the root folder

## Canva link:
https://www.canva.com/design/DAGl01FdD8E/akz-AJQUDbj81DBUYK1D5g/edit?utm_content=DAGl01FdD8E&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

## Block link:
https://assethub-westend.subscan.io/account/0xd6ddb0553c87a87c3f6b7ae0f1c10fb7ff74c342?tab=transaction

## loom video:
https://www.loom.com/share/53061e6bce594bb29cd21dcf9305287c?sid=5f7c3949-58ce-4b84-b994-7737cbe1b6cd


## Smart contract description:

The GraniteLoot contract is a lightweight, custom NFT system designed for games and collectibles, differing from standard ERC-721 templates. Instead of using full ERC-721 inheritance, it defines its own simple NFT structure with tokenURI, rarity, and owner, optimizing for low gas costs and easy metadata access. It natively supports rarity attributes and stores metadata on-chain without requiring external token standards. Unlike traditional NFTs, GraniteLoot does not implement transfer functions — ownership is assigned at minting and remains static — making it ideal for loot rewards, badges, or achievement tokens. A minimal access control (onlyOwner) is included for future extensions, and the total minted supply is easily tracked. GraniteLoot prioritizes simplicity, speed, and game-focused use cases over full marketplace trading compatibility.

## Prerequisites

- Node.js 16+
- Ollama with Granite model installed
- A funded Westend testnet account
- pinata api keys for ipfs

## Quick Start (60 min setup)

1. **Clone the repository and install dependencies**

```bash
git clone https://github.com/yourusername/granite-loot.git
cd granite-loot
npm install
```

2. **Install Ollama and the Granite model**

```bash
# Follow instructions at https://ollama.ai to install Ollama
# Then pull the Granite model
ollama pull granite3.2-vision:latest

or use any ollama model you like and modify it in llm-service, currently I dont have the compute to image/text model to generate images locally for nft, but you can do that
```

3. **Set up environment variables**

Create a `.env` file in the project root:

```
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
WESTEND_ACCOUNT_SEED=your_westend_seed_phrase
PORT=3000
```

4. **Get a Westend testnet account**

- create a meta mask wallet and then create new account apart form the dfault account and then click add custom network, use the below rpc url ,netwrok name and chain id 

westend-asset-hub-eth-rpc.polkadot.io

Westend Asset Hub
 
420420421

After setting that up use the westend faucet to get coins to your testnet  wallet

5. **Create Pinata account for IPFS**

- Sign up at https://app.pinata.cloud/
- Generate API keys and add them to your `.env` file
- make sure to give admin acccess so that you dont run in to permission issues

6. **Run the application**

```bash
node server.js
```
To compile and deploy the contract to westend use 
bash:
npm run compile && npm run deploy


7. **Open the application**

Visit `http://localhost:3000` in your browser to start minting AI-generated NFTs!

## Project Structure

```
granite-loot/
├── contracts/         # Solidity smart contracts
├── public/            # Static frontend files
├── services/          # Backend services
│   ├── llm-service.js # LLM integration for item generation
│   ├── ipfs-service.js # IPFS pinning service
│   └── polkadot-service.js # Polkadot blockchain interaction
├── server.js          # Express API server
├── .env               # Environment variables (create this)
└── README.md          # This file
```

## How It Works

1. User requests to mint a new NFT by providing their Westend address
2. Backend calls the Granite LLM (via Ollama) to generate item metadata
3. Metadata is pinned to IPFS via Pinata
4. Smart contract is deployed on the Polkadot Asset Hub (Westend testnet)
5. Transaction details and item information are returned to the user

## Troubleshooting

- **Ollama connection issues**: Ensure Ollama is running with `ollama serve`
- **Westend connection issues**: Check your account has sufficient funds
- **IPFS pinning issues**: Verify your Pinata API keys are correct
