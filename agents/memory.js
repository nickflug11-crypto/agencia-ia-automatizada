// Memória compartilhada: é aqui que o "time" de agentes fica mais inteligente com o uso.
// Cada execução lê o histórico antes de agir e grava o que aprendeu depois.
const fs = require("fs");
const path = require("path");

const STORE_PATH = path.join(__dirname, "..", "memory", "store.json");

function loadMemory() {
  if (!fs.existsSync(STORE_PATH)) {
    return { posts: [], learnings: [] };
  }
  return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
}

function saveMemory(memory) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(memory, null, 2), "utf-8");
}

// Adiciona uma observação livre que qualquer agente pode registrar
// (ex: "artigos com listas numeradas tiveram QA mais rápido")
function addLearning(memory, text) {
  memory.learnings.push({ text, date: new Date().toISOString() });
  // mantém só os 50 aprendizados mais recentes para não crescer sem limite
  memory.learnings = memory.learnings.slice(-50);
}

module.exports = { loadMemory, saveMemory, addLearning };
