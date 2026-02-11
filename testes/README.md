# Testes ponta a ponta — `@schenkerjon/ng-govbr-tw`

Exercitam a biblioteca **pela tela**, no showcase buildado. Cobrem o que build
verde e teste unitário não pegam.

## Por que existem

Três defeitos reais motivaram a suíte, todos invisíveis para o unitário:

1. **11 dos 64 componentes nunca eram renderizados** em lugar nenhum do demo —
   entre eles o sistema de toast inteiro, que tinha 13 testes unitários e nunca
   foi montado. Peça testada isoladamente que nunca roda junto não está provada.
2. **O tema de alto contraste não alcançava 11 componentes.** Compilava, passava
   no unitário, e toast/modal/mensagens simplesmente não mudavam de cor.
3. **O submenu da barra de menu não abria por clique** para quem usa mouse: o
   ponteiro passa por cima antes, o `mouseenter` abria e o clique fechava.
   Este foi encontrado *por* esta suíte.

## Rodar

```bash
# 1) buildar a lib e o demo (a suíte testa o BUILD, não o `ng serve`)
cd .. && npx ng build ng-govbr-tw && npx ng build demo --base-href /

# 2a) nativo
cd testes && npm install && npx playwright install chromium
npx playwright test

# 2b) por container (sempre a partir de testes/)
docker compose run --rm e2e
```

Contra um servidor já de pé: `BASE_URL=http://localhost:14731 npx playwright test`.

## O que cada arquivo prova

| Arquivo | Prova |
|---|---|
| `cobertura.spec.ts` | **Todo seletor declarado na lib é renderizado no demo.** A lista sai do código-fonte, não é digitada: componente novo entra no teste sozinho, e esquecer de demonstrá-lo reprova a suíte |
| `secoes.spec.ts` | Toda seção fica visível, toda âncora da navegação aponta para um id que existe, e nenhuma seção lança erro de runtime |
| `interacoes.spec.ts` | Comportamento: toast aparece e some sozinho, focus trap do modal, contraste sobrevive ao F5, skiplink é o primeiro foco, accordion e abas |
| `contraste.spec.ts` | Cada classe de token muda de cor no alto contraste, medido em **pixel** (canvas 1×1) — e as variáveis `--govbr-*` existem na página |

## O teste do toast é o canário do `OnPush`

O toast muda estado por `setTimeout`, **fora** de evento de template — o padrão
exato que `ChangeDetectionStrategy.OnPush` quebra em silêncio: compila, passa no
unitário e some da tela.

Enquanto `interacoes.spec.ts › Toast` estiver verde, a migração para `OnPush`
(spec 002) tem rede. **Rodar esta suíte é pré-requisito daquela migração.**

## Armadilhas já pagas

- **Cor do navegador chega em `lab()`/`oklch()`.** Extrair número com regex
  produz lixo e defeito inventado. `contraste.spec.ts` resolve pelo próprio
  navegador: `ctx.fillStyle` num canvas 1×1 e `getImageData`.
- **O app redireciona `/` para `/showcase`.** Servidor estático sem fallback de
  SPA devolve 404 no `reload()`, e o teste acusa defeito que não existe — foi o
  que aconteceu ao escrever esta suíte. Daí o `--proxy` no `playwright.config.ts`;
  em produção quem resolve é o `cp index.html 404.html` do workflow de deploy.
- **Efeito com transição precisa de espera antes da medida.** Ler a cor no
  instante da troca de tema mede a animação pela metade.
- **Playwright exige o browser da versão dele.** `npx playwright install chromium`
  — um Chromium qualquer no PATH não serve.
