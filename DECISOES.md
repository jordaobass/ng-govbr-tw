# Decisões — `@schenkerjon/ng-govbr-tw`

Registro único de decisões do projeto. Decisão espalhada dentro de spec vira interrupção
no meio da construção; junta, o dono decide em lote.

Estados: **decidida** · **aberta** · **dívida aceita** (decidida, com data de revisão).

---

## Decididas

| # | Decisão | Data | Onde aterrissou |
|---|---|---|---|
| D9 | **A1 (fidelidade ao DS) está resolvida.** `@govbr-ds/webcomponents-angular` 2.2.0, `@govbr-ds/webcomponents` e `@govbr-ds/core` 3.7.0 são **MIT (© 2022 SERPRO)** — lido no LICENSE do pacote instalado. Podemos copiar tokens/CSS mantendo o aviso de copyright, que já está no cabeçalho do `govbr-tw.css` | 10/10/2026 | `govbr-tw.css` |
| D10 | **Tokens alinhados ao oficial:** `success-bg` era `#d4edda` (cor do **Bootstrap**, não do Gov.br) → `#e3f5e1`; `danger-bg` `#fde0dc` → `#fde0db`. Os demais 11 tokens conferidos batem exatamente | 10/10/2026 | `govbr-tw.css`, `tailwind.preset.js` |
| D11 | **`govbr-tw.css` não embarca mais `@tailwind` nem usa `@layer`.** CSS de biblioteca com as diretivas faz todo consumidor Tailwind gerar os utilitários duas vezes. Quem declara é a aplicação | 10/10/2026 | `govbr-tw.css`, `projects/demo/src/styles.css` |
| D14 | **Anel de foco do tema claro vira `#c2850c`** (`--gold-vivid-40` do DS oficial), mantendo `solid`. O `#ffbe2e` que usávamos é o `--focus-color-dark` do DS — foco do tema escuro. Medido contra branco: `#ffbe2e` dá 1,66:1 e **reprova** a WCAG 1.4.11 (mín. 3:1); `#c2850c` dá 3,16:1. Fica mais fiel E mais acessível | 11/10/2026 | `govbr-tw.css` |
| D15 | **Easing sem overshoot:** `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quint) no token `easeOutBack` e nos usos de modal e tooltip. Fecha a A10 | 11/10/2026 | `animations/animation.types.ts`, `br-modal`, `br-tooltip` |
| D16 | **Dos 7 componentes de paridade, entram só `br-checkbox-group` e `br-icon`** — os de uso real em portal. Escritos e revisados do zero, não aproveitados do que o agente gerou. `scrim`, `tag`, `slider`, `dropdown` e `carousel` ficam de fora | 11/10/2026 | — |
| D17 | **A linha 1.x é congelada quando a 2.0.0 sair**, e isso vai escrito no README e no CHANGELOG. Sem branch de manutenção | 11/10/2026 | README |
| D18 | **Publish segue manual.** Sem workflow de CI e sem segredo `NPM_TOKEN` no repositório | 11/10/2026 | — |
| D19 | **Storybook substitui o showcase.** Vira a documentação oficial no GitHub Pages; o `showcase.component.ts` (2.940 linhas) é apagado e **os 13 testes E2E são reescritos** para mirar as stories — inclusive o canário do OnPush, que precisa de uma story disparando toast | 11/10/2026 | `testes/`, `projects/demo` |
| D20 | **Não migrar para signal inputs.** `@Input()` não está deprecado, funciona no Angular 22, e a troca quebraria acesso programático em 471 usos sem ganho que alguém tenha pedido. Reabrir só com demanda concreta de consumidor | 11/10/2026 | — |
| D21 | **Suportar Tailwind 3 e 4 lado a lado:** dois presets publicados e o `ng-add` detectando a versão do consumidor. Dobra a manutenção da parte mais frágil da lib — aceito de propósito para não deixar ninguém para trás | 11/10/2026 | `tailwind.preset.js`, `schematics/ng-add` |
| D22 | **Ordem de execução:** foco+easing → `ng-add` → DRY dos mascarados → `checkbox-group`+`icon` → Tailwind 4 → Storybook. Defeito antes de empreitada; a lib fica publicável e correta cedo | 11/10/2026 | — |
| D13 | **`peerDependencies` = `^17 \|\| ^18 \|\| ^19 \|\| ^20 \|\| ^21 \|\| ^22`**, com a lib ainda compilada no Angular 17. Os majors 20, 21 e 22 foram **provados** em apps descartáveis (instalar, compilar, renderizar e interagir), não apenas declarados. Antes disso, instalar num app Angular 21 falhava com `ERESOLVE` | 11/10/2026 | `projects/ng-govbr-tw/package.json` |
| D12 | **`br-input-money` declara a unidade** (`@Input() valueUnit`, padrão `cents`) em vez de adivinhar pela grandeza do número. É mudança de comportamento na faixa ambígua, documentada no CHANGELOG | 10/10/2026 | spec 007 |
| D1 | **Piso Angular 20, suporte 20–22.** Compilar no 20 e declarar `peers: ^20 \|\| ^21 \|\| ^22`. Lib compilada no major X roda em apps ≥ X, então um artefato cobre os três | 10/10/2026 | spec 010 |
| D2 | **Entregas separadas: correções na linha 1.x · migração = 2.0.0.** Como a tag `v1.3.0` ficou no commit de fevereiro (D3), as correções desta leva saem como **1.4.0**, ainda compiladas no Angular 17. Se algo quebrar, dá para saber se foi correção ou migração | 10/10/2026 | spec 009, 010 |
| D3 | **Tag `v1.3.0` em `7f74029`** e o commit das correções datado **10/02/2026** (um dia depois). Decisão do dono, ciente de que retroage ~8 meses: o *author date* fica em fevereiro, mas o push e o run do GitHub Pages registram outubro/2026 | 10/10/2026 | spec 009 §9.1 |
| D4 | **A 1.3.0 não muda API pública.** Refatoração interna (base dos mascarados, `br-field-wrapper`) mantém nomes de `@Input`/`@Output`, seletores e comportamento. Critério: os 64 `it()` de máscara passam sem alteração | 10/10/2026 | spec 003 §3.3 |
| D5 | ~~`br-field-wrapper` é exportado~~ → **revogada por medição em 21/02/2026 (ver D23).** O wrapper não foi construído | 10/10/2026 · revista 21/02/2026 | D23 |
| D6 | **Inputs de coleção exigem nova referência.** Com `OnPush`, mutar array de `@Input` (`options.push(...)`) não atualiza a tela. É o contrato normal de lib Angular moderna; documentar em vez de contornar | 10/10/2026 | spec 002 §2.2 |
| D7 | **CDN sai do CSS da lib.** Os `@import url(...)` de Rawline e Font Awesome deixam o `govbr-tw.css`; o `ng-add` passa a ser o único lugar que oferece as fontes, com `--skipFonts` | 10/10/2026 | spec 005 §5.1 |
| D8 | **`scope` e `caption` da tabela são do consumidor.** `br-table` projeta `<ng-content>` (`:26`) — o `<th>` é escrito por quem usa. A lib oferece `ariaLabel`/`caption` e **documenta** a responsabilidade; o README para de afirmar que a tabela "é acessível" sem a ressalva | 10/10/2026 | spec 001 §1.4 |
| D23 | **A spec 003 só se sustenta para cpf e cnpj.** Medido: cpf↔cnpj divergem em 18% (54 de ~297 linhas) — gêmeos reais, viraram `BrDocumentoMascaradoBase` + estratégia de máscara. Mas telefone↔cep divergem em 49% e cep↔money em 75%: ViaCEP, spinner de carga e unidade monetária são comportamento próprio, não cópia. E as duas famílias têm API pública incompatível (`helperText/error/density` × `hint/ariaLabel/disabled`), que a própria D4 proíbe mudar. Unificá-las seria abstração por simetria. O `br-field-wrapper` (D5) cai junto | 21/02/2026 | `components/shared/` |
| D24 | **O tema do Tailwind 4 é GERADO do preset v3**, por `scripts/gerar-tema-v4.mjs`, e o build reprova se divergirem. Duas listas dos mesmos 57 tokens é a duplicação que já custou caro aqui; token novo que não chegasse ao v4 daria classe que funciona numa versão e some na outra, em silêncio | 24/02/2026 | `scripts/gerar-tema-v4.mjs` |
| D25 | **Host de story usa prefixo `br-sb-`.** Componentes que só existem para guardar estado de uma story (toast, modal com gatilho, mega-menu, contraste) não entram no `public-api.ts`. O prefixo satisfaz a regra de lint e o segmento `sb` diz que é do Storybook | 25/02/2026 | `*.stories.ts` |


## Dívidas aceitas

| # | Dívida | Revisar quando | Por quê aceitar agora |
|---|---|---|---|
| V1 | **Toolchain da lib no Angular 20 sai do LTS ~nov/2026.** Subir o piso para 21 | v20 sair do LTS | Quem perde patch é o build de desenvolvimento, não os consumidores. Piso 21 cortaria apps em 20 |
| V2 | **Cobertura unitária parcial — e a descrição anterior estava errada.** Medido em 26/02/2026: **19 arquivos de spec para 50 pastas exportadas; 32 sem nenhum teste unitário**. A versão anterior desta linha dizia que `button` e `pagination` estavam cobertos — nenhum dos dois tem spec, e `br-input` tem só um de a11y (3 `it()`). Sem teste unitário: accordion, avatar, badge, breadcrumb, button, card, checkbox, cookiebar, datepicker, datetimepicker, footer, header, layout, list, loading, magic-button, mega-menu, menu, message, notification, pagination, radio, sidebar, signin, skeleton, tab, table, textarea, timepicker, tooltip, upload, wizard | próxima release | Registrado em [`projects/ng-govbr-tw/MELHORIAS.md`](projects/ng-govbr-tw/MELHORIAS.md). Os 36 E2E exercitam **todos** eles pelas stories, incluindo axe, contraste e descrição acessível — o caminho quente está provado ponta a ponta, que é o que importa mais que a contagem. O que falta é a prova de modo de falha unitário |
| ~~V3~~ | ~~Showcase monolítico (2.940 linhas)~~ — **RESOLVIDA em 26/02/2026**: o showcase foi removido e o Storybook assumiu a documentação (D19) | — | — |
| ~~V5~~ | ~~O `ng-add` não tem teste automatizado~~ — **RESOLVIDA em 24/02/2026**: cinco testes em `testes/e2e/ng-add.spec.ts`, rodando o schematic COMPILADO sobre projetos de mentira em disco. Não precisou de `SchematicTestRunner`: o `NodeWorkflow` do devkit basta, e assim se testa o que o consumidor recebe | — | — |
| ~~V4~~ | ~~`<alpha-value>` nos tokens~~ — **RESOLVIDA**: a lib usa opacidade em token (`bg-govbr-primary-darkest/60` no modal, entre outros), então a forma de canal é necessária. No Tailwind 4 o placeholder não existe e a opacidade sai por `color-mix` — medido, e o tema de alto contraste continua alcançando | — | — |
| V6 | **`govbr-components.css` é inteiramente redundante.** Medido em 24/02/2026: ZERO classes que não estejam no `govbr-tw.css`. São 255 linhas publicadas e exportadas que duplicam outro arquivo — o mesmo risco de divergência que separou cpf de cnpj | próxima major | Remover um `export` do `package.json` quebra quem já importa. Enquanto isso, o `ng-add` não o importa (e está certo) |
| V7 | **`br-tab` pede o rótulo em dois lugares.** As abas vêm de `[tabs]`; os `label`/`icon`/`counter` declarados no `<br-tab-panel>` projetado são IGNORADOS pelo pai. Foi o que fez a story renderizar casca vazia | próxima major | Unificar muda a API pública |

| V8 | **São dois READMEs de ~30 KB, e eles derivam.** `README.md` da raiz é o que o GitHub mostra; `projects/ng-govbr-tw/README.md` é o que o ng-packagr copia para `dist/` e aparece no **npm**. Não são cópias: 928 e 1.127 linhas, com estruturas diferentes. Medido em 27/02/2026, o do npm ainda anunciava "Tailwind CSS 3" e "Angular 17, 18 e 19", sem os campos com máscara — e documentava um `@import` que **quebra o build** (`src/lib/styles/…` é bloqueado pelo `exports`) | próxima major | Fundir os dois é edição grande com risco real de perder conteúdo: o do npm tem a API por componente, o da raiz tem configuração e acessibilidade. Por ora os dois estão corretos e há portão no CI (`documentacao.spec.ts`) que reprova divergência |


## Abertas — precisam do dono

| # | Pergunta | Por que importa | Opções |
|---|---|---|---|
| — | *(nenhuma no momento — as nove de 11/10/2026 foram decididas)* | | |
