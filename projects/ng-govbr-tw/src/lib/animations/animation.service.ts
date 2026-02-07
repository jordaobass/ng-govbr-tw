import { Injectable, signal, computed, inject, InjectionToken } from '@angular/core';
import {
  BrAnimationGlobalConfig,
  BrAnimationDuration,
  BrAnimationEasing,
  BrAnimationConfig,
  BR_ANIMATION_DEFAULT_CONFIG,
  BR_ANIMATION_DURATION_MAP,
  BR_ANIMATION_EASING_MAP,
} from './animation.types';

/** Token para injetar configuração customizada */
export const BR_ANIMATION_CONFIG = new InjectionToken<Partial<BrAnimationGlobalConfig>>(
  'BR_ANIMATION_CONFIG'
);

/**
 * Serviço de animações Gov.br
 * @description Gerencia configuração global e estado das animações
 *
 * @example
 * // No módulo/componente principal
 * providers: [
 *   {
 *     provide: BR_ANIMATION_CONFIG,
 *     useValue: { enabled: true, defaultDuration: 'fast' }
 *   }
 * ]
 *
 * // No componente
 * constructor(private animationService: BrAnimationService) {
 *   this.animationService.enable();
 * }
 */
@Injectable({
  providedIn: 'root',
})
export class BrAnimationService {
  /** Configuração global reativa */
  private readonly _config = signal<BrAnimationGlobalConfig>({ ...BR_ANIMATION_DEFAULT_CONFIG });

  /** Se animações estão habilitadas (considera reduced motion) */
  readonly isEnabled = computed(() => {
    const config = this._config();
    if (!config.enabled) return false;
    if (config.respectReducedMotion && this._prefersReducedMotion()) return false;
    return true;
  });

  /** Configuração atual (readonly) */
  readonly config = computed(() => this._config());

  /** Cache de media query */
  private _reducedMotionQuery: MediaQueryList | null = null;

  /** Custom config injected optionally */
  private readonly _customConfig = inject(BR_ANIMATION_CONFIG, { optional: true });

  constructor() {
    // Merge com configuração customizada
    if (this._customConfig) {
      this._config.update(current => ({ ...current, ...this._customConfig }));
    }

    // Setup listener para prefers-reduced-motion
    this._setupReducedMotionListener();
  }

  /**
   * Habilita animações globalmente
   */
  enable(): void {
    this._config.update(config => ({ ...config, enabled: true }));
  }

  /**
   * Desabilita animações globalmente
   */
  disable(): void {
    this._config.update(config => ({ ...config, enabled: false }));
  }

  /**
   * Toggle do estado de animações
   */
  toggle(): void {
    this._config.update(config => ({ ...config, enabled: !config.enabled }));
  }

  /**
   * Atualiza configuração global
   */
  configure(config: Partial<BrAnimationGlobalConfig>): void {
    this._config.update(current => ({ ...current, ...config }));
  }

  /**
   * Define duração padrão
   */
  setDefaultDuration(duration: number | BrAnimationDuration): void {
    this._config.update(config => ({ ...config, defaultDuration: duration }));
  }

  /**
   * Define easing padrão
   */
  setDefaultEasing(easing: BrAnimationEasing): void {
    this._config.update(config => ({ ...config, defaultEasing: easing }));
  }

  /**
   * Resolve duração para valor em ms
   */
  resolveDuration(duration?: number | BrAnimationDuration): number {
    if (duration === undefined) {
      const defaultDur = this._config().defaultDuration;
      return typeof defaultDur === 'number' ? defaultDur : BR_ANIMATION_DURATION_MAP[defaultDur];
    }
    return typeof duration === 'number' ? duration : BR_ANIMATION_DURATION_MAP[duration];
  }

  /**
   * Resolve easing para valor CSS
   */
  resolveEasing(easing?: BrAnimationEasing): string {
    const resolvedEasing = easing || this._config().defaultEasing;
    return BR_ANIMATION_EASING_MAP[resolvedEasing];
  }

  /**
   * Gera string de animação CSS
   */
  getAnimationString(config: BrAnimationConfig): string {
    if (!this.isEnabled()) return 'none';

    const duration = this.resolveDuration(config.duration);
    const easing = this.resolveEasing(config.easing);
    const delay = config.delay || 0;
    const iterations = config.iterations === 'infinite' ? 'infinite' : (config.iterations || 1);
    const direction = config.direction || 'normal';
    const fillMode = config.fillMode || 'both';

    return `br-${config.type} ${duration}ms ${easing} ${delay}ms ${iterations} ${direction} ${fillMode}`;
  }

  /**
   * Aplica animação a um elemento
   */
  animate(element: HTMLElement, config: BrAnimationConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isEnabled()) {
        resolve();
        return;
      }

      const animationString = this.getAnimationString(config);
      element.style.animation = animationString;

      const handleEnd = () => {
        element.removeEventListener('animationend', handleEnd);
        element.removeEventListener('animationcancel', handleCancel);
        resolve();
      };

      const handleCancel = () => {
        element.removeEventListener('animationend', handleEnd);
        element.removeEventListener('animationcancel', handleCancel);
        reject(new Error('Animation cancelled'));
      };

      element.addEventListener('animationend', handleEnd);
      element.addEventListener('animationcancel', handleCancel);
    });
  }

  /**
   * Remove animação de um elemento
   */
  clearAnimation(element: HTMLElement): void {
    element.style.animation = '';
  }

  /**
   * Verifica se usuário prefere movimento reduzido
   */
  private _prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return this._reducedMotionQuery?.matches ?? false;
  }

  /**
   * Configura listener para mudanças de preferência
   */
  private _setupReducedMotionListener(): void {
    if (typeof window === 'undefined') return;

    this._reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Força re-avaliação quando preferência muda
    this._reducedMotionQuery.addEventListener('change', () => {
      // Trigger recomputation via signal update
      this._config.update(config => ({ ...config }));
    });
  }
}
