import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { BrCheckboxGroupComponent } from './br-checkbox-group.component';

const OPCOES = [
  { label: 'RG', value: 'rg' },
  { label: 'CPF', value: 'cpf' },
  { label: 'CNH', value: 'cnh' },
  { label: 'Passaporte', value: 'passaporte', disabled: true },
];

@Component({
  template: `
    <br-checkbox-group
      [formControl]="controle"
      [options]="opcoes"
      [error]="erro"
      legend="Documentos que você possui"
      name="docs"
    ></br-checkbox-group>
  `,
  standalone: true,
  imports: [BrCheckboxGroupComponent, ReactiveFormsModule],
})
class HospedeiroTest {
  controle = new FormControl<string[]>([]);
  opcoes = OPCOES;
  erro?: string;
}

describe('BrCheckboxGroupComponent', () => {
  let fixture: ComponentFixture<HospedeiroTest>;
  let hospedeiro: HospedeiroTest;

  const caixas = (): HTMLInputElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('input[type=checkbox]'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HospedeiroTest] }).compileComponents();
    fixture = TestBed.createComponent(HospedeiroTest);
    hospedeiro = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * O caminho quente ponta a ponta: clicar de verdade nas caixas e conferir o
   * que chegou ao FormControl. Testar `alternar()` direto provaria o método, e
   * não que o componente funciona ligado a um formulário.
   */
  it('deve entregar ao formulário os valores marcados, na ordem das opções', () => {
    caixas()[2].click(); // CNH primeiro
    caixas()[0].click(); // depois RG
    fixture.detectChanges();

    // Ordem das OPÇÕES, não a do clique: valor de formulário que muda de
    // ordem conforme o clique quebra comparação e teste.
    expect(hospedeiro.controle.value).toEqual(['rg', 'cnh']);
  });

  it('deve desmarcar ao clicar de novo', () => {
    caixas()[0].click();
    caixas()[0].click();
    fixture.detectChanges();

    expect(hospedeiro.controle.value).toEqual([]);
  });

  it('deve refletir o valor que vem do formulário', () => {
    hospedeiro.controle.setValue(['cpf']);
    fixture.detectChanges();

    expect(caixas()[1].checked).toBe(true);
    expect(caixas()[0].checked).toBe(false);
  });

  it('deve sobreviver ao reset do formulário, que entrega null', () => {
    hospedeiro.controle.setValue(['rg']);
    fixture.detectChanges();

    // `reset()` entrega null; `.includes` em null derrubaria a renderização
    // inteira do grupo — e o erro apareceria longe daqui.
    expect(() => {
      hospedeiro.controle.reset();
      fixture.detectChanges();
    }).not.toThrow();
    expect(caixas()[0].checked).toBe(false);
  });

  it('não deve marcar opção desabilitada', () => {
    expect(caixas()[3].disabled).toBe(true);
  });

  it('deve anunciar o erro e ligá-lo ao grupo', () => {
    hospedeiro.erro = 'Selecione ao menos um documento';
    fixture.detectChanges();

    const grupo: HTMLElement = fixture.nativeElement.querySelector('[role=group]');
    const alerta: HTMLElement = fixture.nativeElement.querySelector('[role=alert]');

    expect(alerta.textContent).toContain('Selecione ao menos um documento');
    expect(grupo.getAttribute('aria-invalid')).toBe('true');
    // Sem este vínculo o erro é visível e inaudível — o defeito que esta lib
    // já teve em oito componentes.
    expect(grupo.getAttribute('aria-describedby')).toBe(alerta.id);
  });
});
