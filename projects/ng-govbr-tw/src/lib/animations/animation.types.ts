/**
 * Tipos e interfaces para o sistema de animações Gov.br
 * @description Sistema de animações configurável e acessível
 */

/** Tipos de animação de entrada */
export type BrAnimationEnter =
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'scaleIn'
  | 'slideInUp'
  | 'slideInDown'
  | 'slideInLeft'
  | 'slideInRight'
  | 'expandHeight'
  | 'expandWidth';

/** Tipos de animação de saída */
export type BrAnimationLeave =
  | 'fadeOut'
  | 'fadeOutUp'
  | 'fadeOutDown'
  | 'fadeOutLeft'
  | 'fadeOutRight'
  | 'scaleOut'
  | 'slideOutUp'
  | 'slideOutDown'
  | 'slideOutLeft'
  | 'slideOutRight'
  | 'collapseHeight'
  | 'collapseWidth';

/** Tipos de animação de atenção/feedback */
export type BrAnimationAttention =
  | 'pulse'
  | 'shake'
  | 'bounce'
  | 'wiggle'
  | 'flash'
  | 'heartbeat'
  | 'swing';

/** Tipos de animação de loading */
export type BrAnimationLoading =
  | 'spin'
  | 'dots'
  | 'bars'
  | 'shimmer'
  | 'wave'
  | 'progressIndeterminate';

/** Tipos de animação de hover */
export type BrAnimationHover =
  | 'lift'
  | 'grow'
  | 'shrink'
  | 'glow'
  | 'underline'
  | 'ripple';

/** Tipos de animação de sucesso/feedback */
export type BrAnimationFeedback =
  | 'checkmark'
  | 'successPop'
  | 'errorShake'
  | 'warningPulse';

/** União de todos os tipos de animação */
export type BrAnimationType =
  | BrAnimationEnter
  | BrAnimationLeave
  | BrAnimationAttention
  | BrAnimationLoading
  | BrAnimationHover
  | BrAnimationFeedback;

/** Curvas de easing disponíveis */
export type BrAnimationEasing =
  | 'linear'
  | 'ease'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'easeInBack'
  | 'easeOutBack'
  | 'easeInOutBack'
  | 'easeInElastic'
  | 'easeOutElastic'
  | 'easeOutBounce';

/** Mapeamento de easing para valores CSS */
export const BR_ANIMATION_EASING_MAP: Record<BrAnimationEasing, string> = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  easeInElastic: 'cubic-bezier(0.5, -0.5, 0.75, 1.25)',
  easeOutElastic: 'cubic-bezier(0.25, -0.25, 0.25, 1.5)',
  easeOutBounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

/** Durações predefinidas */
export type BrAnimationDuration = 'instant' | 'fast' | 'normal' | 'slow' | 'slower';

/** Mapeamento de duração para valores em ms */
export const BR_ANIMATION_DURATION_MAP: Record<BrAnimationDuration, number> = {
  instant: 100,
  fast: 150,
  normal: 250,
  slow: 400,
  slower: 600,
} as const;

/** Configuração de uma animação individual */
export interface BrAnimationConfig {
  /** Tipo da animação */
  type: BrAnimationType;
  /** Duração em ms ou predefinida */
  duration?: number | BrAnimationDuration;
  /** Delay antes de iniciar em ms */
  delay?: number;
  /** Curva de easing */
  easing?: BrAnimationEasing;
  /** Número de iterações (Infinity para loop) */
  iterations?: number | 'infinite';
  /** Direção da animação */
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  /** Estado final após animação */
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

/** Configuração de animação de entrada/saída */
export interface BrTransitionConfig {
  /** Animação de entrada */
  enter?: BrAnimationConfig;
  /** Animação de saída */
  leave?: BrAnimationConfig;
}

/** Configuração global de animações */
export interface BrAnimationGlobalConfig {
  /** Habilita/desabilita todas as animações globalmente */
  enabled: boolean;
  /** Respeita preferência do usuário (prefers-reduced-motion) */
  respectReducedMotion: boolean;
  /** Duração padrão para todas as animações */
  defaultDuration: number | BrAnimationDuration;
  /** Easing padrão para todas as animações */
  defaultEasing: BrAnimationEasing;
}

/** Configuração padrão global */
export const BR_ANIMATION_DEFAULT_CONFIG: BrAnimationGlobalConfig = {
  enabled: false, // Desabilitado por padrão
  respectReducedMotion: true,
  defaultDuration: 'normal',
  defaultEasing: 'easeOut',
} as const;

/** Estado de uma animação em execução */
export interface BrAnimationState {
  /** Se está animando */
  isAnimating: boolean;
  /** Tipo atual */
  currentAnimation: BrAnimationType | null;
  /** Se foi concluída */
  isCompleted: boolean;
  /** Se foi cancelada */
  isCancelled: boolean;
}

/** Evento emitido durante animação */
export interface BrAnimationEvent {
  /** Tipo da animação */
  type: BrAnimationType;
  /** Fase: início, fim, cancelamento */
  phase: 'start' | 'end' | 'cancel';
  /** Elemento alvo */
  element: HTMLElement;
  /** Timestamp do evento */
  timestamp: number;
}

/** Trigger para iniciar animação */
export type BrAnimationTrigger =
  | 'immediate'     // Imediatamente ao montar
  | 'visible'       // Quando visível no viewport (Intersection Observer)
  | 'hover'         // No hover
  | 'focus'         // No focus
  | 'click'         // No click
  | 'manual';       // Controlado programaticamente

/** Configuração para diretiva brAnimate */
export interface BrAnimateDirectiveConfig {
  /** Animação a executar */
  animation: BrAnimationType;
  /** Trigger que inicia a animação */
  trigger?: BrAnimationTrigger;
  /** Duração */
  duration?: number | BrAnimationDuration;
  /** Delay */
  delay?: number;
  /** Easing */
  easing?: BrAnimationEasing;
  /** Threshold para Intersection Observer (0-1) */
  visibilityThreshold?: number;
  /** Se deve animar apenas uma vez */
  once?: boolean;
}

/** Configuração para stagger (animação em sequência) */
export interface BrStaggerConfig {
  /** Animação base */
  animation: BrAnimationType;
  /** Delay entre cada item em ms */
  staggerDelay: number;
  /** Delay inicial antes do primeiro item */
  initialDelay?: number;
  /** Duração de cada animação */
  duration?: number | BrAnimationDuration;
  /** Easing */
  easing?: BrAnimationEasing;
}
