import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrModalComponent } from './br-modal.component';

/**
 * Foco é o contrato que `role="dialog"` + `aria-modal` prometem (WCAG 2.4.3).
 * Estes testes existem porque a promessa estava sendo feita sem ser cumprida:
 * o componente não tinha uma única chamada a `focus()`.
 */
describe('BrModalComponent — gestão de foco', () => {
  let component: BrModalComponent;
  let fixture: ComponentFixture<BrModalComponent>;
  let gatilho: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Confirmar ação');

    // Um elemento fora do modal para fazer o papel de quem abriu o diálogo.
    gatilho = document.createElement('button');
    gatilho.textContent = 'Abrir';
    document.body.appendChild(gatilho);
    gatilho.focus();
  });

  afterEach(() => {
    // Sem destruir, o @HostListener('document:keydown') da instância anterior
    // continua ativo e responde ao evento do teste seguinte.
    fixture.destroy();
    gatilho.remove();
  });

  /** Abre o modal pelo caminho real: muda o @Input e avisa o ngOnChanges. */
  function abrir(): void {
    fixture.componentRef.setInput('isOpen', true);
    component.ngOnChanges({
      isOpen: {
        previousValue: false,
        currentValue: true,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    fixture.detectChanges();
  }

  function fechar(): void {
    fixture.componentRef.setInput('isOpen', false);
    component.ngOnChanges({
      isOpen: {
        previousValue: true,
        currentValue: false,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    fixture.detectChanges();
  }

  function focaveis(): HTMLElement[] {
    const dialogo = fixture.nativeElement.querySelector('[role="dialog"]');
    return Array.from(
      dialogo.querySelectorAll(
        'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])'
      )
    );
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should move focus into the dialog when opened', async () => {
    abrir();
    // O foco inicial é agendado para depois do render do @if.
    await new Promise((r) => setTimeout(r));

    const dialogo = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialogo).toBeTruthy();
    expect(dialogo.contains(document.activeElement)).toBe(true);
  });

  it('should wrap focus from the last focusable back to the first on Tab', async () => {
    abrir();
    await new Promise((r) => setTimeout(r));

    const lista = focaveis();
    expect(lista.length).toBeGreaterThan(1);

    const ultimo = lista[lista.length - 1];
    ultimo.focus();
    expect(document.activeElement).toBe(ultimo);

    // `cancelable: true` NÃO é detalhe: sem ele, preventDefault() é no-op e o
    // teste acusaria falha do componente por defeito do próprio experimento.
    const evento = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(evento);

    expect(evento.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(lista[0]);
  });

  it('should wrap focus backwards from the first to the last on Shift+Tab', async () => {
    abrir();
    await new Promise((r) => setTimeout(r));

    const lista = focaveis();
    lista[0].focus();

    const evento = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(evento);

    expect(evento.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(lista[lista.length - 1]);
  });

  it('should return focus to the element that opened it when closed', async () => {
    abrir();
    await new Promise((r) => setTimeout(r));
    expect(document.activeElement).not.toBe(gatilho);

    fechar();

    expect(document.activeElement).toBe(gatilho);
  });

  it('should not leave the backdrop in the tab order', () => {
    abrir();

    const backdrop = fixture.nativeElement.querySelector('[aria-hidden="true"]');
    expect(backdrop).toBeTruthy();
    expect(backdrop.getAttribute('tabindex')).toBeNull();
    expect(backdrop.getAttribute('role')).toBeNull();
  });
});
