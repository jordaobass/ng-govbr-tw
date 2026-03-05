import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrSuccessCheckComponent } from './success-check.component';

/**
 * O ✓ precisa estar visível em REPOUSO.
 *
 * O componente nascia com `stroke-dashoffset: 24` — o traço inteiro
 * escondido — e só a animação `br-check-draw` o revelava. Mas a animação da
 * biblioteca é **opt-in**: `BR_ANIMATION_DEFAULT_CONFIG.enabled` é `false`.
 * Resultado: para todo consumidor que não habilitou animação — e para quem
 * tem movimento reduzido ligado, que é preferência de acessibilidade — o
 * componente mostrava um círculo colorido VAZIO.
 *
 * Não havia teste nenhum aqui, e o defeito chegou ao site publicado.
 */
describe('BrSuccessCheckComponent', () => {
  let fixture: ComponentFixture<BrSuccessCheckComponent>;

  const caminho = (): SVGPathElement =>
    fixture.nativeElement.querySelector('path.br-success-check-path');
  const caixa = (): HTMLElement => fixture.nativeElement.querySelector('div');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BrSuccessCheckComponent] }).compileComponents();
    fixture = TestBed.createComponent(BrSuccessCheckComponent);
  });

  /*
   * ⚠️ Mede o `stroke-dashoffset` COMPUTADO, não a presença da classe.
   *
   * A primeira versão deste teste verificava
   * `classList.contains('…--animar') === false`. Mutação provou que não
   * serve: tirando a classe E devolvendo `stroke-dashoffset: 24` ao CSS base,
   * a asserção continua verdadeira e o traço volta a ficar invisível. O que
   * importa é o resultado, não o mecanismo.
   */
  it('sem animação, o traço fica visível — não escondido esperando ela', () => {
    fixture.componentRef.setInput('animate', false);
    fixture.detectChanges();

    expect(getComputedStyle(caminho()).strokeDashoffset).toBe('0px');
  });

  it('com a animação desligada por configuração, idem', () => {
    // `animate` é `true`, mas o serviço está desabilitado por padrão — é o
    // caso de TODO consumidor que não ligou animação explicitamente.
    fixture.componentRef.setInput('animate', true);
    fixture.detectChanges();

    expect(fixture.componentInstance.isAnimationEnabled).toBe(false);
    expect(getComputedStyle(caminho()).strokeDashoffset).toBe('0px');
  });

  it('nenhuma classe sai como a string "undefined"', () => {
    // `variantStyles[undefined]` é `undefined`, e o template literal o
    // interpola como TEXTO: o componente perdia fundo e cor do traço e sumia
    // na tela branca.
    fixture.componentRef.setInput('variant', undefined as never);
    fixture.componentRef.setInput('size', undefined as never);
    fixture.detectChanges();

    expect(caixa().className).not.toContain('undefined');
    expect(caminho().parentElement?.className ?? '').not.toContain('undefined');
  });

  it('valor desconhecido cai no padrão em vez de quebrar', () => {
    fixture.componentRef.setInput('variant', 'inexistente' as never);
    fixture.detectChanges();

    expect(caixa().className).toContain('bg-govbr-success');
  });

  it('é anunciado como imagem com rótulo', () => {
    fixture.componentRef.setInput('ariaLabel', 'Cadastro concluído');
    fixture.detectChanges();

    expect(caixa().getAttribute('role')).toBe('img');
    expect(caixa().getAttribute('aria-label')).toBe('Cadastro concluído');
  });
});
