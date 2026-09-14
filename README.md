# Agência de Conteúdo Automatizada (time de agentes de IA)

Este projeto é um pequeno "time" de agentes de IA que trabalha sozinho, toda semana, para:
1. **Planejar** um novo tema de artigo (evitando repetir temas antigos).
2. **Escrever** o artigo completo.
3. **Revisar a qualidade** (QA) — reprova artigos fracos ou incoerentes.
4. **Checar segurança** — bloqueia vazamento de chaves ou promessas enganosas.
5. **Publicar** o artigo no seu site, com um link para o seu produto digital.
6. **Guardar aprendizados** numa memória compartilhada (`memory/store.json`) que todos os agentes consultam na próxima execução.

Tudo isso roda **de graça**, automaticamente, via GitHub Actions — você não precisa ficar postando nada.

## O que este sistema NÃO faz (seja realista)

- Não cria a conta que recebe o dinheiro por você — isso é intencional: você pediu para cuidar só da parte financeira.
- Não gera tráfego/vendas magicamente. Ele produz o conteúdo e publica sozinho; o quanto ele vende depende do nicho, da qualidade do produto e do SEO ao longo do tempo. Trate isso como uma máquina de conteúdo, não como uma garantia de renda.
- Não substitui você decidir se o produto que está sendo vendido é algo que você realmente quer oferecer. Revise os primeiros artigos antes de divulgar o site.

## Passo a passo para colocar no ar (uns 20 minutos, só uma vez)

### 1. Criar o repositório no GitHub (grátis)
- Crie uma conta no [GitHub](https://github.com) se não tiver.
- Crie um repositório novo e envie todos estes arquivos para ele.

### 2. Adicionar sua chave da API da Anthropic
- Pegue uma chave em [console.anthropic.com](https://console.anthropic.com).
- No repositório: **Settings → Secrets and variables → Actions → New repository secret**
- Nome: `ANTHROPIC_API_KEY` — Valor: sua chave.
- Isso é necessário pois os agentes usam o modelo Claude para pensar. Cada artigo gerado custa poucos centavos — confira o preço atual em [docs.claude.com](https://docs.claude.com).

### 3. Publicar o site automaticamente (GitHub Pages, grátis)
- No repositório: **Settings → Pages → Source: "GitHub Actions"** (ou aponte para a pasta `site/dist` na branch principal).
- Alternativa mais simples: conecte o repositório à [Vercel](https://vercel.com) (grátis) apontando a pasta de build para `site/dist` — ela publica sozinha a cada novo commit.

### 4. Criar seu produto digital e receber pagamentos
- Crie uma conta grátis no [Gumroad](https://gumroad.com) (ou Hotmart/Kiwify, se preferir uma plataforma brasileira).
- Cadastre o produto que você vai vender (ex: um e-book, kit de templates, checklist).
- Copie o link do produto e cole em `config.js`, no campo `PRODUCT_URL`.
- **Este é o único passo onde o dinheiro passa pela sua mão** — o Gumroad recebe o pagamento e transfere para sua conta bancária. Nenhum agente tem acesso a isso.

### 5. Testar manualmente antes de deixar automático
No repositório do GitHub, vá em **Actions → Publicar artigo automático → Run workflow** para rodar uma vez na mão e ver o resultado antes de confiar na automação semanal.

## Personalizando

Edite `config.js` para mudar:
- `NICHE` — sobre o que o blog fala.
- `PRODUCT_NAME` / `PRODUCT_URL` — o que está sendo vendido.
- `MAX_ARTICLES_PER_RUN` — quantos artigos por execução.
- O agendamento (`cron`) está em `.github/workflows/publish.yml` — hoje é semanal, às segundas.

## Rodando localmente (para testar antes de subir pro GitHub)

```bash
npm install
cp .env.example .env   # edite e cole sua chave
node -r dotenv/config agents/orchestrator.js
node scripts/build-site.js
```

Abra `site/dist/index.html` no navegador para ver o resultado.

## Estrutura dos agentes

| Agente | Arquivo | Função |
|---|---|---|
| Planejador | `agents/planner.js` | Escolhe o próximo tema |
| Redator | `agents/writer.js` | Escreve o artigo |
| QA | `agents/qa.js` | Aprova ou reprova o conteúdo |
| Segurança | `agents/security.js` | Bloqueia vazamentos e promessas enganosas |
| Publicador | `agents/publisher.js` | Salva o artigo no site |
| Memória | `agents/memory.js` | Compartilha o histórico entre todos os agentes |
| Orquestrador | `agents/orchestrator.js` | Coordena a ordem de todos acima |
