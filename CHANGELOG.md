# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

## [1.2.7] - 2026-02-08

### Adicionado
- **Alto Contraste**: Suporte completo ao modo de alto contraste (acessibilidade WCAG)
  - Estilos para `br-input` (fundo escuro, texto claro, focus amarelo)
  - Estilos para `br-select` (trigger, dropdown, opções)
  - Estilos para `br-checkbox` e `br-radio`
  - Estilos para `br-pagination` (inputs e layout contextual)
  - Estilos para `br-table` (hover legível no tema escuro)
  - Estilos para `br-card`, `br-accordion`, `br-modal`, `br-tooltip`
  - Estilos para `br-tab`, `br-list`, `br-message`, `br-badge`
  - Estilos para feedback messages (danger, success, warning, info)

### Corrigido
- Feedback messages dos inputs agora têm fundo colorido conforme padrão Gov.br
- Hover da tabela no modo contraste agora mantém texto legível
- Consistência de altura entre `br-input` e `br-select` usando CSS variables

## [1.2.6] - 2026-02-08

### Adicionado
- Layout contextual da paginação seguindo padrão Gov.br
- Fundo branco na paginação contextual
- Cor de focus corrigida para `#c2850c` (gold-vivid-40)

### Corrigido
- Padding da paginação dentro de tabelas
- Altura consistente entre input e select

## [1.2.5] - 2026-02-07

### Inicial
- Primeira versão estável da biblioteca
- Componentes Angular seguindo Gov.br Design System
- Integração com Tailwind CSS 3
- Suporte a Angular 17, 18 e 19
