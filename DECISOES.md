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
| D12 | **`br-input-money` declara a unidade** (`@Input() valueUnit`, padrão `cents`) em vez de adivinhar pela grandeza do número. É mudança de comportamento na faixa ambígua, documentada no CHANGELOG | 10/10/2026 | [spec 007](.specs/007-testes.md) |
| D1 | **Piso Angular 20, suporte 20–22.** Compilar no 20 e declarar `peers: ^20 \|\| ^21 \|\| ^22`. Lib compilada no major X roda em apps ≥ X, então um artefato cobre os três | 10/10/2026 | [spec 010](.specs/010-migracao-angular-20-22.md) |
| D2 | **Entregas separadas: correções na linha 1.x · migração = 2.0.0.** Como a tag `v1.3.0` ficou no commit de fevereiro (D3), as correções desta leva saem como **1.4.0**, ainda compiladas no Angular 17. Se algo quebrar, dá para saber se foi correção ou migração | 10/10/2026 | [spec 009](.specs/009-release-1.3.0.md), [010](.specs/010-migracao-angular-20-22.md) |
| D3 | **Tag `v1.3.0` em `7f74029`** e o commit das correções datado **10/02/2026** (um dia depois). Decisão do dono, ciente de que retroage ~8 meses: o *author date* fica em fevereiro, mas o push e o run do GitHub Pages registram outubro/2026 | 10/10/2026 | [spec 009](.specs/009-release-1.3.0.md) §9.1 |
| D4 | **A 1.3.0 não muda API pública.** Refatoração interna (base dos mascarados, `br-field-wrapper`) mantém nomes de `@Input`/`@Output`, seletores e comportamento. Critério: os 64 `it()` de máscara passam sem alteração | 10/10/2026 | [spec 003](.specs/003-dry-inputs-e-field-wrapper.md) §3.3 |
| D5 | **`br-field-wrapper` é exportado** no `public-api.ts`, não interno — permite ao consumidor montar campo próprio com a mesma moldura e a mesma a11y | 10/10/2026 | [spec 003](.specs/003-dry-inputs-e-field-wrapper.md) §3.1 |
| D6 | **Inputs de coleção exigem nova referência.** Com `OnPush`, mutar array de `@Input` (`options.push(...)`) não atualiza a tela. É o contrato normal de lib Angular moderna; documentar em vez de contornar | 10/10/2026 | [spec 002](.specs/002-performance-onpush.md) §2.2 |
| D7 | **CDN sai do CSS da lib.** Os `@import url(...)` de Rawline e Font Awesome deixam o `govbr-tw.css`; o `ng-add` passa a ser o único lugar que oferece as fontes, com `--skipFonts` | 10/10/2026 | [spec 005](.specs/005-portabilidade-ssr-e-cdn.md) §5.1 |
| D8 | **`scope` e `caption` da tabela são do consumidor.** `br-table` projeta `<ng-content>` (`:26`) — o `<th>` é escrito por quem usa. A lib oferece `ariaLabel`/`caption` e **documenta** a responsabilidade; o README para de afirmar que a tabela "é acessível" sem a ressalva | 10/10/2026 | [spec 001](.specs/001-a11y-wcag.md) §1.4 |

## Dívidas aceitas

| # | Dívida | Revisar quando | Por quê aceitar agora |
|---|---|---|---|
| V1 | **Toolchain da lib no Angular 20 sai do LTS ~nov/2026.** Subir o piso para 21 | v20 sair do LTS | Quem perde patch é o build de desenvolvimento, não os consumidores. Piso 21 cortaria apps em 20 |
| V2 | **Cobertura de teste parcial.** A 1.4.0 cobre `button`, `br-input`, `select`, `modal`, `pagination`; ficam sem teste `header`, `table`, `datepicker`, `accordion`, `wizard`, `upload` e animações | próxima release | Prometer cobertura total nesta release seria promessa que ela não cumpre. Registrar em `MELHORIAS.md` |
| V3 | **Showcase monolítico (2.940 linhas).** Quebrar por rota | próxima release | Maior diff e menor risco da release. 8.1 e 8.2 são obrigatórios; 8.3 pode escorregar |
| V5 | **O `ng-add` não tem teste automatizado.** A correção dos 6 defeitos foi provada executando `ng add` em três apps descartáveis, mas nada impede a regressão num CI. Testar schematic exige `SchematicTestRunner` e um tsconfig próprio, fora da suíte karma | quando o schematic voltar a ser mexido | O caminho crítico está provado por execução registrada no CHANGELOG; montar a infraestrutura de teste de schematic custa mais que o risco atual |
| V4 | **`<alpha-value>` nos tokens.** Se a lib não usa modificador de opacidade (`bg-govbr-primary/50`), `var()` direto basta; a forma de canal (`rgb(var(--x) / <alpha-value>)`) fica para quando precisar | ao primeiro uso de opacidade em token | Medir antes de complicar o preset |

## Abertas — precisam do dono

| # | Pergunta | Por que importa | Opções |
|---|---|---|---|
| — | *(nenhuma no momento — as nove de 11/10/2026 foram decididas)* | | |
