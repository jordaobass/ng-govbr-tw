# Imagem oficial do Playwright: já traz o Chromium na versão exata do runner.
# Instalar navegador por fora é a receita para "funciona na minha máquina" —
# aqui a versão do browser e a da biblioteca vêm casadas.
FROM mcr.microsoft.com/playwright:v1.64.0-noble

WORKDIR /app/testes

# Dependências primeiro: camada que só invalida quando o lockfile muda.
COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY playwright.config.ts ./
COPY e2e ./e2e

# O alvo é o BUILD do demo, montado em /app/dist pelo compose.
# Rodar contra `ng serve` seria testar algo que ninguém usa.
ENV CI=true

CMD ["npx", "playwright", "test"]
