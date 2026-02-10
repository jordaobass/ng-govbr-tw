import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrInputComponent } from './br-input.component';
import { BrTextareaComponent } from '../textarea/br-textarea.component';
import { BrInputCpfComponent } from '../input-cpf/br-input-cpf.component';
import { BrInputCnpjComponent } from '../input-cnpj/br-input-cnpj.component';

/**
 * Erro de validação tem de ser ANUNCIADO, não só pintado de vermelho
 * (WCAG 3.3.1 / 4.1.3). Antes destes testes, `br-input`, `br-textarea`,
 * `br-input-cpf` e `br-input-cnpj` não tinham `aria-invalid` nem
 * `role="alert"` — enquanto telefone, cep e money já tinham. A correção
 * havia sido aplicada em 3 das 7 cópias.
 */
@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BrInputComponent,
    BrTextareaComponent,
    BrInputCpfComponent,
    BrInputCnpjComponent,
  ],
  template: `
    <br-input [formControl]="campo" label="Nome" helperText="Como no documento" />
    <br-textarea [formControl]="campo" label="Observação" helperText="Até 200" />
    <br-input-cpf [formControl]="campo" label="CPF" helperText="Só números" />
    <br-input-cnpj [formControl]="campo" label="CNPJ" helperText="Só números" />
  `,
})
class HospedeiroTeste {
  campo = new FormControl('', Validators.required);
}

describe('Acessibilidade do erro nos campos de formulário', () => {
  let fixture: ComponentFixture<HospedeiroTeste>;

  const CAMPOS = [
    { seletor: 'br-input', controle: 'input' },
    { seletor: 'br-textarea', controle: 'textarea' },
    { seletor: 'br-input-cpf', controle: 'input' },
    { seletor: 'br-input-cnpj', controle: 'input' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospedeiroTeste],
    }).compileComponents();

    fixture = TestBed.createComponent(HospedeiroTeste);
    fixture.detectChanges();
  });

  function invalidar(): void {
    const campo = fixture.componentInstance.campo;
    campo.markAsTouched();
    campo.markAsDirty();
    campo.setValue('');
    campo.updateValueAndValidity();
    fixture.detectChanges();
  }

  for (const { seletor, controle } of CAMPOS) {
    it(`${seletor} should mark the control as aria-invalid when it has an error`, () => {
      invalidar();
      const el = fixture.nativeElement.querySelector(`${seletor} ${controle}`);
      expect(el).withContext(`${seletor}: controle não encontrado`).toBeTruthy();
      expect(el.getAttribute('aria-invalid')).toBe('true');
    });

    it(`${seletor} should announce the error with role="alert"`, () => {
      invalidar();
      const alerta = fixture.nativeElement.querySelector(`${seletor} [role="alert"]`);
      expect(alerta).withContext(`${seletor}: erro sem role="alert"`).toBeTruthy();
      expect(alerta.textContent.trim().length).toBeGreaterThan(0);
    });

    it(`${seletor} should point aria-describedby at the error element that exists`, () => {
      invalidar();
      const el = fixture.nativeElement.querySelector(`${seletor} ${controle}`);
      const ids = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
      expect(ids.length).withContext(`${seletor}: sem aria-describedby`).toBeGreaterThan(0);

      // Apontar para id inexistente faz o leitor anunciar vazio — o defeito
      // fica invisível justamente para quem depende dele.
      for (const id of ids) {
        expect(fixture.nativeElement.querySelector(`#${id}`))
          .withContext(`${seletor}: aria-describedby aponta para #${id}, que não existe`)
          .toBeTruthy();
      }
    });
  }
});
