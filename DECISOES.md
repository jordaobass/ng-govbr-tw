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
| V4 | **`<alpha-value>` nos tokens.** Se a lib não usa modificador de opacidade (`bg-govbr-primary/50`), `var()` direto basta; a forma de canal (`rgb(var(--x) / <alpha-value>)`) fica para quando precisar | ao primeiro uso de opacidade em token | Medir antes de complicar o preset |

## Abertas — precisam do dono

| # | Pergunta | Por que importa | Opções |
|---|---|---|---|
| A2 | **Suporte à linha 1.x depois da 2.0.0** — correção crítica sai em branch `1.x` ou a 1.x morre na 1.3.0? | Sem resposta escrita no README, vira promessa implícita de suporte eterno | (a) branch `1.x` só para segurança · (b) 1.x congelada, anunciada como tal |
| A3 | **CI de publish no npm** (workflow por tag `v*` + `NPM_TOKEN`) | Hoje todo publish é manual e `npm whoami` nesta máquina dá `ENEEDAUTH`. Criar o segredo no repo é ação do dono | (a) criar agora · (b) seguir manual |
| A4 | **Storybook** (pendência em `MELHORIAS.md:97`) | Resolveria de uma vez a verificação visual por componente e substituiria o showcase monolítico — mas é projeto próprio | (a) agora, em vez de quebrar o showcase · (b) depois · (c) nunca, showcase por rota basta |
| A5 | **Migrar para signal inputs** (`input()`/`output()`) — 414 + 59 usos | Quebra a API pública (`component.disabled = true` para de funcionar). Seria 3.0.0 | (a) planejar para a 3.0.0 · (b) manter decorators indefinidamente |
| A6 | **Focus do tema claro** — o oficial usa `--focus-color-light: #c2850c`; o nosso `#ffbe2e` é o focus do tema **escuro** do DS. Adotar `#c2850c` deixaria mais fiel **e** com mais contraste, mas muda o anel de foco em toda a lib | É o indicador de interação mais visível da biblioteca | (a) adotar `#c2850c` · (b) manter `#ffbe2e` e documentar a divergência |
| A7 | **Os 7 componentes que faltam para paridade com o oficial** (`skip-link` já feito): `checkbox-group`, `icon`, `scrim` avulso, `tag` selecionável, `slider`, `dropdown`, `carousel`. Um agente chegou a gerá-los sem revisão — estão em `componentes-propostos/` no scratchpad da sessão, **fora do repo** | Expandem a API pública em 7 componentes; a própria análise classificou carousel/dropdown/link como "não vale" | (a) trazer só `checkbox-group` e `icon` · (b) trazer todos · (c) nenhum por ora |
| A8 | **Especificações 002 (OnPush), 003 (DRY dos mascarados), 006 (`ng-add`) e 008 (showcase) não foram implementadas** nesta leva | São o maior ganho estrutural restante; 002 e 003 mexem em muitos arquivos e pedem verificação na tela | (a) próxima leva, nesta ordem · (b) reavaliar escopo |
| A9 | **Tailwind 4** | A lib exporta `tailwind.preset.js` (modelo v3) e o `ng-add` depende de sintaxe v3. TW4 é CSS-first e forçaria migração dos consumidores | (a) issue própria na 2.1/3.0 · (b) não suportar por ora |
