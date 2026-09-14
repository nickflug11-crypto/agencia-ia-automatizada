// Configuração central do negócio automatizado.
// Edite estes valores para mudar o nicho, o produto vendido e os limites de segurança.
module.exports = {
  NICHE: "produtividade e automação com IA para pequenos negócios e autônomos",
  SITE_NAME: "Automação Fácil",
  SITE_URL: "https://SEU-USUARIO.github.io/SEU-REPO", // troque depois de publicar no GitHub Pages
  PRODUCT_NAME: "Kit de Prompts e Automações para o seu Negócio",
  PRODUCT_URL: "https://seunome.gumroad.com/l/seu-produto", // cole aqui o link do seu produto no Gumroad
  PRODUCT_PRICE_HINT: "R$ 47",

  // Limites de segurança/orçamento por execução do agente
  MAX_ARTICLES_PER_RUN: 1,
  MAX_OUTPUT_TOKENS_PER_ARTICLE: 2000,
  MIN_WORD_COUNT: 500,
  MAX_WORD_COUNT: 1500,

  // Modelo usado pelos agentes (troque se quiser usar outro)
  MODEL: "claude-sonnet-4-6",
};
