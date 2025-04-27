const fetch = require('node-fetch').default; // Use require, not import
const { spawn } = require('child_process');

class GraniteLLMService {
  constructor() {
    console.log('LLM Service initialized');
  }

  async generateLootItem() {
    const rarityLevels = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
    const rarity = rarityLevels[Math.floor(Math.random() * rarityLevels.length)];

    const prompt = `Generate a fantasy game item with the following format:
    Name: [creative name for a ${rarity.toLowerCase()} item]
    Type: [weapon/armor/accessory/consumable]
    Rarity: ${rarity}
    Stats: [brief stats description]
    Backstory: [brief but compelling 2-3 sentence backstory]
    
    Make it concise but creative and fitting for the ${rarity.toLowerCase()} rarity level.`;

    try {
      const response = await this.callOllama(prompt);
      return this.parseItemResponse(response);
    } catch (error) {
      console.error('Error generating loot item:', error);
      return {
        name: `${rarity} Adventurer's Tool`,
        type: 'Weapon',
        rarity: rarity,
        stats: 'Basic stats appropriate for the rarity level',
        backstory: 'A standard item with no remarkable history.'
      };
    }
  }

  async callOllama(prompt) {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gemma3:4b-it-q4_K_M', // <-- make sure you have this model in Ollama
        prompt: prompt,
        stream: false
      })
    });

    const data = await response.json();
    console.log('Response from Ollama:', data.response);
    return data.response;  // <-- you were missing return here
  }

  async queryOllama(prompt) {
    return new Promise((resolve, reject) => {
      const ollama = spawn('ollama', ['run', 'granite', prompt]);

      let output = '';

      ollama.stdout.on('data', (data) => {
        output += data.toString();
      });

      ollama.stderr.on('data', (data) => {
        console.error(`Ollama Error: ${data}`);
      });

      ollama.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Ollama process exited with code ${code}`));
        }
      });
    });
  }

  parseItemResponse(response) {
    const nameMatch = response.match(/Name:\s*(.*?)(?:\n|$)/);
    const typeMatch = response.match(/Type:\s*(.*?)(?:\n|$)/);
    const rarityMatch = response.match(/Rarity:\s*(.*?)(?:\n|$)/);
    const statsMatch = response.match(/Stats:\s*(.*?)(?:\n|$)/);
    const backstoryMatch = response.match(/Backstory:\s*([\s\S]*)/);

    return {
      name: nameMatch ? nameMatch[1].trim() : 'Mysterious Item',
      type: typeMatch ? typeMatch[1].trim() : 'Unknown',
      rarity: rarityMatch ? rarityMatch[1].trim() : 'Common',
      stats: statsMatch ? statsMatch[1].trim() : 'Unknown stats',
      backstory: backstoryMatch ? backstoryMatch[1].trim() : 'This item has a mysterious past.'
    };
  }
}

module.exports = GraniteLLMService;
