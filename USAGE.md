# Como usar e publicar a @aspect-br/ng-govbr-tw

## 1. Como usar no seu projeto

### 1.1 Instalacao a partir do pacote local (antes de publicar)

```bash
# Build da lib
cd C:\03_dev\projetos\artigos\poc-mds\govbr-tw
ng build ng-govbr-tw

# No seu projeto, instala direto do dist
cd C:\caminho\do\seu\projeto
npm install C:\03_dev\projetos\artigos\poc-mds\govbr-tw\dist\ng-govbr-tw
```

### 1.2 Instalacao via npm (apos publicar)

```bash
npm install @aspect-br/ng-govbr-tw
```

### 1.3 Configurar Tailwind no seu projeto

No `tailwind.config.js` do seu projeto:

```js
module.exports = {
  presets: [require('@aspect-br/ng-govbr-tw/tailwind.preset')],
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/@aspect-br/ng-govbr-tw/**/*.{html,ts,mjs}"
  ],
};
```

No `styles.css` do seu projeto:

```css
@import '@aspect-br/ng-govbr-tw/src/lib/styles/govbr-tw.css';
```

### 1.4 Usar os componentes

```typescript
import { BrButtonComponent, BrInputComponent } from '@aspect-br/ng-govbr-tw';

@Component({
  standalone: true,
  imports: [BrButtonComponent, BrInputComponent],
  template: `
    <br-button variant="primary">Salvar</br-button>
    <br-input label="Nome" [(ngModel)]="nome"></br-input>
  `
})
export class MeuComponente {}
```

### 1.5 Componentes disponiveis

| Componente | Seletor | Descricao |
|---|---|---|
| BrButtonComponent | `<br-button>` | Botao com variantes primary, secondary, danger |
| BrInputComponent | `<br-input>` | Campo de entrada com ControlValueAccessor |
| BrBadgeComponent | `<br-badge>` | Badge/tag de status |
| BrMessageComponent | `<br-message>` | Mensagem de feedback |
| BrTableComponent | `<br-table>` | Tabela com paginacao |
| BrCardComponent | `<br-card>` | Card informativo |
| BrHeaderComponent | `<br-header>` | Cabecalho do sistema |
| BrFooterComponent | `<br-footer>` | Rodape do sistema |
| BrMenuComponent | `<br-menu>` | Menu lateral de navegacao |
| BrMenuItemComponent | `<br-menu-item>` | Item do menu |
| BrLayoutComponent | `<br-layout>` | Layout principal com header, menu e footer |

---

## 2. Como publicar no npm

### 2.1 Primeira vez — criar conta e configurar

```bash
# Criar conta em npmjs.com (se ainda nao tem)
npm adduser

# Ou fazer login se ja tem conta
npm login
```

Como o pacote usa scope `@aspect-br`, voce precisa criar uma organizacao no npm:

1. Acesse https://www.npmjs.com
2. Va em Settings -> Organizations -> Create
3. Nome da organizacao: `aspect-br`

### 2.2 Publicar

```bash
# Build de producao da lib
cd C:\03_dev\projetos\artigos\poc-mds\govbr-tw
ng build ng-govbr-tw

# Publicar (--access public porque pacotes com scope sao privados por padrao)
cd dist\ng-govbr-tw
npm publish --access public
```

### 2.3 Atualizar versao nas proximas publicacoes

Edite a versao em `projects/ng-govbr-tw/package.json`:

```json
"version": "0.0.2"
```

Depois repita build + publish.

Ou use `npm version` dentro do diretorio da lib:

```bash
cd projects\ng-govbr-tw
npm version patch   # 0.0.1 -> 0.0.2
npm version minor   # 0.0.2 -> 0.1.0
npm version major   # 0.1.0 -> 1.0.0
```

Depois:

```bash
cd C:\03_dev\projetos\artigos\poc-mds\govbr-tw
ng build ng-govbr-tw
cd dist\ng-govbr-tw
npm publish --access public
```

---

## 3. Resumo rapido

```
ng build ng-govbr-tw  ->  cd dist/ng-govbr-tw  ->  npm publish --access public
```

Qualquer pessoa instala com:

```bash
npm install @aspect-br/ng-govbr-tw
```
