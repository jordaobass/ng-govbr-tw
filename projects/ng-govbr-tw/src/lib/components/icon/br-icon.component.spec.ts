import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrIconComponent } from './br-icon.component';

describe('BrIconComponent', () => {
  let fixture: ComponentFixture<BrIconComponent>;

  const i = (): HTMLElement => fixture.nativeElement.querySelector('i');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BrIconComponent] }).compileComponents();
    fixture = TestBed.createComponent(BrIconComponent);
  });

  /**
   * O comportamento que justifica o componente existir: a decisão de
   * acessibilidade deixa de depender de alguém lembrar do `aria-hidden`.
   */
  it('sem rótulo é decorativo e some para o leitor de tela', () => {
    fixture.componentRef.setInput('name', 'house');
    fixture.detectChanges();

    expect(i().getAttribute('aria-hidden')).toBe('true');
    expect(i().getAttribute('role')).toBeNull();
    expect(i().getAttribute('aria-label')).toBeNull();
  });

  it('com rótulo carrega significado e é anunciado', () => {
    fixture.componentRef.setInput('name', 'triangle-exclamation');
    fixture.componentRef.setInput('label', 'Atenção');
    fixture.detectChanges();

    expect(i().getAttribute('role')).toBe('img');
    expect(i().getAttribute('aria-label')).toBe('Atenção');
    // Anunciado E escondido ao mesmo tempo seria contraditório: o
    // `aria-hidden` vence e o rótulo nunca sairia.
    expect(i().getAttribute('aria-hidden')).toBeNull();
  });

  it('monta a classe com a grafia longa da família', () => {
    fixture.componentRef.setInput('name', 'magnifying-glass');
    fixture.componentRef.setInput('variant', 'regular');
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    // `fa-regular`, não `far`: as duas valem, mas misturá-las no mesmo projeto
    // esconde erro de digitação.
    expect(i().className).toContain('fa-regular');
    expect(i().className).toContain('fa-magnifying-glass');
    expect(i().className).toContain('text-govbr-lg');
  });

  it('aceita classe extra do consumidor sem perder as próprias', () => {
    fixture.componentRef.setInput('name', 'check');
    fixture.componentRef.setInput('extraClass', 'text-govbr-success mr-2');
    fixture.detectChanges();

    expect(i().className).toContain('fa-check');
    expect(i().className).toContain('text-govbr-success');
  });
});
