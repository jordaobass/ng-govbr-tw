import { Component, Input, ViewEncapsulation } from '@angular/core';

export interface BrSkiplinkItem {
  /** Alvo da âncora, com `#` (ex.: `#conteudo`). */
  href: string;
  label: string;
}

/**
 * Atalhos de navegação ("ir para o conteúdo"), exigidos pelo Gov.br DS e pelo
 * eMAG. Fica visualmente oculto e **aparece ao receber foco** — não pode ser
 * `display: none` nem `visibility: hidden`, senão sai da ordem de tabulação e
 * deixa de existir justamente para quem navega por teclado.
 *
 * Deve ser o primeiro elemento focável da página: coloque antes do `br-header`.
 */
@Component({
  selector: 'br-skiplink',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav class="br-skiplink" [attr.aria-label]="ariaLabel">
      <ul class="br-skiplink-list">
        @for (item of itens; track item.href) {
          <li>
            <a [href]="item.href" class="br-skiplink-item">{{ item.label }}</a>
          </li>
        }
      </ul>
    </nav>
  `,
  styles: [
    `
      /*
       * Técnica de "visualmente oculto, focável": tamanho 1px e clip, em vez de
       * display/visibility. O link continua na ordem de tabulação e volta ao
       * fluxo quando focado.
       */
      .br-skiplink-item {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      .br-skiplink-item:focus,
      .br-skiplink-item:focus-visible {
        position: fixed;
        top: var(--govbr-spacing-3, 12px);
        left: var(--govbr-spacing-3, 12px);
        z-index: 2000;
        width: auto;
        height: auto;
        margin: 0;
        padding: var(--govbr-spacing-3, 12px) var(--govbr-spacing-4, 16px);
        overflow: visible;
        clip: auto;
        background-color: var(--govbr-primary);
        color: var(--govbr-on-primary);
        font-family: var(--govbr-font-family);
        font-weight: var(--govbr-font-weight-semi-bold, 600);
        border-radius: var(--govbr-border-radius-sm, 4px);
        outline: var(--govbr-focus-width, 3px) var(--govbr-focus-style, solid)
          var(--govbr-focus-color);
        outline-offset: var(--govbr-focus-offset, 2px);
        text-decoration: none;
      }

      .br-skiplink-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }
    `,
  ],
})
export class BrSkiplinkComponent {
  /**
   * Atalhos oferecidos. O padrão cobre o caso mais comum; `#conteudo` precisa
   * existir na página (num `<main id="conteudo">`), senão o atalho não leva a
   * lugar nenhum.
   */
  @Input() itens: BrSkiplinkItem[] = [
    { href: '#conteudo', label: 'Ir para o conteúdo' },
  ];

  @Input() ariaLabel = 'Atalhos de navegação';
}
