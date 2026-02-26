import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

/**
 * Ícone do Gov.br DS.
 *
 * A lib tinha 115 `<i class="fa-…">` escritos à mão, misturando `fa-solid` e
 * `fas` (duas grafias do mesmo estilo) e dependendo de alguém lembrar do
 * `aria-hidden`. Este componente torna a regra de acessibilidade estrutural:
 *
 * - **sem `label`** o ícone é decorativo → `aria-hidden="true"`, e o leitor de
 *   tela o ignora, que é o certo quando o texto ao lado já diz tudo;
 * - **com `label`** ele carrega significado → vira `role="img"` com
 *   `aria-label`, e passa a ser anunciado.
 *
 * Não há meio-termo possível: ícone sem nenhum dos dois é lido como um
 * caractere solto ou silenciosamente ignorado, dependendo do leitor.
 */
@Component({
  selector: 'br-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <i
      [class]="classes"
      [attr.role]="label ? 'img' : null"
      [attr.aria-label]="label || null"
      [attr.aria-hidden]="label ? null : 'true'"
    ></i>
  `,
})
export class BrIconComponent {
  /** Nome do ícone SEM o prefixo. Ex.: `house`, `magnifying-glass`. */
  @Input({ required: true }) name = '';

  /**
   * Estilo da família Font Awesome.
   *
   * Grafia longa (`fa-solid`), não a curta (`fas`): são equivalentes, mas
   * misturar as duas no mesmo projeto esconde erro de digitação — `fas` e
   * `fa-s` falham de formas diferentes.
   */
  @Input() variant: 'solid' | 'regular' | 'brands' = 'solid';

  @Input() size: 'small' | 'medium' | 'large' | 'xlarge' = 'medium';

  /**
   * Nome acessível. Preencher APENAS quando o ícone carrega informação que
   * não está no texto ao lado; caso contrário ele é anunciado duas vezes.
   */
  @Input() label?: string;

  /** Classe extra do consumidor (cor, margem). */
  @Input() extraClass = '';

  get classes(): string {
    const tamanhos = {
      small: 'text-govbr-xs',
      medium: 'text-govbr-base',
      large: 'text-govbr-lg',
      xlarge: 'text-2xl',
    } as const;

    return [`fa-${this.variant}`, `fa-${this.name}`, tamanhos[this.size], this.extraClass]
      .filter(Boolean)
      .join(' ');
  }
}
