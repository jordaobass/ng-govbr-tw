import {
  AbstractControl,
  ControlValueAccessor,
  NgControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { ChangeDetectorRef, Directive, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription, merge } from 'rxjs';

import { MascaraDocumento } from './mascara-documento';

/**
 * Template único de campo de documento mascarado.
 *
 * Era literalmente o mesmo markup em `br-input-cpf` e `br-input-cnpj`,
 * divergindo só em `maxlength` e no nome do ícone — ambos agora vêm da
 * máscara. Mantê-lo numa constante compartilhada é o que garante que a
 * próxima correção de acessibilidade chegue aos dois ao mesmo tempo, que é
 * exatamente o que não aconteceu da última vez.
 */
export const TEMPLATE_DOCUMENTO_MASCARADO = `
    <div class="mb-4 font-rawline">
      @if (label) {
        <label
          [for]="inputId"
          class="block text-govbr-sm font-semibold text-govbr-gray-80 mb-1"
        >
          {{ label }}
          @if (required) {
            <span class="text-govbr-danger-dark ml-0.5">*</span>
          }
        </label>
      }

      @if (helperText && !displayError) {
        <span
          [id]="inputId + '-helper'"
          class="block text-govbr-xs text-govbr-gray-60 mb-1"
        >
          {{ helperText }}
        </span>
      }

      <div class="relative">
        <input
          [id]="inputId"
          type="text"
          inputmode="numeric"
          [placeholder]="placeholder"
          [disabled]="isDisabled"
          [attr.aria-invalid]="!!displayError"
          [attr.aria-describedby]="descricaoAcessivel"
          [class]="inputClasses"
          [value]="displayValue"
          (input)="onInput($event)"
          (blur)="onBlur()"
          [attr.maxlength]="mascara.tamanhoFormatado"
        />
        <i
          [class]="'fa-solid fa-' + mascara.icone + ' absolute right-3 top-1/2 -translate-y-1/2 text-govbr-gray-60 pointer-events-none'"
          aria-hidden="true"
        ></i>
      </div>

      @if (displayError) {
        <span
          [id]="inputId + '-error'"
          class="flex items-center mt-1 text-govbr-sm text-govbr-danger-dark"
          role="alert"
        >
          <i class="fa-solid fa-times-circle mr-1" aria-hidden="true"></i>{{ displayError }}
        </span>
      }
    </div>
  `;

/** Contador de `id` por máscara, para `br-input-cpf-0` não virar `br-input-cpf-7`. */
const sequencias = new Map<string, number>();

function proximoId(prefixo: string): string {
  const n = sequencias.get(prefixo) ?? 0;
  sequencias.set(prefixo, n + 1);
  return `${prefixo}-${n}`;
}

/**
 * Comportamento comum de campo de documento mascarado.
 *
 * ⚠️ `@Directive()` sem seletor não é decoração decorativa: o Angular exige
 * esse decorator em classe base que usa `inject`, `@Input` ou lifecycle, e sem
 * ele a compilação falha com NG2007 — mensagem que não diz o que fazer.
 *
 * ⚠️ A API pública dos componentes concretos NÃO muda com esta base. Os nomes
 * de `@Input`, o seletor e o valor emitido ficam idênticos aos da 1.2.7: isto
 * é refatoração interna, e os 29 testes de cpf e cnpj precisam passar sem uma
 * linha alterada.
 */
@Directive()
export abstract class BrDocumentoMascaradoBase
  implements ControlValueAccessor, Validator, OnInit, OnDestroy
{
  /** Agrupamento, dígito verificador, ícone e mensagens — o que varia. */
  abstract readonly mascara: MascaraDocumento;

  @Input() label?: string;
  @Input() placeholder = '';
  @Input() required = false;
  @Input() helperText?: string;
  @Input() error?: string;
  @Input() density: 'small' | 'medium' | 'large' = 'medium';

  /** Mensagens customizadas para erros */
  @Input() errorMessages: Record<string, string> = {};

  displayValue = '';
  isDisabled = false;
  private rawValue = '';

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};
  onValidatorChange: () => void = () => {};

  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly cdr = inject(ChangeDetectorRef);
  private inscricaoEstado?: Subscription;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * O `id` sai da máscara, então não pode ser calculado no campo: na hora em
   * que um inicializador de propriedade da base roda, `this.mascara` — que é
   * do filho — ainda não existe.
   */
  private idGerado?: string;
  get inputId(): string {
    return (this.idGerado ??= proximoId(this.mascara.prefixoId));
  }

  get displayError(): string | undefined {
    if (this.error) return this.error;

    if (!this.ngControl?.control) return undefined;

    const control = this.ngControl.control;
    if (!control.errors || (!control.touched && !control.dirty)) return undefined;

    return this.getFirstErrorMessage(control.errors);
  }

  /**
   * Ids que descrevem o campo para o leitor de tela. O erro só entra quando
   * existe — `aria-describedby` apontando para elemento ausente faz o leitor
   * anunciar nada e mascara o problema.
   */
  get descricaoAcessivel(): string | null {
    const ids: string[] = [];
    if (this.displayError) ids.push(`${this.inputId}-error`);
    else if (this.helperText) ids.push(`${this.inputId}-helper`);
    return ids.length ? ids.join(' ') : null;
  }

  private getFirstErrorMessage(errors: ValidationErrors): string {
    for (const key of Object.keys(errors)) {
      if (this.errorMessages[key]) return this.errorMessages[key];
      const padrao = this.mascara.mensagens[key];
      if (padrao) return padrao;
    }
    return 'Campo inválido';
  }

  get inputClasses(): string {
    const densityHeights = {
      small: 'h-[var(--govbr-input-small)] text-govbr-sm',
      medium: 'h-[var(--govbr-input-medium)] text-govbr-base',
      large: 'h-[var(--govbr-input-large)] text-govbr-lg',
    } as const;

    const base = `w-full px-4 pr-10 font-rawline govbr-input ${densityHeights[this.density]}`;
    const statusCls = this.displayError ? 'govbr-input--danger' : '';
    const disabledCls = this.isDisabled
      ? 'bg-govbr-gray-2 text-govbr-gray-60 cursor-not-allowed'
      : 'bg-govbr-bg text-govbr-gray-80';

    return [base, statusCls, disabledCls].filter(Boolean).join(' ');
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, this.mascara.digitos);
    this.rawValue = digits;
    this.displayValue = this.mascara.formatar(digits);
    this.onChange(digits);

    // Reposition cursor
    setTimeout(() => {
      input.value = this.displayValue;
    });
  }

  onBlur(): void {
    this.onTouched();
  }

  // ControlValueAccessor
  writeValue(value: string): void {
    const digits = (value || '').replace(/\D/g, '').slice(0, this.mascara.digitos);
    this.rawValue = digits;
    this.displayValue = this.mascara.formatar(digits);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // Validator
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) {
      return this.required ? { required: true } : null;
    }

    const digits = value.replace(/\D/g, '');
    if (digits.length < this.mascara.digitos) {
      return { [this.mascara.chaveIncompleto]: true };
    }

    if (!this.mascara.valido(digits)) {
      return { [this.mascara.chaveInvalido]: true };
    }

    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  /**
   * Com `OnPush`, o estado de validação precisa avisar a view.
   *
   * O erro exibido vem de `ngControl.control.errors`, lido num getter. Nada
   * nesse caminho passa por `@Input` nem por evento do template, então quando
   * o formulário fica inválido (um `markAllAsTouched()` no submit, por
   * exemplo) a mensagem simplesmente não aparecia: compilava, passava no
   * unitário e falhava na tela.
   */
  ngOnInit(): void {
    // No construtor, `ngControl.control` ainda é null: a diretiva só o
    // publica depois. Assinar ali deixava a inscrição sem efeito.
    this.observarEstadoDoControle();
  }

  private observarEstadoDoControle(): void {
    const control = this.ngControl?.control;
    if (!control) return;

    this.inscricaoEstado = merge(control.statusChanges, control.valueChanges).subscribe(() =>
      this.cdr.markForCheck()
    );
  }

  ngOnDestroy(): void {
    this.inscricaoEstado?.unsubscribe();
  }
}
