// Agente de SEGURANÇA: checagens determinísticas (não usa a API, é rápido e confiável).
// Roda depois do QA, como última barreira antes de publicar.

const SECRET_PATTERNS = [
  /sk-ant-[a-zA-Z0-9-_]{10,}/, // chave da API Anthropic
  /sk-[a-zA-Z0-9]{20,}/, // chaves genéricas estilo OpenAI
  /-----BEGIN [A-Z ]+PRIVATE KEY-----/,
];

// Termos que indicam promessas exageradas/enganosas que não queremos publicar
const RISKY_CLAIM_PATTERNS = [
  /garant(imos|ido|ia).{0,20}(lucro|dinheiro|resultado)/i,
  /ganhe? \$?\d+.{0,15}(por dia|por hora) sem esforço/i,
  /renda passiva garantida/i,
];

function securityCheck(text) {
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(text)) {
      return { safe: false, reason: "Possível vazamento de credencial/segredo detectado no conteúdo." };
    }
  }

  for (const pattern of RISKY_CLAIM_PATTERNS) {
    if (pattern.test(text)) {
      return { safe: false, reason: "Conteúdo contém promessa enganosa/exagerada e foi bloqueado." };
    }
  }

  if (text.length > 20000) {
    return { safe: false, reason: "Conteúdo excede o tamanho máximo permitido (possível erro de geração)." };
  }

  return { safe: true, reason: "OK" };
}

module.exports = { securityCheck };
