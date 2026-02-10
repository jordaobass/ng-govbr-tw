import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Classe que o `govbr-contrast.css` usa como gancho, aplicada no `<html>`. */
const CLASSE_CONTRASTE = 'govbr-contrast';

/** Chave namespaced — `localStorage` é global, a lib não pode ocupar nome genérico. */
const CHAVE_ARMAZENAMENTO = 'govbr-tw.contrast';

/**
 * Controla o tema de alto contraste.
 *
 * Existe por dois motivos concretos:
 *
 * 1. **Persistência.** Antes, o estado morava num booleano de componente: o
 *    usuário ligava o alto contraste, recarregava a página e perdia. Para quem
 *    depende de alto contraste isso não é inconveniência, é a funcionalidade
 *    não existir.
 * 2. **Alcance.** O toggle só existia dentro do `br-header`, manipulando
 *    `document.documentElement` direto. Aplicação que não usa o header da lib
 *    não tinha como ligar o tema, e um componente visual não deveria ter efeito
 *    global.
 */
@Injectable({ providedIn: 'root' })
export class BrContrastService {
  private readonly ehNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _ativo = signal(false);

  /** Estado atual do alto contraste. */
  readonly ativo = this._ativo.asReadonly();

  constructor() {
    // No servidor não há `localStorage` nem `document`: ler aqui sem guarda é
    // o jeito clássico de derrubar o SSR na inicialização.
    if (!this.ehNavegador) return;

    if (this.lerPreferenciaSalva()) this.ligar();
  }

  ligar(): void {
    this.definir(true);
  }

  desligar(): void {
    this.definir(false);
  }

  alternar(): void {
    this.definir(!this._ativo());
  }

  definir(ativo: boolean): void {
    this._ativo.set(ativo);
    if (!this.ehNavegador) return;

    document.documentElement.classList.toggle(CLASSE_CONTRASTE, ativo);
    this.salvarPreferencia(ativo);
  }

  private lerPreferenciaSalva(): boolean {
    // `localStorage` lança em modo privado de alguns navegadores e quando o
    // usuário bloqueia armazenamento — preferência perdida não pode virar
    // tela branca.
    try {
      return localStorage.getItem(CHAVE_ARMAZENAMENTO) === 'true';
    } catch {
      return false;
    }
  }

  private salvarPreferencia(ativo: boolean): void {
    try {
      localStorage.setItem(CHAVE_ARMAZENAMENTO, String(ativo));
    } catch {
      // Sem persistência o tema ainda funciona na sessão atual.
    }
  }
}
