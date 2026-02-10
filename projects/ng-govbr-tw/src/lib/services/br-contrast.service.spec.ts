import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrContrastService } from './br-contrast.service';

const CHAVE = 'govbr-tw.contrast';

describe('BrContrastService', () => {
  afterEach(() => {
    localStorage.removeItem(CHAVE);
    document.documentElement.classList.remove('govbr-contrast');
  });

  function criar(platform: unknown = 'browser'): BrContrastService {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: platform }],
    });
    return TestBed.inject(BrContrastService);
  }

  it('should start disabled when nothing was saved', () => {
    const servico = criar();
    expect(servico.ativo()).toBe(false);
    expect(document.documentElement.classList.contains('govbr-contrast')).toBe(false);
  });

  it('should apply the class on <html> when enabled', () => {
    const servico = criar();
    servico.ligar();

    expect(servico.ativo()).toBe(true);
    expect(document.documentElement.classList.contains('govbr-contrast')).toBe(true);
  });

  it('should toggle back and forth', () => {
    const servico = criar();
    servico.alternar();
    expect(servico.ativo()).toBe(true);
    servico.alternar();
    expect(servico.ativo()).toBe(false);
    expect(document.documentElement.classList.contains('govbr-contrast')).toBe(false);
  });

  /**
   * O ponto principal: antes, o estado vivia num booleano de componente e o F5
   * desligava o tema. Para quem depende de alto contraste, isso é a
   * funcionalidade não existir.
   */
  it('should survive a reload by restoring the saved preference', () => {
    criar().ligar();
    expect(localStorage.getItem(CHAVE)).toBe('true');

    // Nova instância = o que acontece ao recarregar a página.
    const depoisDoReload = criar();

    expect(depoisDoReload.ativo()).toBe(true);
    expect(document.documentElement.classList.contains('govbr-contrast')).toBe(true);
  });

  it('should not touch the DOM or storage on the server', () => {
    localStorage.setItem(CHAVE, 'true');

    // Construtor que lê localStorage sem guarda é o jeito clássico de derrubar
    // o SSR na inicialização — aqui ele tem de ficar inerte.
    const servico = criar('server');

    expect(servico.ativo()).toBe(false);
    expect(document.documentElement.classList.contains('govbr-contrast')).toBe(false);
  });
});
