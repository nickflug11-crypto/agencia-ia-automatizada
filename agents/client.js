const Anthropic = require("@anthropic-ai/sdk");

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ERRO: variável de ambiente ANTHROPIC_API_KEY não encontrada.");
  console.error("Configure-a como 'secret' no GitHub Actions ou no seu .env local.");
  process.exit(1);
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

module.exports = { client };
