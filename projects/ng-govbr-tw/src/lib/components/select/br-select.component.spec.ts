import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrSelectComponent } from './br-select.component';

/**
 * Padrão combobox do WAI-ARIA.
 *
 * Antes destes testes o `br-select` não tinha `aria-haspopup`, `aria-expanded`
 * nem `aria-activedescendant`, e as opções eram `<li tabindex="0">` com apenas
 * `keydown.enter`: não havia navegação por setas, e o Tab atravessava a lista
 * inteira. Para um leitor de tela, não era um combobox — era uma pilha de
 * itens focáveis.
 */
describe('BrSelectComponent — padrão combobox', () => {
  let component: BrSelectComponent;
  let fixture: ComponentFixture<BrSelectComponent>;

  const OPCOES = [
    { value: 'sp', label: 'São Paulo' },
    { value: 'rj', label: 'Rio de Janeiro' },
    { value: 'mg', label: 'Minas Gerais', disabled: true },
    { value: 'ba', label: 'Bahia' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrSelectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Estado');
    fixture.componentRef.setInput('options', OPCOES);
    fixture.detectChanges();
  });

  function gatilho(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[role="combobox"]');
  }

  function tecla(key: string, extras: Partial<KeyboardEventInit> = {}): KeyboardEvent {
    const evento = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...extras });
    gatilho().dispatchEvent(evento);
    fixture.detectChanges();
    return evento;
  }

  it('should declare the combobox contract on the trigger', () => {
    const botao = gatilho();
    expect(botao).toBeTruthy();
    expect(botao.getAttribute('aria-haspopup')).toBe('listbox');
    expect(botao.getAttribute('aria-expanded')).toBe('false');
  });

  it('should expose the listbox through aria-controls when open', () => {
    // Clique real, não `component.toggle()`: sob OnPush só o evento do
    // template marca a view como suja — que é como o usuário opera.
    gatilho().click();
    fixture.detectChanges();

    const id = gatilho().getAttribute('aria-controls');
    expect(id).toBeTruthy();
    expect(fixture.nativeElement.querySelector(`#${id}`)?.getAttribute('role')).toBe('listbox');
  });

  it('should open with ArrowDown and move the active option without moving DOM focus', () => {
    const focoAntes = document.activeElement;

    tecla('ArrowDown');
    expect(component.expanded).toBe(true);
    expect(component.indiceAtivo).toBe(0);

    tecla('ArrowDown');
    expect(component.indiceAtivo).toBe(1);

    // O foco do DOM NÃO acompanha: quem anda é o aria-activedescendant.
    expect(document.activeElement).toBe(focoAntes);
    expect(gatilho().getAttribute('aria-activedescendant')).toBe(
      `${component.selectId}-opt-1`
    );
  });

  it('should skip disabled options when navigating', () => {
    tecla('ArrowDown'); // abre no índice 0
    tecla('ArrowDown'); // 1
    tecla('ArrowDown'); // pula o 2 (desabilitado) e vai ao 3

    expect(component.indiceAtivo).toBe(3);
    expect(OPCOES[2].disabled).toBe(true);
  });

  it('should jump to first and last with Home and End', () => {
    tecla('ArrowDown');
    tecla('End');
    expect(component.indiceAtivo).toBe(3);

    tecla('Home');
    expect(component.indiceAtivo).toBe(0);
  });

  it('should select the active option with Enter', () => {
    tecla('ArrowDown');
    tecla('ArrowDown'); // Rio de Janeiro
    tecla('Enter');

    expect(component.expanded).toBe(false);
    expect(component.displayValue).toBe('Rio de Janeiro');
  });

  it('should close on Escape without selecting', () => {
    tecla('ArrowDown');
    const antes = component.displayValue;

    const evento = tecla('Escape');

    expect(evento.defaultPrevented).toBe(true);
    expect(component.expanded).toBe(false);
    expect(component.displayValue).toBe(antes);
  });

  it('should mark options with role=option and keep them out of the tab order', () => {
    gatilho().click();
    fixture.detectChanges();

    const opcoes = fixture.nativeElement.querySelectorAll('[role="option"]');
    expect(opcoes.length).toBe(OPCOES.length);
    for (const opcao of opcoes) {
      // tabindex="0" nas opções é o sintoma de não haver padrão combobox:
      // o Tab passaria por cada item da lista.
      expect(opcao.getAttribute('tabindex')).toBe('-1');
    }
  });

  it('should point aria-activedescendant at an element that exists', () => {
    tecla('ArrowDown');

    const id = gatilho().getAttribute('aria-activedescendant');
    expect(id).toBeTruthy();
    expect(fixture.nativeElement.querySelector(`#${id}`)).toBeTruthy();
  });
});
