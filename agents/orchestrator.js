const config = require("../config");
const { loadMemory, saveMemory, addLearning } = require("./memory");
const { chooseTopic } = require("./planner");
const { writeArticle } = require("./writer");
const { reviewArticle } = require("./qa");
const { securityCheck } = require("./security");
const { publishArticle } = require("./publisher");

async function run() {
  const memory = loadMemory();

  for (let i = 0; i < config.MAX_ARTICLES_PER_RUN; i++) {
    console.log("\n=== Rodada de publicação", i + 1, "===");

    console.log("[Planejador] Escolhendo tema...");
    const topic = await chooseTopic(memory);
    console.log("[Planejador] Tema escolhido:", topic);

    console.log("[Redator] Escrevendo artigo...");
    const draft = await writeArticle(topic);

    console.log("[QA] Revisando artigo...");
    const qaResult = await reviewArticle(draft);
    if (!qaResult.approved) {
      console.log("[QA] REPROVADO:", qaResult.reason);
      addLearning(memory, `Tema "${topic}" foi reprovado no QA: ${qaResult.reason}`);
      saveMemory(memory);
      continue;
    }
    console.log("[QA] Aprovado:", qaResult.reason);

    console.log("[Segurança] Verificando conteúdo...");
    const secResult = securityCheck(draft);
    if (!secResult.safe) {
      console.log("[Segurança] BLOQUEADO:", secResult.reason);
      addLearning(memory, `Tema "${topic}" foi bloqueado pela Segurança: ${secResult.reason}`);
      saveMemory(memory);
      continue;
    }
    console.log("[Segurança] OK");

    console.log("[Publicador] Publicando...");
    const slug = publishArticle(topic, draft);
    console.log("[Publicador] Publicado como:", slug);

    memory.posts.push({ topic, slug, date: new Date().toISOString() });
    addLearning(memory, `Tema "${topic}" foi publicado com sucesso.`);
    saveMemory(memory);
  }

  console.log("\nExecução concluída.");
}

run().catch((err) => {
  console.error("Erro fatal no orquestrador:", err);
  process.exit(1);
});
