const { client } = require("./client");
const config = require("../config");

async function writeArticle(topic) {
  const response = await client.messages.create({
    model: config.MODEL,
    max_tokens: config.MAX_OUTPUT_TOKENS_PER_ARTICLE,
    messages: [
      {
        role: "user",
        content: `Você é o agente REDATOR especialista em "${config.NICHE}".

Escreva um artigo de blog em português (Brasil) sobre: "${topic}"

Regras:
- Entre ${config.MIN_WORD_COUNT} e ${config.MAX_WORD_COUNT} palavras.
- Formato Markdown, com um título H1, subtítulos H2, e parágrafos curtos.
- Tom prático e direto, com exemplos aplicáveis a pequenos negócios.
- Não invente estatísticas, nomes de estudos ou fontes que você não tem certeza que existem.
- Termine com uma seção curta "## Quer ir além?" convidando o leitor a conhecer o produto
  "${config.PRODUCT_NAME}" (sem inventar preço nem promessas exageradas), com um link em Markdown
  usando exatamente esta URL: ${config.PRODUCT_URL}

Responda APENAS com o conteúdo do artigo em Markdown, nada além disso.`,
      },
    ],
  });

  return response.content[0].text.trim();
}

module.exports = { writeArticle };
