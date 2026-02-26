# Testes ponta a ponta — `@schenkerjon/ng-govbr-tw`

Exercitam a biblioteca **pela tela**, no Storybook buildado. Cobrem o que build
verde e teste unitário não pegam.

## Por que existem

Defeitos reais motivaram a suíte, todos invisíveis para o unitário:

1. **11 dos 64 componentes nunca eram renderizados** em lugar nenhum — entre
   eles o sistema de toast inteiro, que tinha 13 testes unitários e nunca foi
   montado. Peça testada isoladamente que nunca roda junto não está provada.
2. **O tema de alto contraste não alcançava 11 componentes.** Compilava, passava
   no unitário, e toast/modal/mensagens simplesmente não mudavam de cor.
3. **O submenu da barra de menu não abria por clique** para quem usa mouse: o
   ponteiro passa por cima antes, o `mouseenter` abria e o clique fechava.
   Este foi encontrado *por* esta suíte.
4. **Três violações sérias de acessibilidade ficaram escondidas por falta de
   story**: `aria-controls` apontando para id inexistente no header, `<li>`
   fora de lista no mega-menu e nome acessível que não continha o texto
   visível. O axe rodava limpo porque os componentes com defeito não
   apareciam em lugar nenhum.

## Rodar

```bash
# 1) buildar a lib e o Storybook (a suíte testa o BUILD, não o dev server)
cd .. && npm run build && npx ng run ng-govbr-tw:build-storybook

# 2a) nativo
cd testes && npm install && npx playwright install chromium
npx playwright test

# 2b) por container (sempre a partir de testes/)
docker compose run --rm e2e
```

Contra um servidor já de pé: `BASE_URL=http://localhost:14741 npx playwright test`.

## O que cada arquivo prova

| Arquivo | Prova |
|---|---|
| `cobertura.spec.ts` | **Todo componente exportado é renderizado por alguma story.** A lista sai do `public-api.ts`, não é digitada: componente novo entra no teste sozinho. E componente composto precisa mostrar as PARTES — `<br-tab>` já teve story renderizando casca vazia |
| `storybook.spec.ts` | Toda story renderiza sem erro de runtime, cabe em 360/768/1280px e passa no axe sem violação séria ou crítica |
| `interacoes.spec.ts` | Comportamento: toast aparece e some sozinho, focus trap do modal, contraste sobrevive ao F5, skiplink é o primeiro foco, accordion e abas |
| `contraste.spec.ts` | Cada classe de token muda de cor no alto contraste, medido em **pixel** (canvas 1×1) — e as variáveis `--govbr-*` existem na página |
| `invisivel.spec.ts` | Nos dois temas, nenhum texto ou ícone fica pintado da cor do próprio fundo |
| `descricao-acessivel.spec.ts` | Texto de apoio e de erro é ANUNCIADO, não só pintado: `aria-describedby`, `aria-invalid` e `role="alert"` |
| `camada.spec.ts` | Painel flutuante não é recortado por ancestral com `overflow`, e tem z-index que não perde dos outros overlays |
| `tailwind.spec.ts` | Toda classe `govbr-*` compila no Tailwind 3 **e** no 4, rodando os dois compiladores de verdade |
| `ng-add.spec.ts` | O schematic escreve a configuração certa para cada major do Tailwind, e rodar duas vezes não duplica nada |

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
- **`elementFromPoint` não julga se uma camada aparece.** Tooltip usa
  `pointer-events: none` de propósito e o navegador devolve o que está atrás.
  A prova é o pixel.
- **O tema entra pelo global do Storybook, não forçando a classe no `<html>`.**
  O decorator põe a classe E pinta o fundo com o token; forçar só a classe
  deixa texto escuro sobre fundo claro e acusa defeito que é do harness.
- **Efeito com transição precisa de espera antes da medida.** Ler a cor no
  instante da troca de tema mede a animação pela metade.
- **Playwright exige o browser da versão dele.** `npx playwright install chromium`
  — um Chromium qualquer no PATH não serve.
- **Dois pacotes podem disputar o mesmo nome em `node_modules/.bin`.** Em
  `tailwind.spec.ts` o CLI do v4 era mascarado pelo do v3; cada compilador é
  chamado pelo caminho do próprio pacote.
