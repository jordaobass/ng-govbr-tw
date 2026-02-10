import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrSkiplinkComponent } from './br-skiplink.component';

describe('BrSkiplinkComponent', () => {
  let component: BrSkiplinkComponent;
  let fixture: ComponentFixture<BrSkiplinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrSkiplinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrSkiplinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the default skip target', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('#conteudo');
    expect(link.textContent?.trim()).toBe('Ir para o conteúdo');
  });

  it('should label the navigation landmark', () => {
    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Atalhos de navegação');
  });

  it('should render one link per item', () => {
    component.itens = [
      { href: '#conteudo', label: 'Ir para o conteúdo' },
      { href: '#rodape', label: 'Ir para o rodapé' },
    ];
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a');
    expect(links.length).toBe(2);
    expect(links[1].getAttribute('href')).toBe('#rodape');
  });

  /**
   * O atalho tem de ser alcançável por teclado. `display:none` ou
   * `visibility:hidden` o tirariam da ordem de tabulação — e aí ele deixa de
   * existir exatamente para quem precisa dele.
   */
  it('should stay focusable while visually hidden', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    const estilo = getComputedStyle(link);

    expect(estilo.display).not.toBe('none');
    expect(estilo.visibility).not.toBe('hidden');

    link.focus();
    expect(document.activeElement).toBe(link);
  });
});
