import {
  ChangeDetectionStrategy,
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BrContrastService } from '../../services/br-contrast.service';


@Component({
  selector: 'br-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <header [class]="headerClasses" role="banner" #headerEl>
      <div [class]="containerClasses">
    
        <!-- ═══ HEADER-TOP ═══ -->
        <div [class]="topRowClasses">
    
          <!-- Logo + divider + signature -->
          <div class="flex items-center gap-0 min-w-0">
            @if (logoSrc) {
              <a [href]="logoHref || '/'" [attr.aria-label]="signature || systemTitle || 'Página inicial'">
                <img
                  [src]="logoSrc"
                  [alt]="''"
                  [class]="logoClasses"
                  />
              </a>
            }
            @if (logoSrc && signature) {
              <span
                [class]="dividerClasses"
                role="separator"
              ></span>
            }
            @if (signature) {
              <span [class]="signClasses">{{ signature }}</span>
            }
          </div>
    
          <!-- Actions -->
          <div class="flex items-center gap-0" role="toolbar" aria-label="Ações do sistema">
    
            <!-- Links de Acesso Rápido (⋮) -->
            @if (hasLinks) {
              <div class="relative" #linksDropRef>
                <button
                  type="button"
                  [class]="actionBtnClasses"
                  aria-label="Acesso Rápido"
                  [attr.aria-expanded]="linksDropOpen"
                  aria-haspopup="true"
                  (click)="toggleLinksDrop()"
                  >
                  <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
                </button>
                @if (linksDropOpen) {
                  <div
                    class="absolute right-0 top-full mt-1 w-60 bg-govbr-bg rounded shadow-lg border border-govbr-gray-10 py-1 z-50 font-rawline text-govbr-gray-80"
                    role="menu"
                    aria-label="Acesso Rápido"
                    >
                    <span class="block px-4 py-1.5 text-govbr-xs font-semibold text-govbr-gray-60 uppercase tracking-wider" aria-hidden="true">Acesso Rápido</span>
                    <ng-content select="[header-links]"></ng-content>
                  </div>
                }
              </div>
            }
    
            @if (hasLinks && hasFunctions) {
              <span [class]="separatorSmClasses" role="separator"></span>
            }
    
            <!-- Funcionalidades (⊞) -->
            @if (hasFunctions) {
              <div class="relative" #funcsDropRef>
                <button
                  type="button"
                  [class]="actionBtnClasses"
                  aria-label="Funcionalidades do Sistema"
                  [attr.aria-expanded]="funcsDropOpen"
                  aria-haspopup="true"
                  (click)="toggleFuncsDrop()"
                  >
                  <i class="fa-solid fa-grip" aria-hidden="true"></i>
                </button>
                @if (funcsDropOpen) {
                  <div
                    class="absolute right-0 top-full mt-1 w-60 bg-govbr-bg rounded shadow-lg border border-govbr-gray-10 py-1 z-50 font-rawline text-govbr-gray-80"
                    role="menu"
                    aria-label="Funcionalidades"
                    >
                    <span class="block px-4 py-1.5 text-govbr-xs font-semibold text-govbr-gray-60 uppercase tracking-wider" aria-hidden="true">Funcionalidades</span>
                    <ng-content select="[header-functions]"></ng-content>
                  </div>
                }
              </div>
            }
    
            <!-- Contrast toggle -->
            @if (showContrast) {
              <button
                type="button"
                [class]="actionBtnClasses"
                [attr.aria-label]="contrastActive ? 'Desativar alto contraste' : 'Ativar alto contraste'"
                [attr.aria-pressed]="contrastActive"
                (click)="toggleContrast()"
                >
                <i class="fa-solid fa-circle-half-stroke" aria-hidden="true"></i>
              </button>
            }
    
            <!-- Search trigger -->
            @if (showSearch) {
              <button
                type="button"
                [class]="actionBtnClasses"
                [attr.aria-label]="searchOpen ? 'Fechar busca' : 'Abrir busca'"
                [attr.aria-expanded]="searchOpen"
                (click)="toggleSearch()"
                >
                <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              </button>
            }
    
            <!-- Login / Avatar -->
            @if (showLogin || userName) {
              <div class="relative" #avatarRef>
                @if (!userName) {
                  <button
                    type="button"
                    [class]="signInBtnClasses"
                    aria-label="Entrar no sistema"
                    (click)="signIn.emit()"
                    >
                    <i class="fa-solid fa-user" aria-hidden="true"></i>
                    <span class="hidden sm:inline ml-1.5">Entrar</span>
                  </button>
                }
                @if (userName) {
                  <button
                    type="button"
                    [class]="avatarBtnClasses"
                    [attr.aria-expanded]="avatarMenuOpen"
                    aria-haspopup="true"
                    [attr.aria-label]="'Menu do usuário ' + userName"
                    (click)="toggleAvatarMenu()"
                    >
                    <div [class]="avatarImgClasses">
                      @if (avatarSrc) {
                        <img [src]="avatarSrc" [alt]="userName" class="w-full h-full object-cover rounded-full" />
                      }
                      @if (!avatarSrc) {
                        <span class="text-xs font-bold" aria-hidden="true">{{ userInitials }}</span>
                      }
                    </div>
                    <span [class]="avatarNameClasses" class="hidden sm:inline">{{ userName }}</span>
                    <i [class]="avatarChevronClasses" [class.rotate-180]="avatarMenuOpen" aria-hidden="true"></i>
                  </button>
                }
                <!-- Avatar dropdown -->
                @if (avatarMenuOpen) {
                  <div
                    class="absolute right-0 top-full mt-1 w-64 bg-govbr-bg rounded shadow-lg border border-govbr-gray-10 py-0 z-50 font-rawline overflow-hidden"
                    role="menu"
                    aria-label="Menu do usuário"
                    >
                    <div class="flex items-center gap-3 px-4 py-3 bg-govbr-gray-2 border-b border-govbr-gray-10">
                      <div class="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-govbr-primary-lightest text-govbr-primary">
                        @if (avatarSrc) {
                          <img [src]="avatarSrc" [alt]="userName" class="w-full h-full object-cover rounded-full" />
                        }
                        @if (!avatarSrc) {
                          <span class="text-sm font-bold" aria-hidden="true">{{ userInitials }}</span>
                        }
                      </div>
                      <div class="min-w-0">
                        <span class="block text-govbr-sm font-semibold text-govbr-gray-80 truncate">{{ userName }}</span>
                        @if (userRole) {
                          <span class="block text-govbr-xs text-govbr-gray-60 truncate">{{ userRole }}</span>
                        }
                      </div>
                    </div>
                    <div class="py-1" role="group">
                      <ng-content select="[avatar-menu]"></ng-content>
                    </div>
                    <div class="border-t border-govbr-gray-10">
                      <button
                        type="button"
                        class="flex items-center w-full px-4 py-2.5 text-govbr-sm text-govbr-danger-dark hover:bg-govbr-gray-2 transition-colors text-left"
                        role="menuitem"
                        (click)="logout.emit(); closeAvatarMenu()"
                        >
                        <i class="fa-solid fa-right-from-bracket mr-3 text-sm" aria-hidden="true"></i>
                        Sair
                      </button>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
    
        <!-- ═══ HEADER-BOTTOM ═══ -->
        <div [class]="bottomRowClasses">
          <div class="flex items-center gap-3 min-w-0">
            <!-- Hamburger (always visible) -->
            @if (menuMode !== 'none') {
              <button
                type="button"
                [class]="hamburgerClasses"
                [attr.aria-label]="menuOpen ? 'Fechar menu' : 'Abrir menu'"
                [attr.aria-expanded]="menuOpen"
                aria-controls="main-navigation"
                (click)="toggleMenu()"
                >
                <i [class]="menuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" aria-hidden="true"></i>
              </button>
            }
    
            <div class="min-w-0">
              <h1 [class]="titleClasses">{{ systemTitle }}</h1>
              @if (systemSubtitle && !isCompact) {
                <p [class]="subtitleClasses">{{ systemSubtitle }}</p>
              }
            </div>
          </div>
    
          <!-- Expanded search bar -->
          @if (showSearch && searchOpen) {
            <div
              class="flex items-center gap-2 flex-1 max-w-md ml-4"
              role="search"
              aria-label="Busca do sistema"
              >
              <label for="header-search-input" class="sr-only">O que você procura?</label>
              <div class="flex items-center flex-1 bg-govbr-bg rounded border border-govbr-gray-10 overflow-hidden">
                <input
                  id="header-search-input"
                  type="search"
                  class="flex-1 px-3 py-2 text-sm text-govbr-gray-80 outline-none bg-transparent"
                  placeholder="O que você procura?"
                  [value]="searchValue"
                  (input)="searchValue = $any($event.target).value"
                  (keydown.enter)="searchSubmit.emit(searchValue)"
                  (keydown.escape)="closeSearch()"
                  #searchInput
                  />
                <button
                  type="button"
                  class="px-3 py-2 text-govbr-primary hover:bg-govbr-gray-2 transition-colors"
                  aria-label="Pesquisar"
                  (click)="searchSubmit.emit(searchValue)"
                  >
                  <i class="fa-solid fa-magnifying-glass text-sm" aria-hidden="true"></i>
                </button>
              </div>
              <button
                type="button"
                [class]="hamburgerClasses"
                aria-label="Fechar busca"
                (click)="closeSearch()"
                >
                <i class="fa-solid fa-xmark" aria-hidden="true"></i>
              </button>
            </div>
          }
        </div>
    
      </div>
    </header>
    `,
})
export class BrHeaderComponent implements AfterContentInit, OnInit {
  @Input() systemTitle = '';
  @Input() systemSubtitle?: string;
  @Input() logoSrc = '';
  @Input() logoHref?: string;
  @Input() signature?: string;

  @Input() avatarSrc?: string;
  @Input() userName?: string;
  @Input() userRole?: string;
  @Input() showLogin = true;

  @Input() showSearch = true;
  @Input() showContrast = false;
  @Input() contrastActive = false;
  @Input() hasLinks = false;
  @Input() hasFunctions = false;

  @Input() variant: 'primary' | 'white' = 'primary';
  @Input() density: 'small' | 'medium' | 'large' = 'medium';
  @Input() sticky = false;

  @Input() menuMode: 'sidebar' | 'mega' | 'none' = 'sidebar';
  /** Se true, o conteúdo ocupa 100% da largura. Se false, limita a 1280px e centraliza. */
  @Input() fullWidth = false;

  @Output() menuToggle = new EventEmitter<boolean>();
  @Output() logout = new EventEmitter<void>();
  @Output() signIn = new EventEmitter<void>();
  @Output() searchSubmit = new EventEmitter<string>();
  @Output() contrastChange = new EventEmitter<boolean>();

  @ContentChild('quickAccessItems') quickAccessItems?: TemplateRef<unknown>;
  @ViewChild('headerEl', { static: true }) headerEl!: ElementRef;
  @ViewChild('searchInput') searchInput?: ElementRef;

  menuOpen = true;
  avatarMenuOpen = false;
  linksDropOpen = false;
  funcsDropOpen = false;
  searchOpen = false;
  searchValue = '';
  isCompact = false;
  private headerHeight = 0;

  private elementRef = inject(ElementRef);
  private readonly contraste = inject(BrContrastService);

  ngAfterContentInit(): void {
    if (this.sticky) {
      this.headerHeight = this.headerEl?.nativeElement?.offsetHeight || 0;
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.closeAllDropdowns();
    this.menuToggle.emit(this.menuOpen);
  }

  closeMenu(): void {
    this.menuOpen = false;
    this.menuToggle.emit(false);
  }

  toggleAvatarMenu(): void {
    this.avatarMenuOpen = !this.avatarMenuOpen;
    this.linksDropOpen = false;
    this.funcsDropOpen = false;
  }

  closeAvatarMenu(): void { this.avatarMenuOpen = false; }

  toggleLinksDrop(): void {
    this.linksDropOpen = !this.linksDropOpen;
    this.funcsDropOpen = false;
    this.avatarMenuOpen = false;
  }

  toggleFuncsDrop(): void {
    this.funcsDropOpen = !this.funcsDropOpen;
    this.linksDropOpen = false;
    this.avatarMenuOpen = false;
  }

  toggleSearch(): void {
    this.searchOpen = !this.searchOpen;
    this.closeAllDropdowns();
    if (this.searchOpen) {
      setTimeout(() => this.searchInput?.nativeElement?.focus(), 50);
    }
  }

  closeSearch(): void { this.searchOpen = false; }

  ngOnInit(): void {
    // `contrastActive` segue sendo @Input (API pública inalterada). Se o
    // consumidor pediu o tema ligado, o pedido manda; senão, adota-se o estado
    // que o service recuperou do armazenamento.
    if (this.contrastActive) this.contraste.ligar();
    else this.contrastActive = this.contraste.ativo();
  }

  toggleContrast(): void {
    // Quem mexe no <html> e persiste é o BrContrastService — um componente
    // visual não deve ter efeito global, e o estado precisa sobreviver ao F5.
    this.contraste.alternar();
    this.contrastActive = this.contraste.ativo();
    this.contrastChange.emit(this.contrastActive);
  }

  private closeAllDropdowns(): void {
    this.avatarMenuOpen = false;
    this.linksDropOpen = false;
    this.funcsDropOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeAllDropdowns();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeAllDropdowns();
    if (this.searchOpen) this.closeSearch();
    if (this.menuOpen) this.closeMenu();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.sticky) return;
    this.isCompact = window.scrollY > (this.headerHeight || 80);
  }

  get userInitials(): string {
    if (!this.userName) return '';
    return this.userName.split(' ').filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('');
  }

  get isWhite(): boolean { return this.variant === 'white'; }

  // ── Style getters ──

  get containerClasses(): string {
    return this.fullWidth
      ? 'px-4 sm:px-6 lg:px-8'
      : 'max-w-[1280px] mx-auto px-4';
  }

  get headerClasses(): string {
    const base = 'font-rawline relative z-[1000]';
    const stickyClass = this.sticky ? 'sticky top-0' : '';
    const shadow = this.isWhite ? 'border-b border-govbr-gray-10' : 'shadow-md';
    const bg = this.isWhite ? 'bg-govbr-bg' : 'bg-govbr-primary text-govbr-on-primary';
    return `${base} ${stickyClass} ${shadow} ${bg}`.trim();
  }

  get topRowClasses(): string {
    const py = this.isCompact || this.density === 'small' ? 'py-1' : 'py-2';
    return `flex items-center justify-between ${py}`;
  }

  get bottomRowClasses(): string {
    const pyMap = { small: 'py-2', medium: 'py-3', large: 'py-4' } as const;
    const py = this.isCompact ? 'py-2' : pyMap[this.density];
    const border = this.isWhite ? 'border-t border-govbr-gray-10' : 'border-t border-govbr-on-primary/10';
    return `flex items-center justify-between ${py} ${border}`;
  }

  get logoClasses(): string {
    const sizeMap = { small: 'h-6', medium: 'h-8', large: 'h-12' } as const;
    const size = this.isCompact ? 'h-6' : sizeMap[this.density];
    return `${size} flex-shrink-0 transition-all duration-200`;
  }

  get dividerClasses(): string {
    const height = this.isCompact || this.density === 'small' ? 'h-4' : 'h-8';
    const color = this.isWhite ? 'bg-govbr-gray-20' : 'bg-govbr-bg/30';
    return `inline-block w-px ${height} mx-3 flex-shrink-0 ${color}`;
  }

  get signClasses(): string {
    const size = this.isCompact || this.density === 'small' ? 'text-xs' : 'text-sm';
    const color = this.isWhite ? 'text-govbr-gray-60' : 'text-govbr-on-primary/80';
    return `${size} font-medium ${color} hidden sm:inline`;
  }

  get actionBtnClasses(): string {
    const size = this.isCompact || this.density === 'small' ? 'w-8 h-8 text-sm' : 'w-10 h-10';
    const color = this.isWhite
      ? 'text-govbr-primary hover:bg-govbr-primary-lightest'
      : 'text-govbr-on-primary hover:bg-govbr-bg/10';
    return `flex items-center justify-center rounded-full transition-colors ${size} ${color}`;
  }

  get separatorSmClasses(): string {
    const color = this.isWhite ? 'bg-govbr-gray-20' : 'bg-govbr-bg/30';
    return `inline-block w-px h-4 mx-1 sm:mx-2 flex-shrink-0 ${color}`;
  }

  get signInBtnClasses(): string {
    const color = this.isWhite
      ? 'text-govbr-primary hover:bg-govbr-primary-lightest'
      : 'text-govbr-on-primary hover:bg-govbr-bg/10';
    return `flex items-center px-3 py-2 rounded-full text-sm font-semibold transition-colors ${color}`;
  }

  get avatarBtnClasses(): string {
    const color = this.isWhite ? 'hover:bg-govbr-gray-2' : 'hover:bg-govbr-bg/10';
    return `flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors cursor-pointer ${color}`;
  }

  get avatarImgClasses(): string {
    const size = this.isCompact || this.density === 'small' ? 'w-7 h-7' : 'w-9 h-9';
    const color = this.isWhite
      ? 'bg-govbr-primary-lightest text-govbr-primary'
      : 'bg-govbr-bg/20 text-govbr-on-primary';
    return `flex items-center justify-center ${size} rounded-full overflow-hidden flex-shrink-0 ${color}`;
  }

  get avatarNameClasses(): string {
    const color = this.isWhite ? 'text-govbr-gray-80' : 'text-govbr-on-primary';
    return `text-sm font-semibold max-w-[120px] truncate ${color}`;
  }

  get avatarChevronClasses(): string {
    const color = this.isWhite ? 'text-govbr-gray-60' : 'text-govbr-on-primary/60';
    return `fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${color}`;
  }

  get hamburgerClasses(): string {
    const size = this.isCompact || this.density === 'small' ? 'w-8 h-8 text-sm' : 'w-10 h-10';
    const color = this.isWhite
      ? 'text-govbr-primary hover:bg-govbr-primary-lightest'
      : 'text-govbr-on-primary hover:bg-govbr-bg/10';
    return `flex items-center justify-center rounded-full transition-colors flex-shrink-0 ${size} ${color}`;
  }

  /** Title: responsive sizes matching GovBR DS tokens */
  get titleClasses(): string {
    // GovBR DS: base → sm: font-size-scale-up-02 → lg: font-size-scale-up-03
    const sizeMap = {
      small: 'text-base sm:text-lg',
      medium: 'text-base sm:text-lg lg:text-xl',
      large: 'text-lg sm:text-xl lg:text-2xl',
    } as const;
    const size = this.isCompact ? 'text-base sm:text-lg' : sizeMap[this.density];
    const color = this.isWhite ? 'text-govbr-primary' : 'text-govbr-on-primary';
    return `${size} font-bold leading-tight ${color}`;
  }

  /** Subtitle: hidden on mobile, visible sm+, font-weight 500 */
  get subtitleClasses(): string {
    const sizeMap = {
      small: 'text-xs',
      medium: 'text-xs lg:text-sm',
      large: 'text-sm lg:text-base',
    } as const;
    const size = this.isCompact ? 'text-xs' : sizeMap[this.density];
    const color = this.isWhite ? 'text-govbr-gray-60' : 'text-govbr-on-primary/80';
    return `hidden sm:block ${size} font-medium mt-0.5 ${color}`;
  }
}
