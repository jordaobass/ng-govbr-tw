# 003 — Base dos inputs mascarados e `br-field-wrapper`

**Entra em:** 1.3.0 · **Executar antes da [001](001-a11y-wcag.md)** nos mascarados

> ## ⚠️ Corrigida pela medição — 21/02/2026
>
> Três afirmações desta spec não resistiram à conferência. Ficam registradas
> porque o erro é instrutivo, não porque continuam valendo.
>
> **1. "Os 5 inputs mascarados são cópias quase integrais um do outro" — falso
> para 3 deles.** Medido normalizando o token de nome e contando linhas que
> diferem:
>
> | par | divergência |
> |---|---|
> | cpf ↔ cnpj | **18%** (54 de ~297 linhas) |
> | telefone ↔ cep | 49% (119 de ~245) |
> | telefone ↔ money | 65% |
> | cep ↔ money | **75%** |
>
> Só cpf e cnpj são gêmeos. ViaCEP, spinner de carga e unidade monetária são
> comportamento próprio. E as duas famílias expõem **API pública diferente**
> (`helperText/error/density` × `hint/ariaLabel/disabled`), que a §3.3 desta
> mesma spec proíbe mudar. Unificar os cinco seria abstração por simetria.
>
> **2. "cpf e cnpj não têm `aria-invalid` nem `role="alert"`" — já não era
> verdade** quando a refatoração começou: a spec 001 havia corrigido os cinco.
> O critério de aceite nº 2 nasceu satisfeito.
>
> **3. "os 64 `it()` de máscara" — são 65.** O de moeda ganhou um ao receber
> `valueUnit`.
>
> **O que foi feito:** `BrDocumentoMascaradoBase` + estratégia de máscara, só
> para cpf e cnpj. 457 → 334 linhas de código no par, uma cópia só do
> comportamento, 167 unitários verdes sem tocar num `it()`. O
> `br-field-wrapper` (§3.1) **não foi construído** — ver D23.

## Estado atual — medido em 10/10/2026

Os 5 inputs mascarados são cópias quase integrais um do outro:

```bash
cd projects/ng-govbr-tw/src/lib/components
wc -l input-cpf/*.ts input-cnpj/*.ts input-telefone/*.ts input-cep/*.ts input-money/*.ts
# cpf 233 · cnpj 237 · telefone 224 · cep 261 · money 267  (≈1.222 linhas)

# normalizando o token cpf→cnpj, só 54 linhas diferem entre os dois arquivos
```

## O argumento que fecha a discussão

A duplicação **já cobrou o preço**. A correção de acessibilidade (`aria-invalid` +
`role="alert"`) foi aplicada em **3 das 5 cópias**:

| Componente | `aria-invalid` | `role="alert"` |
|---|---|---|
| telefone, cep, money | ✅ | ✅ |
| **cpf, cnpj** | ❌ | ❌ |

Não é duplicação teórica que "um dia pode divergir" — ela divergiu, e o que ficou atrás
foram justamente os dois campos mais usados em formulário de governo. Deduplicar aqui não
é limpeza estética, é impedir a próxima divergência.

## O que implementar

### 3.1 `br-field-wrapper` — o bloco label/helper/erro

O mesmo markup de ~20 linhas (`@if (label)` + asterisco de obrigatório + helper + span de
erro) se repete em `input`, `textarea`, `select`, `checkbox`, `datepicker`, `timepicker` e
nos 5 mascarados. Exemplo: `input-cpf/br-input-cpf.component.ts:15-55` é idêntico a
`input-cnpj/br-input-cnpj.component.ts:15-55`.

Criar componente interno que recebe `label`, `required`, `helperText`, `errorText`,
`controlId` e projeta o controle. Ganho duplo: ~200 linhas a menos **e** a a11y da spec
001 §1.1 passa a existir em um lugar só.

**Decisão de API:** `br-field-wrapper` é exportado no `public-api.ts` ou fica interno?
Exportar permite ao consumidor montar campo próprio com a mesma moldura — útil e barato.
Registrado em `DECISOES.md`; o padrão é **exportar**.

### 3.2 `BrMaskedInputBase` — classe base abstrata

Classe abstrata com todo o boilerplate comum: `ControlValueAccessor` + `Validator`,
`nextId` estático, `inputClasses`, `onInput`/`onBlur`/`onTouched`, estado de erro.

A parte que varia entre os 5 vira **estratégia de máscara**: um objeto/função com
`format(valor): string`, `unformat(valor): string`, `validate(valor): boolean` e
`maxLength`. CPF e CNPJ já têm a validação de dígito verificador implementada — mover para
a estratégia, não reescrever (os specs existentes provam a validação atual e devem
continuar verdes).

Cada componente concreto fica com: decorator, estratégia e os `@Input()` próprios.
Alvo: ~1.222 linhas → ~400–500.

### 3.3 O que NÃO mudar

- **A API pública dos 5 componentes.** Nomes de `@Input`/`@Output`, seletores e
  comportamento ficam idênticos. Esta spec é refatoração interna; quem consome a 1.2.7
  não deve notar diferença alguma além da a11y que passa a funcionar em cpf/cnpj.
- Os 64 `it()` dos 5 specs de máscara (cpf 15, cnpj 14, telefone 13, money 12, cep 10)
  **continuam valendo sem alteração**. Se um deles precisar mudar para passar, a
  refatoração mudou comportamento e está errada.

## Critério de aceite

1. `npx ng test --watch=false` verde **sem tocar nos 64 `it()` de máscara** — este é o
   critério central: a rede de proteção já existe, e ela só protege se não for mexida.
2. `cpf` e `cnpj` passam a ter `aria-invalid` e `role="alert"` (herdado do wrapper), com
   teste novo que falha antes da mudança — ver [007](007-testes.md) §2.
3. Contagem de linhas dos 5 componentes cai para menos de 600 somadas.
4. `npm run build` gera o pacote e os 5 seletores continuam no `public-api.ts`.
