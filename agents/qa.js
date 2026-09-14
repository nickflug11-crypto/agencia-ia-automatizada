const { client } = require("./client");
const config = require("../config");

function countWords(text) {
  return text.trim().split(/\s+/).length;
}

async function reviewArticle(draft) {
  // 1) Checagens programáticas rápidas, sem gastar tokens de API
  const wordCount = countWords(draft);
  if (wordCount < config.MIN_WORD_COUNT * 0.7) {
    return { approved: false, reason: `Artigo muito curto (${wordCount} palavras).` };
  }
  if (!draft.includes(config.PRODUCT_URL)) {
    return { approved: false, reason: "Artigo não contém o link do produto." };
  }
  if (/\[TODO\]|lorem ipsum/i.test(draft)) {
    return { approved: false, reason: "Artigo contém texto de placeholder." };
  }

  // 2) Revisão qualitativa feita por um agente especialista em QA
  const response = await client.messages.create({
    model: config.MODEL,
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: `Você é o agente de QA (controle de qualidade) de um time editorial.
Avalie o artigo abaixo quanto a: clareza, utilidade prática, se não faz afirmações
factuais duvidosas/inventadas, e se está coerente do início ao fim.

Responda em uma única linha no formato exato:
APROVADO: <motivo curto>
ou
REPROVADO: <motivo curto>

Artigo:
"""
${draft}
"""`,
      },
    ],
  });

  const verdict = response.content[0].text.trim();
  const approved = verdict.toUpperCase().startsWith("APROVADO");
  return { approved, reason: verdict };
}

module.exports = { reviewArticle };
