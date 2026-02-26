import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface BrCheckboxOption {
  label: string;
  value: string;
  disabled?: boolean;
}

/**
 * Conjunto de caixas de seleção com escolha múltipla.
 *
 * O `br-checkbox` existente é uma caixa sozinha, com valor booleano. Em
 * formulário de governo o caso comum é outro — "marque os documentos que você
 * possui" —, e montá-lo à mão obriga o consumidor a recriar fieldset, legenda,
 * vínculo do erro e a lista de valores, que é justamente onde a acessibilidade
 * costuma se perder.
 *
 * O valor é `string[]`, na ordem em que as opções foram declaradas — não na
 * ordem em que o usuário clicou. Ordem estável importa: valor de formulário
 * que muda de ordem conforme o clique quebra comparação e teste.
 */
@Component({
  selector: 'br-checkbox-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrCheckboxGroupComponent),
      multi: true,
    },
  ],
  template: `
    <fieldset
      class="border-none p-0 m-0 font-rawline"
      role="group"
      [attr.aria-describedby]="descricaoAcessivel"
      [attr.aria-invalid]="error ? 'true' : null"
    >
      @if (legend) {
        <legend class="block text-govbr-sm font-semibold text-govbr-gray-80 mb-2">
          {{ legend }}
          @if (required) {
            <span class="text-govbr-danger-dark ml-0.5">*</span>
          }
        </legend>
      }

      @if (hint && !error) {
        <p [id]="name + '-hint'" class="mb-2 text-govbr-xs text-govbr-gray-60">{{ hint }}</p>
      }

      <div [class]="groupClasses">
        @for (option of options; track option.value) {
          <label [class]="getOptionClasses(option)" [for]="name + '-' + option.value">
            <input
              type="checkbox"
              [id]="name + '-' + option.value"
              [name]="name"
              [value]="option.value"
              [checked]="estaMarcada(option.value)"
              [disabled]="isDisabled || option.disabled"
              class="sr-only peer govbr-focus-checkbox"
              (change)="alternar(option.value)"
              (blur)="onTouched()"
            />
            <span [class]="getBoxClasses(option)">
              @if (estaMarcada(option.value)) {
                <i class="fa-solid fa-check text-govbr-on-primary text-govbr-xs" aria-hidden="true"></i>
              }
            </span>
            <span [class]="labelClasses">{{ option.label }}</span>
          </label>
        }
      </div>

      @if (error) {
        <span
          [id]="name + '-error'"
          class="flex items-center mt-1 text-govbr-sm text-govbr-danger-dark"
          role="alert"
        >
          <i class="fa-solid fa-times-circle mr-1" aria-hidden="true"></i>{{ error }}
        </span>
      }
    </fieldset>
  `,
})
export class BrCheckboxGroupComponent implements ControlValueAccessor {
  @Input() legend?: string;
  @Input() name = `br-checkbox-group-${BrCheckboxGroupComponent.nextId++}`;
  @Input() options: BrCheckboxOption[] = [];
  @Input() required = false;
  @Input() hint?: string;
  @Input() error?: string;
  @Input() inline = false;
  @Input() size: 'default' | 'small' = 'default';

  @Output() valueChange = new EventEmitter<string[]>();

  value: string[] = [];
  isDisabled = false;

  private static nextId = 0;

  private readonly cdr = inject(ChangeDetectorRef);

  onChange: (value: string[]) => void = () => {};
  onTouched: () => void = () => {};

  /**
   * Ids que descrevem o GRUPO. Apoio e erro falam do conjunto, não de uma
   * opção — pendurá-los na primeira caixa faria o leitor de tela anunciar a
   * regra do todo como se fosse dela.
   */
  get descricaoAcessivel(): string | null {
    if (this.error) return `${this.name}-error`;
    if (this.hint) return `${this.name}-hint`;
    return null;
  }

  estaMarcada(valor: string): boolean {
    return this.value.includes(valor);
  }

  get groupClasses(): string {
    return this.inline ? 'flex flex-wrap gap-4' : 'flex flex-col gap-3';
  }

  getOptionClasses(option: BrCheckboxOption): string {
    const base = 'inline-flex items-center font-rawline cursor-pointer select-none group';
    const desabilitada = this.isDisabled || option.disabled ? 'opacity-50 cursor-not-allowed' : '';
    return [base, desabilitada].filter(Boolean).join(' ');
  }

  getBoxClasses(option: BrCheckboxOption): string {
    const tamanhos = {
      default: 'w-6 h-6',
      small: 'w-5 h-5',
    } as const;

    const marcada = this.estaMarcada(option.value);

    const base = [
      'flex items-center justify-center flex-shrink-0 rounded-sm border-2 transition-colors',
      tamanhos[this.size],
    ].join(' ');

    const estado = marcada
      ? 'bg-govbr-primary border-govbr-primary'
      : `${this.error ? 'border-govbr-danger' : 'border-govbr-gray-40'} group-hover:border-govbr-primary`;

    return [base, estado].join(' ');
  }

  get labelClasses(): string {
    const tamanhos = {
      default: 'ml-3 text-govbr-base',
      small: 'ml-2 text-govbr-sm',
    } as const;
    return `font-medium text-govbr-gray-80 ${tamanhos[this.size]}`;
  }

  alternar(valor: string): void {
    const marcados = new Set(this.value);
    if (marcados.has(valor)) marcados.delete(valor);
    else marcados.add(valor);

    // Ordem das opções, não ordem do clique.
    this.value = this.options.map((o) => o.value).filter((v) => marcados.has(v));

    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  /**
   * ⚠️ `markForCheck` não é zelo: com `OnPush`, valor vindo do formulário
   * entra por aqui — nem `@Input`, nem evento do template —, e sem o aviso a
   * view simplesmente não redesenha. O `setValue` do formulário mudava o
   * estado e as caixas continuavam desmarcadas na tela. Foi o teste que pegou.
   */
  writeValue(value: string[] | null): void {
    // Formulário pode entregar `null` no reset, e `.includes` em null quebra
    // a renderização inteira do grupo.
    this.value = Array.isArray(value) ? [...value] : [];
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }
}
