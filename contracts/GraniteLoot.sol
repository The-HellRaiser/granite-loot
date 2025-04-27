// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GraniteLoot {
    uint256 private _tokenIdCounter;
    address private _owner;
    
    // Basic NFT structure
    struct NFT {
        string tokenURI;
        string rarity;
        address owner;
    }
    
    // Mapping from token ID to NFT data
    mapping(uint256 => NFT) private _nfts;
    
    // Mapping from owner to token count
    mapping(address => uint256) private _balances;
    
    // Event emitted when a new loot item is minted
    event LootMinted(uint256 indexed tokenId, address indexed owner, string rarity);
    
    constructor() {
        _owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == _owner, "Not the contract owner");
        _;
    }
    
    function mintLoot(address player, string memory metadataURI, string memory rarity) public returns (uint256) {
        require(bytes(rarity).length > 0, "Rarity cannot be empty");
        
        uint256 newItemId = _tokenIdCounter + 1;
        _tokenIdCounter = newItemId;
        
        // Store the NFT data
        _nfts[newItemId] = NFT({
            tokenURI: metadataURI,
            rarity: rarity,
            owner: player
        });
        
        // Update owner's balance
        _balances[player] += 1;
        
        emit LootMinted(newItemId, player, rarity);
        
        return newItemId;
    }
    
    function getRarity(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Query for nonexistent token");
        return _nfts[tokenId].rarity;
    }
    
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Query for nonexistent token");
        return _nfts[tokenId].tokenURI;
    }
    
    function balanceOf(address owner) public view returns (uint256) {
        return _balances[owner];
    }
    
    function ownerOf(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "Query for nonexistent token");
        return _nfts[tokenId].owner;
    }
    
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _nfts[tokenId].owner != address(0);
    }
    
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
}
