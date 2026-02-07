import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  inject,
  effect,
} from '@angular/core';
import { BrAnimationService } from './animation.service';
import {
  BrAnimationType,
  BrAnimationDuration,
  BrAnimationEasing,
  BrAnimationTrigger,
  BrAnimationEvent,
} from './animation.types';

/**
 * Diretiva para aplicar animações a qualquer elemento
 *
 * @example
 * <!-- Animação imediata -->
 * <div brAnimate="fadeInUp">Conteúdo</div>
 *
 * <!-- Animação quando visível -->
 * <div brAnimate="fadeInUp" brAnimateTrigger="visible">Conteúdo</div>
 *
 * <!-- Com configurações -->
 * <div brAnimate="scaleIn" [brAnimateDuration]="300" brAnimateEasing="easeOutBack">
 *   Conteúdo
 * </div>
 *
 * <!-- Stagger em lista -->
 * <ul>
 *   <li *ngFor="let item of items; let i = index"
 *       brAnimate="fadeInUp"
 *       [brAnimateDelay]="i * 50">
 *     {{ item }}
 *   </li>
 * </ul>
 */
@Directive({
  selector: '[brAnimate]',
  standalone: true,
})
export class BrAnimateDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly animationService = inject(BrAnimationService);

  /** Tipo de animação */
  @Input('brAnimate') animation: BrAnimationType = 'fadeIn';

  /** Trigger que inicia a animação */
  @Input() brAnimateTrigger: BrAnimationTrigger = 'immediate';

  /** Duração da animação */
  @Input() brAnimateDuration?: number | BrAnimationDuration;

  /** Delay antes de iniciar */
  @Input() brAnimateDelay?: number;

  /** Curva de easing */
  @Input() brAnimateEasing?: BrAnimationEasing;

  /** Threshold para Intersection Observer (0-1) */
  @Input() brAnimateThreshold = 0.1;

  /** Se deve animar apenas uma vez */
  @Input() brAnimateOnce = true;

  /** Se a animação está habilitada */
  @Input() brAnimateEnabled = true;

  /** Evento emitido no início da animação */
  @Output() brAnimateStart = new EventEmitter<BrAnimationEvent>();

  /** Evento emitido no fim da animação */
  @Output() brAnimateEnd = new EventEmitter<BrAnimationEvent>();

  private observer?: IntersectionObserver;
  private hasAnimated = false;
  private boundHandleAnimationEnd = this.handleAnimationEnd.bind(this);
  private boundHandleHover = this.handleHover.bind(this);
  private boundHandleHoverOut = this.handleHoverOut.bind(this);
  private boundHandleFocus = this.handleFocus.bind(this);
  private boundHandleBlur = this.handleBlur.bind(this);
  private boundHandleClick = this.handleClick.bind(this);

  constructor() {
    // Reage a mudanças no serviço de animação
    effect(() => {
      if (!this.animationService.isEnabled()) {
        this.clearAnimation();
      }
    });
  }

  ngOnInit(): void {
    if (!this.brAnimateEnabled) return;

    this.setupTrigger();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  /**
   * Inicia a animação programaticamente
   */
  play(): void {
    if (!this.canAnimate()) return;
    this.applyAnimation();
  }

  /**
   * Reseta a animação para poder rodar novamente
   */
  reset(): void {
    this.hasAnimated = false;
    this.clearAnimation();
  }

  private setupTrigger(): void {
    const element = this.el.nativeElement as HTMLElement;

    switch (this.brAnimateTrigger) {
      case 'immediate':
        // Pequeno delay para garantir que o elemento está no DOM
        requestAnimationFrame(() => this.play());
        break;

      case 'visible':
        this.setupIntersectionObserver();
        break;

      case 'hover':
        element.addEventListener('mouseenter', this.boundHandleHover);
        element.addEventListener('mouseleave', this.boundHandleHoverOut);
        break;

      case 'focus':
        element.addEventListener('focus', this.boundHandleFocus);
        element.addEventListener('blur', this.boundHandleBlur);
        break;

      case 'click':
        element.addEventListener('click', this.boundHandleClick);
        break;

      case 'manual':
        // Não faz nada, espera chamada programática
        break;
    }

    // Listener para fim da animação
    element.addEventListener('animationend', this.boundHandleAnimationEnd);
  }

  private setupIntersectionObserver(): void {
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: anima imediatamente
      this.play();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && this.canAnimate()) {
            this.applyAnimation();

            if (this.brAnimateOnce) {
              this.observer?.disconnect();
            }
          }
        });
      },
      { threshold: this.brAnimateThreshold }
    );

    this.observer.observe(this.el.nativeElement);
  }

  private canAnimate(): boolean {
    if (!this.brAnimateEnabled) return false;
    if (!this.animationService.isEnabled()) return false;
    if (this.brAnimateOnce && this.hasAnimated) return false;
    return true;
  }

  private applyAnimation(): void {
    const element = this.el.nativeElement as HTMLElement;
    const duration = this.animationService.resolveDuration(this.brAnimateDuration);
    const easing = this.animationService.resolveEasing(this.brAnimateEasing);
    const delay = this.brAnimateDelay || 0;

    // Emite evento de início
    this.brAnimateStart.emit({
      type: this.animation,
      phase: 'start',
      element,
      timestamp: Date.now(),
    });

    // Aplica a animação
    element.style.animation = `br-${this.animation} ${duration}ms ${easing} ${delay}ms both`;

    this.hasAnimated = true;
  }

  private clearAnimation(): void {
    const element = this.el.nativeElement as HTMLElement;
    element.style.animation = '';
  }

  private handleAnimationEnd(): void {
    const element = this.el.nativeElement as HTMLElement;

    this.brAnimateEnd.emit({
      type: this.animation,
      phase: 'end',
      element,
      timestamp: Date.now(),
    });

    // Para triggers de hover/focus, limpa para poder repetir
    if (this.brAnimateTrigger === 'hover' || this.brAnimateTrigger === 'focus') {
      this.clearAnimation();
    }
  }

  private handleHover(): void {
    if (this.canAnimate() || this.brAnimateTrigger === 'hover') {
      this.hasAnimated = false; // Permite repetir no hover
      this.applyAnimation();
    }
  }

  private handleHoverOut(): void {
    this.clearAnimation();
  }

  private handleFocus(): void {
    if (this.canAnimate() || this.brAnimateTrigger === 'focus') {
      this.hasAnimated = false;
      this.applyAnimation();
    }
  }

  private handleBlur(): void {
    this.clearAnimation();
  }

  private handleClick(): void {
    if (this.canAnimate() || this.brAnimateTrigger === 'click') {
      this.hasAnimated = false;
      this.clearAnimation();
      // Força reflow para reiniciar a animação
      this.el.nativeElement.getBoundingClientRect();
      this.applyAnimation();
    }
  }

  private cleanup(): void {
    const element = this.el.nativeElement as HTMLElement;

    this.observer?.disconnect();

    element.removeEventListener('animationend', this.boundHandleAnimationEnd);
    element.removeEventListener('mouseenter', this.boundHandleHover);
    element.removeEventListener('mouseleave', this.boundHandleHoverOut);
    element.removeEventListener('focus', this.boundHandleFocus);
    element.removeEventListener('blur', this.boundHandleBlur);
    element.removeEventListener('click', this.boundHandleClick);
  }
}
