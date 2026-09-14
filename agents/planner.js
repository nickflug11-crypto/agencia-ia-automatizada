const { client } = require("./client");
const config = require("../config");

async function chooseTopic(memory) {
  const usedTopics = memory.posts.map((p) => p.topic).join("; ") || "nenhum ainda";
  const learnings = memory.learnings.map((l) => `- ${l.text}`).join("\n") || "nenhum ainda";

  const response = await client.messages.create({
    model: config.MODEL,
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: `Você é o agente PLANEJADOR de um time de conteúdo sobre "${config.NICHE}".

Temas já publicados (não repita): ${usedTopics}

Aprendizados registrados pelo time até agora:
${learnings}

Escolha UM tema novo, específico e útil para o próximo artigo do blog, pensando em atrair leitores que possam comprar o produto "${config.PRODUCT_NAME}".
Responda APENAS com o título do tema, sem explicações, sem aspas.`,
      },
    ],
  });

  return response.content[0].text.trim();
}

module.exports = { chooseTopic };
