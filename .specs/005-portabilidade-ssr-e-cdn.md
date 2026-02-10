# 005 — Portabilidade: SSR e CDN embutido

**Entra em:** 1.3.0

Os dois defeitos desta spec têm a mesma assinatura: **não aparecem no desenvolvimento,
aparecem no cliente** — e o cliente desta lib é órgão público.

## 5.1 CDN dentro do CSS publicado

Medido em 10/10/2026 (`sed -n '1,10p' projects/ng-govbr-tw/src/lib/styles/govbr-tw.css`):

```css
/* Fonte Rawline via CDN SERPRO */
@import url('https://cdngovbr-ds.estaleiro.serpro.gov.br/design-system/fonts/rawline/css/rawline.css');

/* Font Awesome 6 — icons Gov.br DS */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
```

Problemas, em ordem de gravidade:

1. **Intranet sem saída para internet ou CSP restritiva**: fonte e ícones morrem em
   silêncio. A tela carrega, o layout não quebra visivelmente — só a tipografia do Gov.br
   deixa de ser a do Gov.br e os ícones viram quadrados. Falha calada é o pior tipo.
2. **Carregamento em dobro**: o `ng-add` também injeta os mesmos `<link>` no `index.html`
   (`schematics/ng-add/index.ts:15`, bloco de fontes). Instalação padrão baixa Rawline e
   Font Awesome duas vezes.
3. **Terceiro no caminho crítico**: `cdnjs.cloudflare.com` dentro do CSS da lib é
   dependência de runtime que o consumidor não escolheu e não controla.

### O que implementar

- **Remover os dois `@import url(...)`** do `govbr-tw.css`.
- Manter a declaração `font-family` com cadeia de fallback (`'Rawline', 'Raleway',
  sans-serif` — já está no preset) para degradar com elegância.
- O `ng-add` passa a ser o **único** lugar que oferece as fontes, e com escolha:
  `--skipFonts` já existe; acrescentar na mensagem final do schematic a instrução de
  auto-hospedagem para ambiente sem internet.
- Documentar no README: seção "Ambiente sem acesso à internet", com o que baixar e onde
  colocar.

**Critério de aceite:** `grep -c '@import url' .../govbr-tw.css` → 0. E a prova real:
build do demo com a rede bloqueada não deve apresentar requisição a CDN partindo do CSS
da lib.

## 5.2 Guardas de plataforma (SSR)

Medido em 10/10/2026:

```bash
grep -rc 'isPlatformBrowser\|PLATFORM_ID' --include='*.ts' projects/ng-govbr-tw/src
# nenhum arquivo casa — ZERO guardas

grep -rn 'window\.\|document\.' --include='*.ts' projects/ng-govbr-tw/src/lib | grep -v '//'
# 4 ocorrências em 3 arquivos
```

| Arquivo:linha | Acesso |
|---|---|
| `animations/animation.service.ts:197` | `window.matchMedia` (detecção de `prefers-reduced-motion`) |
| `components/select/br-select.component.ts:319` | `document.activeElement` |
| `components/header/br-header.component.ts:382` | `document.documentElement` (toggle de contraste) |
| `components/header/br-header.component.ts:408` | `window.scrollY` (header compacto no scroll) |

São **poucas e localizadas** — o conserto é pequeno. Mas em Angular Universal/SSR cada
uma derruba a renderização no servidor, e portal de governo usa SSR com frequência (SEO e
tempo até primeiro conteúdo são requisito em portal público).

### O que implementar

- Injetar `PLATFORM_ID` e guardar os 4 acessos com `isPlatformBrowser(this.platformId)`.
- `window.matchMedia` sem browser: assumir `prefers-reduced-motion: no-preference` no
  servidor e re-avaliar no cliente, **não** desligar animação permanentemente.
- `window.scrollY`: o listener de scroll só se registra no browser; no servidor o header
  renderiza no estado não-compacto.
- O toggle de contraste do header move para um **`BrContrastService`** (ver 5.3) — tirar
  `document.documentElement` de dentro de um componente visual resolve SSR e SRP de uma vez.

**Critério de aceite:** `grep -rc 'isPlatformBrowser' .../src/lib` cobre os 3 arquivos, e
nenhum acesso a `window.`/`document.` fica fora de guarda. Prova forte (se houver tempo):
`ng add @angular/ssr` num app de teste e renderizar os 3 componentes no servidor.
Prova mínima: teste unitário com `PLATFORM_ID` fornecido como `'server'`.

## 5.3 `BrContrastService` e persistência do tema

Dois defeitos ligados, medidos:

- **O contraste não persiste**: nenhum `localStorage` na lib
  (`grep -rc localStorage projects/ng-govbr-tw/src` → nenhum arquivo). Usuário liga o
  alto contraste, recarrega a página, perdeu. Para quem depende de alto contraste isso não
  é inconveniência, é a funcionalidade não existir.
- **Só dá para alternar via `br-header`**: `toggleContrast()` em
  `br-header.component.ts:380-382` mexe em `document.documentElement` direto, e não há
  service exportado. App que não usa o header da lib não tem como ligar o tema.

### O que implementar

`BrContrastService` exportado no `public-api.ts`, com:

- `isEnabled` (signal ou `BehaviorSubject`), `enable()`, `disable()`, `toggle()`
- persistência em `localStorage` sob chave namespaced (`govbr-tw.contrast`), **guardada
  por `isPlatformBrowser`**
- leitura do estado salvo na inicialização
- `br-header` passa a **consumir** o service em vez de manipular o DOM; o `aria-pressed`
  do botão (hoje correto em `:115-116`) passa a refletir o estado do service

**Critério de aceite:** teste que liga o contraste, recria o service e confirma que o
estado voltou; e prova na tela — ligar contraste no showcase, F5, contraste continua.
