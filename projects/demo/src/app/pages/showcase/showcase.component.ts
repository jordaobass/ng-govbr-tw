import { Component, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  BrButtonComponent,
  BrInputComponent,
  BrBadgeComponent,
  BrMessageComponent,
  BrTableComponent,
  BrCardComponent,
  BrModalComponent,
  BrLoadingComponent,
  BrTabComponent,
  BrTabPanelComponent,
  BrCheckboxComponent,
  BrRadioGroupComponent,
  BrSelectComponent,
  BrTextareaComponent,
  BrPaginationComponent,
  BrBreadcrumbComponent,
  BrTooltipComponent,
  BrAccordionComponent,
  BrAccordionItemComponent,
  BrListComponent,
  BrItemComponent,
  BrWizardComponent,
  BrWizardStepComponent,
  BrDatepickerComponent,
  BrTimepickerComponent,
  BrDatetimepickerComponent,
  BrUploadComponent,
  BrAvatarComponent,
  BrSkeletonComponent,
  BrChipComponent,
  BrSwitchComponent,
  BrNotificationComponent,
  BrStepperComponent,
  BrTimelineComponent,
  BrDividerComponent,
  BrSigninComponent,
  BrCookiebarComponent,
  BrMagicButtonComponent,
  BrInputCpfComponent,
  BrInputCnpjComponent,
  BrInputCepComponent,
  BrInputTelefoneComponent,
  BrInputMoneyComponent,
  BrSidebarComponent,
  BrSidebarItemComponent,
  BrSidebarSubComponent,
  BrMegaMenuComponent,
  BrMegaMenuTriggerComponent,
  BrMegaMenuPanelComponent,
  BrMegaMenuColumnComponent,
  BrMegaMenuLinkComponent,
  BrHeaderComponent,
  BrToastContainerComponent,
  BrToastService,
  BrMenuComponent,
  BrMenuItemComponent,
  BrMenuBarComponent,
  BrMenuBarItemComponent,
  BrMenuBarSubItemComponent,
  BrSuccessCheckComponent,
  BrSkiplinkComponent,
  BrLayoutComponent,
  BrSidebarGroupComponent,
  BrSidebarGroupLabelComponent,
  BrContrastService,
  type BrSkiplinkItem,
} from 'ng-govbr-tw';
import type { BrRadioOption, BrSelectOption, BrBreadcrumbItem, BrTabItem, BrStepperStep, BrCookieGroup } from 'ng-govbr-tw';

interface ComponentSection {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BrButtonComponent,
    BrInputComponent,
    BrBadgeComponent,
    BrMessageComponent,
    BrTableComponent,
    BrCardComponent,
    BrModalComponent,
    BrLoadingComponent,
    BrTabComponent,
    BrTabPanelComponent,
    BrCheckboxComponent,
    BrRadioGroupComponent,
    BrSelectComponent,
    BrTextareaComponent,
    BrPaginationComponent,
    BrBreadcrumbComponent,
    BrTooltipComponent,
    BrAccordionComponent,
    BrAccordionItemComponent,
    BrListComponent,
    BrItemComponent,
    BrWizardComponent,
    BrWizardStepComponent,
    BrDatepickerComponent,
    BrTimepickerComponent,
    BrDatetimepickerComponent,
    BrUploadComponent,
    BrAvatarComponent,
    BrSkeletonComponent,
    BrChipComponent,
    BrSwitchComponent,
    BrNotificationComponent,
    BrStepperComponent,
    BrTimelineComponent,
    BrDividerComponent,
    BrSigninComponent,
    BrCookiebarComponent,
    BrMagicButtonComponent,
    BrInputCpfComponent,
    BrInputCnpjComponent,
    BrInputCepComponent,
    BrInputTelefoneComponent,
    BrInputMoneyComponent,
    BrSidebarComponent,
    BrSidebarItemComponent,
    BrSidebarSubComponent,
    BrMegaMenuComponent,
    BrMegaMenuTriggerComponent,
    BrMegaMenuPanelComponent,
    BrMegaMenuColumnComponent,
    BrMegaMenuLinkComponent,
    BrHeaderComponent,
    BrToastContainerComponent,
    BrMenuComponent,
    BrMenuItemComponent,
    BrMenuBarComponent,
    BrMenuBarItemComponent,
    BrMenuBarSubItemComponent,
    BrSuccessCheckComponent,
    BrSkiplinkComponent,
    BrLayoutComponent,
    BrSidebarGroupComponent,
    BrSidebarGroupLabelComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <!-- Top Navigation Bar -->
    <header class="showcase-topbar">
      <div class="showcase-topbar-content">
        <div class="showcase-topbar-brand">
          <span class="showcase-topbar-title">ng-govbr-tw</span>
        </div>
        <nav class="showcase-topbar-nav">
          <button
            type="button"
            class="showcase-topbar-link"
            [class.active]="currentView === 'componentes'"
            (click)="currentView = 'componentes'"
          >
            <i class="fas fa-puzzle-piece"></i>
            <span>Componentes</span>
          </button>
          <button
            type="button"
            class="showcase-topbar-link"
            [class.active]="currentView === 'blocos'"
            (click)="currentView = 'blocos'"
          >
            <i class="fas fa-layer-group"></i>
            <span>Blocos</span>
          </button>
          <!-- Contrast Toggle -->
          <button
            type="button"
            class="showcase-topbar-contrast"
            [attr.aria-label]="contrastActive ? 'Desativar alto contraste' : 'Ativar alto contraste'"
            [attr.aria-pressed]="contrastActive"
            (click)="toggleContrast()"
          >
            <i class="fas fa-circle-half-stroke"></i>
          </button>
        </nav>
      </div>
    </header>

    <!-- ═══════════════════════════════════════════════════════════════════════
         VIEW: COMPONENTES
         ═══════════════════════════════════════════════════════════════════════ -->
    @if (currentView === 'componentes') {
      <div class="showcase-container">
        <!-- Mobile Sidebar Toggle -->
        <button
          type="button"
          class="showcase-mobile-toggle"
          (click)="toggleMobileMenu()"
          aria-label="Abrir menu de componentes"
        >
          <i class="fas fa-bars"></i>
        </button>

        <!-- Sidebar Overlay (mobile) -->
        @if (mobileMenuOpen) {
          <div
            class="showcase-overlay"
            (click)="closeMobileMenu()"
          ></div>
        }

        <!-- Sidebar Navigation -->
        <aside
          class="showcase-sidebar"
          [class.open]="mobileMenuOpen"
        >
          <div class="showcase-sidebar-header">
            <h2 class="text-lg font-bold text-govbr-primary">Componentes</h2>
            <p class="text-govbr-xs text-govbr-gray-40">{{ sections.length }} componentes</p>
            <button
              type="button"
              class="showcase-sidebar-close"
              (click)="closeMobileMenu()"
              aria-label="Fechar menu"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <nav class="showcase-sidebar-nav">
            @for (section of sections; track section.id) {
              <a
                [href]="'#' + section.id"
                class="showcase-nav-item"
                [class.active]="activeSection === section.id"
              (click)="setActiveSection(section.id); closeMobileMenu()"
            >
              <i class="fa-solid fa-{{ section.icon }} w-4 text-center"></i>
              <span>{{ section.name }}</span>
            </a>
          }
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="showcase-main">
        <div class="showcase-content">

          <!-- ─── BUTTONS ────────────────────────────────────────────── -->
          <section id="buttons" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Button</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Botões para ações e interações</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 space-y-4">
                <div class="flex flex-wrap gap-3 items-center">
                  <br-button emphasis="primary">Primário</br-button>
                  <br-button emphasis="secondary">Secundário</br-button>
                  <br-button emphasis="tertiary">Terciário</br-button>
                  <br-button emphasis="danger">Perigo</br-button>
                </div>
                <div class="flex flex-wrap gap-3 items-center">
                  <br-button emphasis="primary" icon="plus">Com Ícone</br-button>
                  <br-button emphasis="primary" [loading]="true">Carregando</br-button>
                  <br-button emphasis="primary" [circle]="true" icon="plus"></br-button>
                </div>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button
                  class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2"
                  (click)="toggleCode('buttons')"
                >
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['buttons'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['buttons']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['buttons'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── INPUT ────────────────────────────────────────────── -->
          <section id="input" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Input</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Campos de entrada de texto</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <br-input label="Nome completo" placeholder="Digite seu nome" [(ngModel)]="nameValue" [required]="true"></br-input>
                <br-input label="E-mail" type="email" placeholder="seu@email.com" icon="envelope"></br-input>
                <br-input label="Senha" type="password" placeholder="Digite sua senha"></br-input>
                <br-input label="Busca" type="search" placeholder="O que você procura?"></br-input>
                <br-input label="Com erro" error="Este campo é obrigatório"></br-input>
                <br-input label="Com sucesso" successMessage="Campo válido"></br-input>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('input')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['input'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['input']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['input'] }}</code></pre>
                }
              </div>
            </div>

            <!-- Input + Button Alignment Examples -->
            <div class="mt-6">
              <h3 class="text-lg font-semibold text-govbr-gray-80 mb-3">Input + Botão Alinhados</h3>
              <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
                <div class="p-6 space-y-6">
                  <!-- Com label -->
                  <div>
                    <p class="text-govbr-xs text-govbr-gray-40 mb-2">Com label (items-end)</p>
                    <div class="flex items-end gap-2">
                      <br-input label="Buscar usuário" placeholder="Digite o nome..." class="flex-1"></br-input>
                      <br-button label="Pesquisar" icon="search"></br-button>
                    </div>
                  </div>

                  <!-- Sem label -->
                  <div>
                    <p class="text-govbr-xs text-govbr-gray-40 mb-2">Sem label</p>
                    <div class="flex gap-2">
                      <br-input placeholder="Digite o CEP..." class="flex-1"></br-input>
                      <br-button icon="search" variant="primary"></br-button>
                    </div>
                  </div>

                  <!-- Densidade small -->
                  <div>
                    <p class="text-govbr-xs text-govbr-gray-40 mb-2">Densidade small</p>
                    <div class="flex items-end gap-2">
                      <br-input label="Código" placeholder="Ex: 12345" density="small" class="flex-1"></br-input>
                      <br-button label="Validar" density="small" variant="secondary"></br-button>
                    </div>
                  </div>

                  <!-- Select + Button -->
                  <div>
                    <p class="text-govbr-xs text-govbr-gray-40 mb-2">Select + Botão</p>
                    <div class="flex items-end gap-2">
                      <br-select label="Estado" [options]="selectOptions" class="flex-1"></br-select>
                      <br-button label="Filtrar" icon="filter"></br-button>
                    </div>
                  </div>
                </div>

                <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                  <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('input-button')">
                    <i class="fa-solid fa-code"></i>
                    {{ showCode['input-button'] ? 'Ocultar código' : 'Ver código' }}
                  </button>
                  @if (showCode['input-button']) {
                    <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['input-button'] }}</code></pre>
                  }
                </div>
              </div>
            </div>
          </section>

          <!-- ─── INPUTS ESPECIALIZADOS ──────────────────────────────── -->
          <section id="input-masks" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Inputs com Máscara</h2>
              <p class="text-govbr-sm text-govbr-gray-40">CPF, CNPJ, CEP, Telefone e Valor monetário</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <br-input-cpf label="CPF" [(ngModel)]="cpfValue"></br-input-cpf>
                <br-input-cnpj label="CNPJ" [(ngModel)]="cnpjValue"></br-input-cnpj>
                <br-input-cep label="CEP" [(ngModel)]="cepValue"></br-input-cep>
                <br-input-telefone label="Telefone" [(ngModel)]="telefoneValue"></br-input-telefone>
                <br-input-money label="Valor" [(ngModel)]="moneyValue" prefix="R$"></br-input-money>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('input-masks')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['input-masks'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['input-masks']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['input-masks'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── SELECT ─────────────────────────────────────────────── -->
          <section id="select" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Select</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Seleção de opções em lista suspensa</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <br-select label="Estado" placeholder="Selecione" [options]="selectOptions" [(ngModel)]="selectedState"></br-select>
                <br-select label="Com busca" placeholder="Digite..." [options]="selectOptions" [searchable]="true"></br-select>
                <br-select label="Multi-seleção" placeholder="Escolha vários" [options]="selectOptions" [multiple]="true"></br-select>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('select')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['select'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['select']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['select'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── TEXTAREA ───────────────────────────────────────────── -->
          <section id="textarea" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Textarea</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Área de texto multilinha</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <br-textarea label="Descrição" placeholder="Digite..." [maxLength]="200" helperText="Máximo 200 caracteres"></br-textarea>
                <br-textarea label="Com erro" error="Campo obrigatório" [required]="true"></br-textarea>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('textarea')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['textarea'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['textarea']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['textarea'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── CHECKBOX ──────────────────────────────────────────── -->
          <section id="checkbox" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Checkbox</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Caixas de seleção múltipla</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 space-y-2">
                <br-checkbox label="Checado" [(ngModel)]="checkTerms"></br-checkbox>
                <br-checkbox label="Não checado" [(ngModel)]="checkNotif"></br-checkbox>
                <br-checkbox label="Indeterminado" [indeterminate]="true"></br-checkbox>
                <br-checkbox label="Desativado" [disabled]="true"></br-checkbox>
                <br-checkbox label="Inválido" state="invalid"></br-checkbox>
                <br-checkbox label="Válido" state="valid"></br-checkbox>
                <br-checkbox label="Com mensagem de erro" state="invalid" errorMessage="Campo obrigatório"></br-checkbox>
                <br-checkbox label="Tamanho pequeno" size="small"></br-checkbox>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('checkbox')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['checkbox'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['checkbox']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['checkbox'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── SWITCH ────────────────────────────────────────────── -->
          <section id="switch" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Switch</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Interruptor liga/desliga</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 space-y-3">
                <br-switch label="Modo escuro" [(ngModel)]="switchDark"></br-switch>
                <br-switch label="Notificações push" [(ngModel)]="switchNotif" helperText="Receba alertas"></br-switch>
                <br-switch label="Desabilitado" [disabled]="true"></br-switch>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('switch')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['switch'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['switch']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['switch'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── RADIO ──────────────────────────────────────────────── -->
          <section id="radio" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Radio Group</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Seleção única entre opções</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <br-radio-group legend="Tipo de pessoa" [options]="radioOptions" [(ngModel)]="radioValue"></br-radio-group>
                <br-radio-group legend="Inline" [options]="radioOptions" [inline]="true" [(ngModel)]="radioValue"></br-radio-group>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('radio')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['radio'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['radio']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['radio'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── CHIP ───────────────────────────────────────────────── -->
          <section id="chip" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Chip</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Tags e filtros selecionáveis</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 space-y-4">
                <div class="flex flex-wrap gap-2">
                  <br-chip label="Filtro 1" [selectable]="true" [(selected)]="chip1"></br-chip>
                  <br-chip label="Filtro 2" [selectable]="true" [(selected)]="chip2"></br-chip>
                  <br-chip label="Filtro 3" [selectable]="true" [(selected)]="chip3"></br-chip>
                </div>
                <div class="flex flex-wrap gap-2">
                  <br-chip label="Removível" [removable]="true"></br-chip>
                  <br-chip label="Com ícone" icon="tag" [removable]="true"></br-chip>
                  <br-chip label="Desabilitado" [disabled]="true"></br-chip>
                </div>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('chip')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['chip'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['chip']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['chip'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── BADGE ───────────────────────────────────────────────── -->
          <section id="badge" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Badge</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Rótulos de status e contagem</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 flex flex-wrap gap-2">
                <br-badge variant="primary">Primário</br-badge>
                <br-badge variant="success">Sucesso</br-badge>
                <br-badge variant="danger">Erro</br-badge>
                <br-badge variant="warning">Alerta</br-badge>
                <br-badge variant="neutral">Neutro</br-badge>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('badge')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['badge'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['badge']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['badge'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── NOTIFICATION ───────────────────────────────────────── -->
          <section id="notification" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Notification</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Badge de notificação sobre elementos</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 flex flex-wrap gap-6 items-center">
                <br-notification [count]="5">
                  <br-button emphasis="secondary" icon="bell" [circle]="true"></br-button>
                </br-notification>
                <br-notification [count]="150" [max]="99">
                  <br-button emphasis="secondary" icon="envelope" [circle]="true"></br-button>
                </br-notification>
                <br-notification [showDot]="true" variant="success">
                  <br-button emphasis="secondary" icon="check-circle" [circle]="true"></br-button>
                </br-notification>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('notification')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['notification'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['notification']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['notification'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── MESSAGE ───────────────────────────────────────────── -->
          <section id="message" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Message</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Mensagens de feedback e alertas</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 space-y-3">
                <br-message type="success">Operação realizada com sucesso!</br-message>
                <br-message type="danger">Ocorreu um erro ao processar.</br-message>
                <br-message type="warning" [dismissible]="true">Atenção: verifique os dados.</br-message>
                <br-message type="info">Informação: sistema em manutenção.</br-message>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('message')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['message'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['message']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['message'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── TOOLTIP ───────────────────────────────────────────── -->
          <section id="tooltip" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Tooltip</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Dicas contextuais ao passar o mouse</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 flex flex-wrap gap-4 items-center">
                <br-tooltip text="Tooltip acima" place="top">
                  <br-button emphasis="secondary" density="small">Top</br-button>
                </br-tooltip>
                <br-tooltip text="Tooltip abaixo" place="bottom">
                  <br-button emphasis="secondary" density="small">Bottom</br-button>
                </br-tooltip>
                <br-tooltip text="Tooltip à esquerda" place="left">
                  <br-button emphasis="secondary" density="small">Left</br-button>
                </br-tooltip>
                <br-tooltip text="Tooltip à direita" place="right">
                  <br-button emphasis="secondary" density="small">Right</br-button>
                </br-tooltip>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('tooltip')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['tooltip'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['tooltip']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['tooltip'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── AVATAR ───────────────────────────────────────────── -->
          <section id="avatar" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Avatar</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Representação visual de usuários</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 flex flex-wrap gap-4 items-end">
                <br-avatar name="Maria Silva" size="xsmall"></br-avatar>
                <br-avatar name="João Santos" size="small" variant="neutral"></br-avatar>
                <br-avatar name="Ana Oliveira" size="medium" status="online"></br-avatar>
                <br-avatar name="Carlos Souza" size="large" variant="success" status="busy"></br-avatar>
                <br-avatar src="https://i.pravatar.cc/80?img=5" name="Foto" size="large" status="online"></br-avatar>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('avatar')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['avatar'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['avatar']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['avatar'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── CARD ───────────────────────────────────────────── -->
          <section id="card" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Card</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Containers para conteúdo agrupado</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <br-card icon="users" linkText="Ver detalhes" linkRoute="/showcase">
                  <h3 class="text-lg font-semibold text-govbr-gray-80 mb-1">Usuários</h3>
                  <p class="text-3xl font-bold text-govbr-primary">1.234</p>
                </br-card>
                <br-card icon="file-lines" linkText="Ver relatórios" linkRoute="/showcase">
                  <h3 class="text-lg font-semibold text-govbr-gray-80 mb-1">Documentos</h3>
                  <p class="text-3xl font-bold text-govbr-primary">567</p>
                </br-card>
                <br-card icon="chart-line" linkText="Ver dashboard" linkRoute="/showcase">
                  <h3 class="text-lg font-semibold text-govbr-gray-80 mb-1">Solicitações</h3>
                  <p class="text-3xl font-bold text-govbr-success">98%</p>
                </br-card>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('card')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['card'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['card']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['card'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── LIST ───────────────────────────────────────────── -->
          <section id="list" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">List</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Lista de itens clicáveis</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6">
                <div class="max-w-md">
                  <br-list title="Serviços" variant="bordered">
                    <br-item title="Consulta CPF" subtitle="Receita Federal" icon="id-card" [clickable]="true" [showArrow]="true"></br-item>
                    <br-item title="Carteira de Trabalho" subtitle="Min. Trabalho" icon="briefcase" tag="Novo" [clickable]="true" [showArrow]="true"></br-item>
                    <br-item title="Meu INSS" subtitle="INSS" icon="shield-halved" [clickable]="true" [showArrow]="true"></br-item>
                  </br-list>
                </div>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('list')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['list'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['list']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['list'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── ACCORDION ───────────────────────────────────────────── -->
          <section id="accordion" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Accordion</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Painéis expansíveis</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6">
                <div class="max-w-xl">
                  <br-accordion mode="single">
                    <br-accordion-item title="O que é o Gov.br?" icon="circle-question" [open]="true">
                      <p class="text-govbr-sm text-govbr-gray-60">Plataforma do Governo Federal que reúne serviços públicos digitais.</p>
                    </br-accordion-item>
                    <br-accordion-item title="Como acessar?" icon="right-to-bracket">
                      <p class="text-govbr-sm text-govbr-gray-60">Acesse gov.br e faça login com sua conta.</p>
                    </br-accordion-item>
                  </br-accordion>
                </div>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('accordion')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['accordion'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['accordion']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['accordion'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── TABS ───────────────────────────────────────────── -->
          <section id="tabs" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Tabs</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Navegação por abas</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6">
                <div class="max-w-xl">
                  <br-tab [tabs]="tabItems" [(activeIndex)]="activeTab">
                    <br-tab-panel label="Dados Pessoais">
                      <p class="text-govbr-sm text-govbr-gray-60 py-4">Formulário com dados pessoais.</p>
                    </br-tab-panel>
                    <br-tab-panel label="Endereço">
                      <p class="text-govbr-sm text-govbr-gray-60 py-4">Formulário com endereço.</p>
                    </br-tab-panel>
                    <br-tab-panel label="Documentos">
                      <p class="text-govbr-sm text-govbr-gray-60 py-4">Upload de documentos.</p>
                    </br-tab-panel>
                  </br-tab>
                </div>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('tabs')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['tabs'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['tabs']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['tabs'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── TABLE ───────────────────────────────────────────── -->
          <section id="table" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Table</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Tabela de dados com paginação</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6">
                <br-table headerStyle="primary" [page]="tablePage" [totalPages]="5" (pageChange)="tablePage = $event">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>CPF</th>
                      <th>Situação</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Maria da Silva</td>
                      <td>123.456.789-00</td>
                      <td><br-badge variant="success">Ativo</br-badge></td>
                    </tr>
                    <tr>
                      <td>João Santos</td>
                      <td>987.654.321-00</td>
                      <td><br-badge variant="warning">Pendente</br-badge></td>
                    </tr>
                  </tbody>
                </br-table>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('table')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['table'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['table']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['table'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── PAGINATION ───────────────────────────────────────────── -->
          <section id="pagination" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Pagination</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Navegação entre páginas</p>
            </div>

            <!-- Variante Default -->
            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden mb-6">
              <div class="px-4 py-3 bg-govbr-gray-2 border-b border-govbr-gray-10">
                <h3 class="text-govbr-sm font-semibold text-govbr-gray-80">Variante: Default (com input)</h3>
                <p class="text-govbr-xs text-govbr-gray-40">Paginação com input numérico para ir para página</p>
              </div>
              <div class="p-6">
                <br-pagination
                  [page]="paginationPage"
                  [totalPages]="10"
                  [totalItems]="100"
                  [itemsPerPage]="10"
                  variant="default"
                  (pageChange)="paginationPage = $event"
                ></br-pagination>
              </div>
            </div>

            <!-- Variante Contextual -->
            <div class="bg-white rounded-lg border-2 border-govbr-primary overflow-hidden mb-6">
              <div class="px-4 py-3 bg-govbr-primary text-white">
                <h3 class="text-govbr-sm font-semibold">Variante: Contextual (padrão Gov.br)</h3>
                <p class="text-govbr-xs opacity-80">Paginação com dropdowns seguindo o Design System Gov.br</p>
              </div>
              <div class="p-6 bg-govbr-gray-2">
                <br-pagination
                  [page]="paginationPage2"
                  [totalPages]="10"
                  [totalItems]="100"
                  [itemsPerPage]="10"
                  [itemsPerPageOptions]="[10, 20, 50, 100]"
                  variant="contextual"
                  [showItemsPerPage]="true"
                  [showSummary]="true"
                  [showGoToPage]="true"
                  (pageChange)="paginationPage2 = $event"
                ></br-pagination>
              </div>
              <div class="px-4 py-3 border-t border-govbr-gray-10 bg-white">
                <p class="text-govbr-xs text-govbr-gray-60">
                  <i class="fas fa-info-circle text-govbr-primary mr-1"></i>
                  <strong>Elementos:</strong> Dropdown "Exibir X" | Info "1-10 de 100 itens" | Dropdown "Página X" | Setas ‹ ›
                </p>
              </div>
            </div>

            <!-- Código -->
            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('pagination')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['pagination'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['pagination']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['pagination'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── BREADCRUMB ───────────────────────────────────────────── -->
          <section id="breadcrumb" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Breadcrumb</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Navegação hierárquica</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6">
                <br-breadcrumb [items]="breadcrumbItems" [showHome]="true" homeRoute="/showcase"></br-breadcrumb>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('breadcrumb')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['breadcrumb'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['breadcrumb']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['breadcrumb'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── STEPPER ───────────────────────────────────────────── -->
          <section id="stepper" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Stepper</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Indicador de progresso em etapas</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6">
                <div class="max-w-2xl space-y-4">
                  <br-stepper [steps]="stepperSteps" [currentStep]="stepperCurrent" [clickable]="true" (stepChange)="stepperCurrent = $event"></br-stepper>
                  <div class="flex gap-2">
                    <br-button emphasis="secondary" (click)="stepperCurrent = Math.max(0, stepperCurrent - 1)">Anterior</br-button>
                    <br-button emphasis="primary" (click)="stepperCurrent = Math.min(stepperSteps.length - 1, stepperCurrent + 1)">Próximo</br-button>
                  </div>
                </div>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('stepper')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['stepper'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['stepper']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['stepper'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── TIMELINE ───────────────────────────────────────────── -->
          <section id="timeline" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Timeline</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Linha do tempo de eventos</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6">
                <div class="max-w-md">
                  <br-timeline [items]="timelineItems"></br-timeline>
                </div>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('timeline')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['timeline'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['timeline']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['timeline'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── LOADING ───────────────────────────────────────────── -->
          <section id="loading" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Loading</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Indicador de carregamento</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 flex flex-wrap gap-8 items-end">
                <div class="text-center">
                  <br-loading size="small"></br-loading>
                  <p class="text-govbr-xs text-govbr-gray-40 mt-2">Small</p>
                </div>
                <div class="text-center">
                  <br-loading size="medium"></br-loading>
                  <p class="text-govbr-xs text-govbr-gray-40 mt-2">Medium</p>
                </div>
                <div class="text-center">
                  <br-loading size="large"></br-loading>
                  <p class="text-govbr-xs text-govbr-gray-40 mt-2">Large</p>
                </div>
                <div class="text-center">
                  <br-loading size="medium" [progress]="65"></br-loading>
                  <p class="text-govbr-xs text-govbr-gray-40 mt-2">65%</p>
                </div>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('loading')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['loading'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['loading']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['loading'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── SKELETON ───────────────────────────────────────────── -->
          <section id="skeleton" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Skeleton</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Placeholder de carregamento</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <br-skeleton variant="line" width="w-3/4"></br-skeleton>
                  <br-skeleton variant="line"></br-skeleton>
                  <br-skeleton variant="line" width="w-1/2"></br-skeleton>
                </div>
                <br-skeleton variant="card"></br-skeleton>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('skeleton')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['skeleton'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['skeleton']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['skeleton'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── MODAL ───────────────────────────────────────────── -->
          <section id="modal" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Modal</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Janelas de diálogo</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 flex flex-wrap gap-3">
                <br-button emphasis="primary" (click)="modalOpen = true">Abrir Modal</br-button>
                <br-button emphasis="danger" (click)="modalDangerOpen = true">Modal Danger</br-button>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('modal')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['modal'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['modal']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['modal'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── WIZARD ───────────────────────────────────────────── -->
          <section id="wizard" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Wizard</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Formulário em etapas</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6">
                <div class="max-w-xl">
                  <br-wizard [currentStep]="wizardStep" (stepChange)="wizardStep = $event" [showNavigation]="true">
                    <br-wizard-step label="Dados pessoais" icon="user">
                      <p class="text-govbr-sm text-govbr-gray-60 py-4">Preencha seus dados pessoais.</p>
                    </br-wizard-step>
                    <br-wizard-step label="Endereço" icon="location-dot">
                      <p class="text-govbr-sm text-govbr-gray-60 py-4">Informe seu endereço.</p>
                    </br-wizard-step>
                    <br-wizard-step label="Revisão" icon="check">
                      <p class="text-govbr-sm text-govbr-gray-60 py-4">Revise os dados.</p>
                    </br-wizard-step>
                  </br-wizard>
                </div>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('wizard')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['wizard'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['wizard']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['wizard'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── DATEPICKER ───────────────────────────────────────────── -->
          <section id="datepicker" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Date & Time Pickers</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Seletores de data e hora</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <br-datepicker label="Data" [(ngModel)]="dateValue"></br-datepicker>
                <br-timepicker label="Horário" [(ngModel)]="timeValue"></br-timepicker>
                <br-datetimepicker label="Agendamento" layout="vertical" [(ngModel)]="datetimeValue" class="md:col-span-2"></br-datetimepicker>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('datepicker')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['datepicker'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['datepicker']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['datepicker'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── UPLOAD ───────────────────────────────────────────── -->
          <section id="upload" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Upload</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Envio de arquivos</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6">
                <div class="max-w-lg">
                  <br-upload label="Documentos" accept=".pdf,.jpg,.png" [multiple]="true" [maxSizeMB]="5" helperText="PDF, JPG ou PNG até 5MB"></br-upload>
                </div>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('upload')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['upload'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['upload']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['upload'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── DIVIDER ───────────────────────────────────────────── -->
          <section id="divider" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Divider</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Separador de conteúdo</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 space-y-4">
                <p class="text-govbr-sm text-govbr-gray-60">Conteúdo acima</p>
                <br-divider></br-divider>
                <p class="text-govbr-sm text-govbr-gray-60">Conteúdo abaixo</p>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('divider')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['divider'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['divider']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['divider'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── SIGNIN ───────────────────────────────────────────── -->
          <section id="signin" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Sign-in Gov.br</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Botão de login Gov.br</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 flex flex-wrap gap-4">
                <br-signin variant="primary" size="medium"></br-signin>
                <br-signin variant="secondary" size="medium"></br-signin>
                <br-signin variant="dark" size="medium"></br-signin>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('signin')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['signin'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['signin']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['signin'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── MAGIC BUTTON ───────────────────────────────────────────── -->
          <section id="magic-button" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Magic Button (FAB)</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Botão flutuante de ação</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 relative min-h-[200px] bg-govbr-gray-2">
                <p class="text-govbr-sm text-govbr-gray-60 mb-4">Clique no botão flutuante para ver as ações.</p>
                <br-magic-button icon="plus" [actions]="magicActions"></br-magic-button>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('magic-button')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['magic-button'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['magic-button']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['magic-button'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── SIDEBAR ───────────────────────────────────────────────────── -->
          <section id="sidebar-demo" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Sidebar</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Menu lateral de navegação</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6">
                <div class="flex gap-3 mb-4">
                  <br-button emphasis="primary" (click)="sidebarDemoOpen = true">Abrir Sidebar</br-button>
                </div>
                <p class="text-govbr-sm text-govbr-gray-60">Clique para abrir o menu lateral.</p>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('sidebar-demo')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['sidebar-demo'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['sidebar-demo']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['sidebar-demo'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── MEGA MENU ─────────────────────────────────────────────────── -->
          <section id="mega-menu" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Mega Menu</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Menu expansível com múltiplas colunas</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-0 relative min-h-[300px]">
                <br-mega-menu [(activePanel)]="activeMegaPanel">
                  <br-mega-menu-trigger label="Serviços" panelId="servicos" [isActive]="activeMegaPanel === 'servicos'"></br-mega-menu-trigger>
                  <br-mega-menu-trigger label="Cidadão" panelId="cidadao" [isActive]="activeMegaPanel === 'cidadao'"></br-mega-menu-trigger>
                  <br-mega-menu-trigger label="Empresa" panelId="empresa" [isActive]="activeMegaPanel === 'empresa'"></br-mega-menu-trigger>

                  <br-mega-menu-panel panelId="servicos" [isActive]="activeMegaPanel === 'servicos'">
                    <br-mega-menu-column title="Consultas">
                      <br-mega-menu-link label="Situação cadastral"></br-mega-menu-link>
                      <br-mega-menu-link label="Processos"></br-mega-menu-link>
                      <br-mega-menu-link label="Débitos"></br-mega-menu-link>
                    </br-mega-menu-column>
                    <br-mega-menu-column title="Agendamentos">
                      <br-mega-menu-link label="Agendar atendimento"></br-mega-menu-link>
                      <br-mega-menu-link label="Consultar agendamento"></br-mega-menu-link>
                    </br-mega-menu-column>
                  </br-mega-menu-panel>

                  <br-mega-menu-panel panelId="cidadao" [isActive]="activeMegaPanel === 'cidadao'">
                    <br-mega-menu-column title="Documentos">
                      <br-mega-menu-link label="CPF"></br-mega-menu-link>
                      <br-mega-menu-link label="RG"></br-mega-menu-link>
                      <br-mega-menu-link label="CNH"></br-mega-menu-link>
                    </br-mega-menu-column>
                    <br-mega-menu-column title="Benefícios">
                      <br-mega-menu-link label="Bolsa Família"></br-mega-menu-link>
                      <br-mega-menu-link label="Auxílio Brasil"></br-mega-menu-link>
                    </br-mega-menu-column>
                  </br-mega-menu-panel>

                  <br-mega-menu-panel panelId="empresa" [isActive]="activeMegaPanel === 'empresa'">
                    <br-mega-menu-column title="Abertura">
                      <br-mega-menu-link label="MEI"></br-mega-menu-link>
                      <br-mega-menu-link label="CNPJ"></br-mega-menu-link>
                    </br-mega-menu-column>
                  </br-mega-menu-panel>
                </br-mega-menu>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('mega-menu')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['mega-menu'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['mega-menu']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['mega-menu'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── COOKIEBAR ───────────────────────────────────────────── -->
          <section id="cookiebar" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Cookie Bar (LGPD)</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Barra de consentimento de cookies</p>
            </div>

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6">
                <br-button emphasis="primary" (click)="cookiebarVisible = true">Mostrar Cookie Bar</br-button>
              </div>

              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('cookiebar')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['cookiebar'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['cookiebar']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['cookiebar'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── TOAST ─────────────────────────────────────────────────────
               Esta seção existe porque o sistema de toast tinha 13 testes
               unitários e NUNCA era montado em lugar nenhum: o container não
               era renderizado e nada disparava um toast. Era a peça testada
               isoladamente que nunca rodava junto — e é também o canário do
               OnPush, porque muda estado por setTimeout, fora de evento de
               template. -->
          <section id="toast" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Toast</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Avisos temporários, empilhados por um service</p>
            </div>
            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 flex flex-wrap gap-3">
                <button data-testid="toast-success" class="px-4 py-2 rounded-govbr-pill bg-govbr-success text-govbr-on-primary text-govbr-sm font-semibold govbr-focus-ring" (click)="dispararToast('success')">Sucesso</button>
                <button data-testid="toast-danger" class="px-4 py-2 rounded-govbr-pill bg-govbr-danger text-govbr-on-primary text-govbr-sm font-semibold govbr-focus-ring" (click)="dispararToast('danger')">Erro</button>
                <button data-testid="toast-warning" class="px-4 py-2 rounded-govbr-pill bg-govbr-warning text-govbr-on-warning text-govbr-sm font-semibold govbr-focus-ring" (click)="dispararToast('warning')">Aviso</button>
                <button data-testid="toast-info" class="px-4 py-2 rounded-govbr-pill bg-govbr-info text-govbr-on-primary text-govbr-sm font-semibold govbr-focus-ring" (click)="dispararToast('info')">Informação</button>
              </div>
              <div class="border-t border-govbr-gray-10 bg-govbr-gray-2">
                <button class="w-full px-4 py-2 text-left text-govbr-sm font-semibold text-govbr-gray-60 flex items-center gap-2" (click)="toggleCode('toast')">
                  <i class="fa-solid fa-code"></i>
                  {{ showCode['toast'] ? 'Ocultar código' : 'Ver código' }}
                </button>
                @if (showCode['toast']) {
                  <pre class="p-4 text-govbr-xs overflow-x-auto bg-govbr-gray-80 text-white"><code>{{ codeExamples['toast'] }}</code></pre>
                }
              </div>
            </div>
          </section>

          <!-- ─── MENU LATERAL ──────────────────────────────────────────── -->
          <section id="menu" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Menu</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Menu lateral de navegação</p>
            </div>
            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6">
                <div class="relative h-72 overflow-hidden border border-govbr-gray-10 rounded">
                  <br-menu [open]="true" ariaLabel="Menu de exemplo">
                    <br-menu-item icon="home" label="Início"></br-menu-item>
                    <br-menu-item icon="file-lines" label="Meus documentos" badge="3"></br-menu-item>
                    <br-menu-item icon="folder" label="Processos" [hasChildren]="true"></br-menu-item>
                    <br-menu-item icon="gear" label="Configurações"></br-menu-item>
                  </br-menu>
                </div>
              </div>
            </div>
          </section>

          <!-- ─── BARRA DE MENU ─────────────────────────────────────────── -->
          <section id="menu-bar" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Menu Bar</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Barra de navegação horizontal</p>
            </div>
            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6">
                <br-menu-bar variant="primary">
                  <br-menu-bar-item label="Início" icon="home"></br-menu-bar-item>
                  <br-menu-bar-item label="Serviços" icon="list" [hasSubmenu]="true">
                    <br-menu-bar-sub-item label="Agendamento"></br-menu-bar-sub-item>
                    <br-menu-bar-sub-item label="Protocolo"></br-menu-bar-sub-item>
                  </br-menu-bar-item>
                  <br-menu-bar-item label="Contato" icon="envelope"></br-menu-bar-item>
                </br-menu-bar>
              </div>
            </div>
          </section>

          <!-- ─── SUCCESS CHECK ─────────────────────────────────────────── -->
          <section id="success-check" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Success Check</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Confirmação animada de conclusão</p>
            </div>
            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 flex items-center gap-8">
                <br-success-check size="small"></br-success-check>
                <br-success-check size="medium"></br-success-check>
                <br-success-check size="large" variant="primary"></br-success-check>
              </div>
            </div>
          </section>

          <!-- ─── SKIPLINK ──────────────────────────────────────────────────
               Fica visualmente oculto e aparece ao receber foco: é por isso
               que o teste confere display/visibility e não aparência. -->
          <section id="skiplink" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Skiplink</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Atalho "ir para o conteúdo" — exigido pelo Gov.br DS / eMAG</p>
            </div>
            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6">
                <p class="text-govbr-sm text-govbr-gray-60 mb-3">
                  Pressione <kbd class="px-1.5 py-0.5 border border-govbr-gray-20 rounded text-govbr-xs">Tab</kbd>
                  a partir do topo da página: o atalho aparece antes de qualquer outro foco.
                </p>
                <div class="border border-dashed border-govbr-gray-20 rounded p-4">
                  <br-skiplink [itens]="atalhosDemo"></br-skiplink>
                  <span class="text-govbr-xs text-govbr-gray-40">
                    (os links acima só ficam visíveis quando recebem foco)
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- ─── LAYOUT ────────────────────────────────────────────────── -->
          <section id="layout" class="scroll-mt-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Layout</h2>
              <p class="text-govbr-sm text-govbr-gray-40">Casca de página: header, barra, menu, conteúdo e rodapé</p>
            </div>
            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6">
                <div class="border border-govbr-gray-10 rounded overflow-hidden">
                  <br-layout>
                    <div class="p-6 text-govbr-sm text-govbr-gray-60">
                      Conteúdo projetado no slot padrão do <code>br-layout</code>.
                    </div>
                  </br-layout>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>

    <!-- Modals -->
    <br-modal
      [isOpen]="modalOpen"
      title="Confirmar ação"
      size="medium"
      primaryText="Confirmar"
      cancelText="Cancelar"
      (closed)="modalOpen = false"
      (confirmed)="modalOpen = false"
    >
      <p class="text-govbr-sm text-govbr-gray-60">Tem certeza que deseja continuar?</p>
    </br-modal>

    <br-modal
      [isOpen]="modalDangerOpen"
      title="Excluir registro"
      size="small"
      variant="danger"
      primaryText="Excluir"
      (closed)="modalDangerOpen = false"
      (confirmed)="modalDangerOpen = false"
    >
      <p class="text-govbr-sm text-govbr-gray-60">Esta ação não pode ser desfeita.</p>
    </br-modal>

    <!-- Sidebar Demo -->
    <br-sidebar [(mobileOpen)]="sidebarDemoOpen">
      <br-sidebar-group>
        <br-sidebar-group-label>Principal</br-sidebar-group-label>
        <br-sidebar-item icon="home" label="Início" route="/"></br-sidebar-item>
        <br-sidebar-item icon="user" label="Meu Perfil"></br-sidebar-item>
      </br-sidebar-group>
      <br-sidebar-sub icon="file-alt" label="Documentos" [open]="true">
        <br-sidebar-item label="Enviados"></br-sidebar-item>
        <br-sidebar-item label="Recebidos"></br-sidebar-item>
        <br-sidebar-item label="Rascunhos"></br-sidebar-item>
      </br-sidebar-sub>
      <br-sidebar-item icon="cog" label="Configurações"></br-sidebar-item>
      <br-sidebar-item icon="sign-out-alt" label="Sair"></br-sidebar-item>
    </br-sidebar>

    <!-- Cookiebar -->
    <br-cookiebar
      [(visible)]="cookiebarVisible"
      [cookieGroups]="cookieGroups"
      (acceptAll)="onCookieAccept('all')"
      (acceptSelected)="onCookieAccept('selected')"
      (reject)="onCookieAccept('reject')"
    >
      <p>Este site utiliza cookies para melhorar sua experiência.</p>
    </br-cookiebar>
    }

    <!-- ═══════════════════════════════════════════════════════════════════════
         VIEW: BLOCOS
         ═══════════════════════════════════════════════════════════════════════ -->
    @if (currentView === 'blocos') {
      <div class="blocks-container">
        <div class="blocks-content">
          <div class="blocks-intro">
            <h1 class="text-3xl font-bold text-govbr-gray-80 mb-2">Blocos de Layout</h1>
            <p class="text-govbr-base text-govbr-gray-60">Exemplos de layouts completos prontos para usar em seu projeto.</p>
          </div>

          <!-- ─── BLOCO: HEADER + MEGA MENU (padrão Gov.br) ──────────────────── -->
          <section class="block-section">
            <div class="block-header">
              <h2 class="block-title">
                <i class="fas fa-th-large text-govbr-primary"></i>
                Header + Mega Menu (Padrão Gov.br)
              </h2>
              <p class="block-description">Cabeçalho institucional completo com barra de navegação e mega menu expansível, seguindo o padrão do portal Gov.br</p>
            </div>

            <div class="block-preview">
              <div class="block-demo block-demo-full">
                <!-- Header Gov.br -->
                <br-header
                  systemTitle="Portal de Serviços"
                  systemSubtitle="Governo Federal"
                  logoSrc="https://www.gov.br/++theme++padrao_govbr/img/govbr-logo-large.png"
                  signature="Ministério da Gestão"
                  [showSearch]="true"
                  [showLogin]="true"
                  [showContrast]="true"
                  [hasLinks]="true"
                  [hasFunctions]="true"
                  menuMode="mega"
                  [fullWidth]="true"
                  (menuToggle)="blockHeaderMenuOpen = $any($event)"
                >
                  <!-- Links de Acesso Rápido -->
                  <a header-links href="#" class="block px-4 py-2 text-govbr-sm hover:bg-govbr-gray-2 transition-colors">
                    <i class="fas fa-external-link-alt mr-2 text-govbr-gray-40"></i>Portal Gov.br
                  </a>
                  <a header-links href="#" class="block px-4 py-2 text-govbr-sm hover:bg-govbr-gray-2 transition-colors">
                    <i class="fas fa-external-link-alt mr-2 text-govbr-gray-40"></i>Serviços Digitais
                  </a>
                  <a header-links href="#" class="block px-4 py-2 text-govbr-sm hover:bg-govbr-gray-2 transition-colors">
                    <i class="fas fa-external-link-alt mr-2 text-govbr-gray-40"></i>Transparência
                  </a>

                  <!-- Funcionalidades -->
                  <button header-functions class="flex items-center w-full px-4 py-2 text-govbr-sm hover:bg-govbr-gray-2 transition-colors text-left">
                    <i class="fas fa-question-circle mr-2 text-govbr-gray-40"></i>Ajuda
                  </button>
                  <button header-functions class="flex items-center w-full px-4 py-2 text-govbr-sm hover:bg-govbr-gray-2 transition-colors text-left">
                    <i class="fas fa-headset mr-2 text-govbr-gray-40"></i>Fale Conosco
                  </button>
                </br-header>

                <!-- Mega Menu (barra de navegação) -->
                @if (blockHeaderMenuOpen) {
                  <br-mega-menu [(activePanel)]="blockMegaPanel" variant="primary">
                    <br-mega-menu-trigger label="Serviços" panelId="blk-servicos" [isActive]="blockMegaPanel === 'blk-servicos'" (panelToggle)="blockMegaPanel = blockMegaPanel === $event ? null : $event"></br-mega-menu-trigger>
                    <br-mega-menu-trigger label="Cidadão" panelId="blk-cidadao" [isActive]="blockMegaPanel === 'blk-cidadao'" (panelToggle)="blockMegaPanel = blockMegaPanel === $event ? null : $event"></br-mega-menu-trigger>
                    <br-mega-menu-trigger label="Empresa" panelId="blk-empresa" [isActive]="blockMegaPanel === 'blk-empresa'" (panelToggle)="blockMegaPanel = blockMegaPanel === $event ? null : $event"></br-mega-menu-trigger>
                    <br-mega-menu-trigger label="Sobre" panelId="blk-sobre" [isActive]="blockMegaPanel === 'blk-sobre'" (panelToggle)="blockMegaPanel = blockMegaPanel === $event ? null : $event"></br-mega-menu-trigger>

                    <br-mega-menu-panel panelId="blk-servicos" [isActive]="blockMegaPanel === 'blk-servicos'">
                      <br-mega-menu-column title="Consultas">
                        <br-mega-menu-link label="Situação cadastral" icon="search"></br-mega-menu-link>
                        <br-mega-menu-link label="Processos em andamento" icon="folder-open"></br-mega-menu-link>
                        <br-mega-menu-link label="Débitos e pendências" icon="exclamation-circle"></br-mega-menu-link>
                        <br-mega-menu-link label="Histórico de atendimentos" icon="history"></br-mega-menu-link>
                      </br-mega-menu-column>
                      <br-mega-menu-column title="Agendamentos">
                        <br-mega-menu-link label="Agendar atendimento" icon="calendar-plus"></br-mega-menu-link>
                        <br-mega-menu-link label="Consultar agendamento" icon="calendar-check"></br-mega-menu-link>
                        <br-mega-menu-link label="Cancelar agendamento" icon="calendar-times"></br-mega-menu-link>
                      </br-mega-menu-column>
                      <br-mega-menu-column title="Certidões">
                        <br-mega-menu-link label="Emitir certidão" icon="file-alt"></br-mega-menu-link>
                        <br-mega-menu-link label="Validar certidão" icon="check-circle"></br-mega-menu-link>
                      </br-mega-menu-column>
                    </br-mega-menu-panel>

                    <br-mega-menu-panel panelId="blk-cidadao" [isActive]="blockMegaPanel === 'blk-cidadao'">
                      <br-mega-menu-column title="Documentos">
                        <br-mega-menu-link label="CPF" icon="id-card"></br-mega-menu-link>
                        <br-mega-menu-link label="RG" icon="address-card"></br-mega-menu-link>
                        <br-mega-menu-link label="CNH" icon="car"></br-mega-menu-link>
                        <br-mega-menu-link label="Passaporte" icon="passport"></br-mega-menu-link>
                      </br-mega-menu-column>
                      <br-mega-menu-column title="Benefícios">
                        <br-mega-menu-link label="Bolsa Família" icon="hand-holding-usd"></br-mega-menu-link>
                        <br-mega-menu-link label="Auxílio Brasil" icon="coins"></br-mega-menu-link>
                        <br-mega-menu-link label="BPC/LOAS" icon="wheelchair"></br-mega-menu-link>
                      </br-mega-menu-column>
                      <br-mega-menu-column title="Saúde">
                        <br-mega-menu-link label="Cartão SUS" icon="heartbeat"></br-mega-menu-link>
                        <br-mega-menu-link label="Vacinação" icon="syringe"></br-mega-menu-link>
                      </br-mega-menu-column>
                    </br-mega-menu-panel>

                    <br-mega-menu-panel panelId="blk-empresa" [isActive]="blockMegaPanel === 'blk-empresa'">
                      <br-mega-menu-column title="Abertura">
                        <br-mega-menu-link label="Abrir MEI" icon="store"></br-mega-menu-link>
                        <br-mega-menu-link label="Registro CNPJ" icon="building"></br-mega-menu-link>
                      </br-mega-menu-column>
                      <br-mega-menu-column title="Licenças">
                        <br-mega-menu-link label="Alvará de funcionamento" icon="file-signature"></br-mega-menu-link>
                        <br-mega-menu-link label="Licença ambiental" icon="leaf"></br-mega-menu-link>
                      </br-mega-menu-column>
                    </br-mega-menu-panel>

                    <br-mega-menu-panel panelId="blk-sobre" [isActive]="blockMegaPanel === 'blk-sobre'">
                      <br-mega-menu-column title="Institucional">
                        <br-mega-menu-link label="Quem somos" icon="users"></br-mega-menu-link>
                        <br-mega-menu-link label="Estrutura organizacional" icon="sitemap"></br-mega-menu-link>
                        <br-mega-menu-link label="Legislação" icon="gavel"></br-mega-menu-link>
                      </br-mega-menu-column>
                      <br-mega-menu-column title="Contato">
                        <br-mega-menu-link label="Fale conosco" icon="envelope"></br-mega-menu-link>
                        <br-mega-menu-link label="Ouvidoria" icon="comments"></br-mega-menu-link>
                        <br-mega-menu-link label="Imprensa" icon="newspaper"></br-mega-menu-link>
                      </br-mega-menu-column>
                    </br-mega-menu-panel>
                  </br-mega-menu>
                }

                <!-- Conteúdo simulado da página -->
                <div class="p-8 bg-govbr-gray-2 min-h-[280px]">
                  <div class="max-w-4xl mx-auto">
                    <div class="bg-white rounded-lg shadow-sm p-6 mb-4">
                      <h3 class="text-xl font-semibold text-govbr-gray-80 mb-2">Bem-vindo ao Portal de Serviços</h3>
                      <p class="text-govbr-gray-60">Este é um exemplo de layout completo seguindo o padrão Gov.br. Use o botão de menu (☰) no header para mostrar/ocultar a barra de navegação, e clique nos itens para expandir os painéis do mega menu.</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div class="bg-white rounded-lg shadow-sm p-4 text-center">
                        <i class="fas fa-file-alt text-3xl text-govbr-primary mb-2"></i>
                        <p class="text-govbr-sm font-semibold text-govbr-gray-80">Documentos</p>
                      </div>
                      <div class="bg-white rounded-lg shadow-sm p-4 text-center">
                        <i class="fas fa-calendar-check text-3xl text-govbr-primary mb-2"></i>
                        <p class="text-govbr-sm font-semibold text-govbr-gray-80">Agendamentos</p>
                      </div>
                      <div class="bg-white rounded-lg shadow-sm p-4 text-center">
                        <i class="fas fa-headset text-3xl text-govbr-primary mb-2"></i>
                        <p class="text-govbr-sm font-semibold text-govbr-gray-80">Atendimento</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- ─── BLOCO: LAYOUT COM SIDEBAR ────────────────────────────────── -->
          <section class="block-section">
            <div class="block-header">
              <h2 class="block-title">
                <i class="fas fa-columns text-govbr-primary"></i>
                Layout com Sidebar
              </h2>
              <p class="block-description">Layout de painel administrativo com menu lateral</p>
            </div>

            <div class="block-preview">
              <div class="block-demo block-demo-sidebar">
                <!-- Sidebar fixa no bloco -->
                <aside class="demo-sidebar">
                  <div class="demo-sidebar-header">
                    <img src="https://www.gov.br/++theme++padrao_govbr/img/govbr-logo-large.png" alt="Gov.br" class="h-6" />
                    <span class="text-sm font-semibold text-govbr-gray-80">Painel Admin</span>
                  </div>
                  <nav class="demo-sidebar-nav">
                    <a href="#" class="demo-sidebar-item active">
                      <i class="fas fa-home"></i>
                      <span>Dashboard</span>
                    </a>
                    <a href="#" class="demo-sidebar-item">
                      <i class="fas fa-users"></i>
                      <span>Usuários</span>
                    </a>
                    <a href="#" class="demo-sidebar-item">
                      <i class="fas fa-file-alt"></i>
                      <span>Documentos</span>
                    </a>
                    <a href="#" class="demo-sidebar-item">
                      <i class="fas fa-chart-bar"></i>
                      <span>Relatórios</span>
                    </a>
                    <a href="#" class="demo-sidebar-item">
                      <i class="fas fa-cog"></i>
                      <span>Configurações</span>
                    </a>
                  </nav>
                </aside>

                <!-- Área de conteúdo -->
                <main class="demo-main">
                  <header class="demo-main-header">
                    <h3 class="text-lg font-semibold text-govbr-gray-80">Dashboard</h3>
                    <div class="flex items-center gap-3">
                      <br-button emphasis="tertiary" icon="bell" [circle]="true"></br-button>
                      <br-avatar name="João Silva" size="small"></br-avatar>
                    </div>
                  </header>
                  <div class="demo-main-content">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <br-card>
                        <div class="text-center py-4">
                          <p class="text-3xl font-bold text-govbr-primary">1.234</p>
                          <p class="text-govbr-sm text-govbr-gray-60">Usuários ativos</p>
                        </div>
                      </br-card>
                      <br-card>
                        <div class="text-center py-4">
                          <p class="text-3xl font-bold text-govbr-success">89%</p>
                          <p class="text-govbr-sm text-govbr-gray-60">Taxa de aprovação</p>
                        </div>
                      </br-card>
                      <br-card>
                        <div class="text-center py-4">
                          <p class="text-3xl font-bold text-govbr-warning">42</p>
                          <p class="text-govbr-sm text-govbr-gray-60">Pendentes</p>
                        </div>
                      </br-card>
                    </div>
                    <br-card title="Atividade Recente">
                      <br-list>
                        <br-item>Novo usuário cadastrado: Maria Santos</br-item>
                        <br-item>Documento aprovado: Certidão #12345</br-item>
                        <br-item>Relatório mensal gerado</br-item>
                      </br-list>
                    </br-card>
                  </div>
                </main>
              </div>
            </div>
          </section>

          <!-- ─── BLOCO: TABLE COM PAGINAÇÃO ────────────────────────────────── -->
          <section class="block-section">
            <div class="block-header">
              <h2 class="block-title">
                <i class="fas fa-table text-govbr-primary"></i>
                Tabela com Paginação
              </h2>
              <p class="block-description">Tabela de dados com paginação integrada - variantes Default e Contextual</p>
            </div>

            <div class="block-preview">
              <div class="block-demo" style="padding: 0;">
                <!-- Tabela com Paginação DEFAULT -->
                <div class="p-4 border-b border-govbr-gray-10">
                  <h4 class="text-govbr-sm font-semibold text-govbr-gray-60 mb-3">
                    <i class="fas fa-keyboard mr-2"></i>Paginação Default (com input)
                  </h4>
                  <br-table
                    [page]="tablePageDefault"
                    [totalPages]="5"
                    [totalItems]="50"
                    [itemsPerPage]="10"
                    [showPagination]="true"
                    [showItemsPerPage]="true"
                    [showSummary]="true"
                    paginationVariant="default"
                    (pageChange)="tablePageDefault = $event"
                  >
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>001</td>
                        <td>Maria Silva</td>
                        <td>123.456.789-00</td>
                        <td><br-badge variant="success">Ativo</br-badge></td>
                      </tr>
                      <tr>
                        <td>002</td>
                        <td>João Santos</td>
                        <td>987.654.321-00</td>
                        <td><br-badge variant="warning">Pendente</br-badge></td>
                      </tr>
                      <tr>
                        <td>003</td>
                        <td>Ana Costa</td>
                        <td>456.789.123-00</td>
                        <td><br-badge variant="success">Ativo</br-badge></td>
                      </tr>
                    </tbody>
                  </br-table>
                </div>

                <!-- Tabela com Paginação CONTEXTUAL -->
                <div class="p-4 bg-govbr-gray-2">
                  <h4 class="text-govbr-sm font-semibold text-govbr-primary mb-3">
                    <i class="fas fa-list-alt mr-2"></i>Paginação Contextual (Gov.br com dropdowns)
                  </h4>
                  <br-table
                    [page]="tablePageContextual"
                    [totalPages]="10"
                    [totalItems]="100"
                    [itemsPerPage]="10"
                    [itemsPerPageOptions]="[10, 25, 50, 100]"
                    [showPagination]="true"
                    [showItemsPerPage]="true"
                    [showSummary]="true"
                    [showGoToPage]="true"
                    paginationVariant="contextual"
                    headerStyle="primary"
                    (pageChange)="tablePageContextual = $event"
                  >
                    <thead>
                      <tr>
                        <th>Protocolo</th>
                        <th>Solicitante</th>
                        <th>Serviço</th>
                        <th>Data</th>
                        <th>Situação</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2024.0001</td>
                        <td>Carlos Ferreira</td>
                        <td>Certidão Negativa</td>
                        <td>15/01/2024</td>
                        <td><br-badge variant="success">Concluído</br-badge></td>
                      </tr>
                      <tr>
                        <td>2024.0002</td>
                        <td>Patrícia Lima</td>
                        <td>Alvará de Funcionamento</td>
                        <td>16/01/2024</td>
                        <td><br-badge variant="primary">Em análise</br-badge></td>
                      </tr>
                      <tr>
                        <td>2024.0003</td>
                        <td>Roberto Alves</td>
                        <td>Licença Ambiental</td>
                        <td>17/01/2024</td>
                        <td><br-badge variant="warning">Pendente</br-badge></td>
                      </tr>
                      <tr>
                        <td>2024.0004</td>
                        <td>Fernanda Souza</td>
                        <td>Registro de Imóvel</td>
                        <td>18/01/2024</td>
                        <td><br-badge variant="danger">Cancelado</br-badge></td>
                      </tr>
                    </tbody>
                  </br-table>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    /* ═══════════════════════════════════════════════════════════════
       TOP NAVIGATION BAR
       ═══════════════════════════════════════════════════════════════ */

    .showcase-topbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 56px;
      background: linear-gradient(135deg, #071D41 0%, #1351b4 100%);
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .showcase-topbar-content {
      max-width: 1400px;
      margin: 0 auto;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
    }

    .showcase-topbar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .showcase-topbar-title {
      font-size: 18px;
      font-weight: 600;
      color: white;
      font-family: var(--govbr-font-family, 'Rawline', sans-serif);
    }

    .showcase-topbar-nav {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .showcase-topbar-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: transparent;
      border: none;
      border-radius: 4px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .showcase-topbar-link:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .showcase-topbar-link.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .showcase-topbar-contrast {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      transition: all 0.2s;
      margin-left: 8px;
    }

    .showcase-topbar-contrast:hover {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .showcase-topbar-contrast[aria-pressed="true"] {
      background: #ffff00;
      color: #000;
    }

    @media (max-width: 575px) {
      .showcase-topbar-link span {
        display: none;
      }
      .showcase-topbar-title {
        font-size: 14px;
      }
    }

    /* ═══════════════════════════════════════════════════════════════
       SHOWCASE RESPONSIVE LAYOUT
       ═══════════════════════════════════════════════════════════════ */

    .showcase-container {
      display: flex;
      min-height: 100vh;
      padding-top: 56px;
      background: var(--govbr-gray-2, #f8f8f8);
    }

    /* ═══════════════════════════════════════════════════════════════
       BLOCKS VIEW
       ═══════════════════════════════════════════════════════════════ */

    .blocks-container {
      min-height: 100vh;
      padding-top: 56px;
      background: var(--govbr-gray-2, #f8f8f8);
    }

    .blocks-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .blocks-intro {
      margin-bottom: 48px;
      text-align: center;
    }

    .block-section {
      margin-bottom: 48px;
    }

    .block-header {
      margin-bottom: 16px;
    }

    .block-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 20px;
      font-weight: 600;
      color: var(--govbr-gray-80, #333);
      margin-bottom: 4px;
    }

    .block-description {
      font-size: 14px;
      color: var(--govbr-gray-60, #555);
    }

    .block-preview {
      background: white;
      border: 1px solid var(--govbr-gray-10, #e0e0e0);
      border-radius: 8px;
      overflow: hidden;
    }

    .block-demo {
      min-height: 400px;
    }

    .block-demo-sidebar {
      display: flex;
      min-height: 500px;
    }

    .block-demo-full {
      display: flex;
      flex-direction: column;
      min-height: 500px;
      overflow: hidden;
    }

    .demo-sidebar {
      width: 240px;
      background: white;
      border-right: 1px solid var(--govbr-gray-10, #e0e0e0);
      flex-shrink: 0;
    }

    .demo-sidebar-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid var(--govbr-gray-10, #e0e0e0);
    }

    .demo-sidebar-nav {
      padding: 12px 0;
    }

    .demo-sidebar-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: var(--govbr-gray-60, #555);
      text-decoration: none;
      font-size: 14px;
      transition: all 0.2s;
    }

    .demo-sidebar-item:hover {
      background: var(--govbr-gray-2, #f8f8f8);
      color: var(--govbr-primary, #1351b4);
    }

    .demo-sidebar-item.active {
      background: rgba(19, 81, 180, 0.08);
      color: var(--govbr-primary, #1351b4);
      border-left: 3px solid var(--govbr-primary, #1351b4);
      font-weight: 600;
    }

    .demo-sidebar-item i {
      width: 20px;
      text-align: center;
    }

    .demo-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--govbr-gray-2, #f8f8f8);
    }

    .demo-main-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      background: white;
      border-bottom: 1px solid var(--govbr-gray-10, #e0e0e0);
    }

    .demo-main-content {
      flex: 1;
      padding: 24px;
    }

    @media (max-width: 767px) {
      .block-demo-sidebar {
        flex-direction: column;
      }
      .demo-sidebar {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid var(--govbr-gray-10, #e0e0e0);
      }
      .demo-sidebar-nav {
        display: flex;
        overflow-x: auto;
        padding: 8px;
        gap: 4px;
      }
      .demo-sidebar-item {
        white-space: nowrap;
        padding: 8px 12px;
        border-radius: 4px;
        border-left: none !important;
      }
    }

    /* ─── MOBILE SIDEBAR TOGGLE ─────────────────────────────────────── */
    .showcase-mobile-toggle {
      display: none;
      position: fixed;
      top: 68px;
      left: 12px;
      width: 44px;
      height: 44px;
      align-items: center;
      justify-content: center;
      background: white;
      border: 1px solid var(--govbr-gray-10, #e0e0e0);
      border-radius: 8px;
      color: var(--govbr-primary, #1351b4);
      font-size: 18px;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.2s;
    }

    .showcase-mobile-toggle:hover {
      background: var(--govbr-primary-lightest, #dbe8fb);
    }

    .showcase-menu-toggle {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .showcase-menu-toggle:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .showcase-mobile-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }

    /* ─── OVERLAY ───────────────────────────────────────────────────── */
    .showcase-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 199;
    }

    /* ─── SIDEBAR ───────────────────────────────────────────────────── */
    .showcase-sidebar {
      width: 280px;
      background: white;
      border-right: 1px solid var(--govbr-gray-10, #e0e0e0);
      position: fixed;
      top: 56px;
      bottom: 0;
      left: 0;
      overflow-y: auto;
      z-index: 200;
      transition: transform 0.3s ease;
    }

    .showcase-sidebar-header {
      padding: 24px 20px 16px;
      border-bottom: 1px solid var(--govbr-gray-10, #e0e0e0);
      position: relative;
    }

    .showcase-sidebar-close {
      display: none;
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      background: transparent;
      border: none;
      color: var(--govbr-gray-60, #555);
      font-size: 18px;
      cursor: pointer;
      border-radius: 4px;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .showcase-sidebar-close:hover {
      background: var(--govbr-gray-2, #f8f8f8);
    }

    .showcase-sidebar-nav {
      padding: 12px 0;
    }

    .showcase-nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 20px;
      color: var(--govbr-gray-60, #555);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
      border-left: 3px solid transparent;
    }

    .showcase-nav-item:hover {
      background: var(--govbr-gray-2, #f8f8f8);
      color: var(--govbr-primary, #1351b4);
    }

    .showcase-nav-item.active {
      background: rgba(19, 81, 180, 0.08);
      color: var(--govbr-primary, #1351b4);
      border-left-color: var(--govbr-primary, #1351b4);
      font-weight: 600;
    }

    /* ─── MAIN CONTENT ──────────────────────────────────────────────── */
    .showcase-main {
      flex: 1;
      margin-left: 280px;
      min-width: 0;
    }

    .showcase-content {
      padding: 32px;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 48px;
    }

    /* ─── SCROLLBAR ─────────────────────────────────────────────────── */
    .showcase-sidebar::-webkit-scrollbar {
      width: 4px;
    }

    .showcase-sidebar::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 4px;
    }

    /* ═══════════════════════════════════════════════════════════════
       RESPONSIVE BREAKPOINTS
       ═══════════════════════════════════════════════════════════════ */

    /* Tablet e Mobile: <= 991px */
    @media (max-width: 991px) {
      /* Sidebar escondida por padrão - sobrepõe conteúdo quando aberta */
      .showcase-sidebar {
        position: fixed;
        top: 56px;
        left: 0;
        bottom: 0;
        width: 280px;
        z-index: 200;
        transform: translateX(-100%);
        box-shadow: none;
      }

      /* Sidebar aberta - desliza por cima do conteúdo */
      .showcase-sidebar.open {
        transform: translateX(0);
        box-shadow: 4px 0 16px rgba(0, 0, 0, 0.15);
      }

      .showcase-mobile-toggle {
        display: flex;
      }

      .showcase-overlay {
        display: block;
        top: 56px;
      }

      .showcase-sidebar-close {
        display: flex;
      }

      /* Conteúdo principal - NÃO move quando sidebar abre */
      .showcase-main {
        margin-left: 0 !important;
        padding-top: 0;
        width: 100%;
      }

      .showcase-content {
        padding: 24px 16px;
        gap: 32px;
      }
    }

    /* Mobile: < 576px */
    @media (max-width: 575px) {
      .showcase-sidebar {
        width: 100%;
        max-width: 300px;
      }

      .showcase-content {
        padding: 16px 12px;
        gap: 24px;
      }

      .showcase-mobile-title {
        font-size: 14px;
      }
    }
  `],
})
export class ShowcaseComponent {
  Math = Math;

  // View navigation
  currentView: 'componentes' | 'blocos' = 'componentes';
  blockMegaPanel: string | null = null;
  blockHeaderMenuOpen = true;

  // Contrast mode
  contrastActive = false;

  toggleContrast(): void {
    // Usa o service da BIBLIOTECA, não uma cópia local. Antes o demo tinha a
    // própria implementação, então a vitrine provava código que não vai para
    // ninguém enquanto a do pacote nunca era exercitada.
    this.contraste.alternar();
    this.contrastActive = this.contraste.ativo();
  }

  private readonly toast = inject(BrToastService);
  private readonly contraste = inject(BrContrastService);

  atalhosDemo: BrSkiplinkItem[] = [
    { href: '#conteudo', label: 'Ir para o conteúdo' },
    { href: '#menu', label: 'Ir para o menu' },
  ];

  dispararToast(tipo: 'success' | 'danger' | 'warning' | 'info'): void {
    const mensagens = {
      success: 'Operação concluída com sucesso.',
      danger: 'Não foi possível concluir a operação.',
      warning: 'Confira os dados antes de continuar.',
      info: 'Seu protocolo foi registrado.',
    } as const;
    this.toast.show(tipo, mensagens[tipo]);
  }

  activeSection = 'buttons';
  showCode: Record<string, boolean> = {};
  mobileMenuOpen = false;

  sections: ComponentSection[] = [
    { id: 'buttons', name: 'Button', icon: 'square' },
    { id: 'input', name: 'Input', icon: 'keyboard' },
    { id: 'input-masks', name: 'Inputs com Máscara', icon: 'hashtag' },
    { id: 'select', name: 'Select', icon: 'caret-down' },
    { id: 'textarea', name: 'Textarea', icon: 'align-left' },
    { id: 'checkbox', name: 'Checkbox', icon: 'square-check' },
    { id: 'switch', name: 'Switch', icon: 'toggle-on' },
    { id: 'radio', name: 'Radio Group', icon: 'circle-dot' },
    { id: 'chip', name: 'Chip', icon: 'tag' },
    { id: 'badge', name: 'Badge', icon: 'certificate' },
    { id: 'notification', name: 'Notification', icon: 'bell' },
    { id: 'message', name: 'Message', icon: 'comment' },
    { id: 'tooltip', name: 'Tooltip', icon: 'comment-dots' },
    { id: 'avatar', name: 'Avatar', icon: 'user-circle' },
    { id: 'card', name: 'Card', icon: 'id-card' },
    { id: 'list', name: 'List', icon: 'list' },
    { id: 'accordion', name: 'Accordion', icon: 'bars-staggered' },
    { id: 'tabs', name: 'Tabs', icon: 'folder' },
    { id: 'table', name: 'Table', icon: 'table' },
    { id: 'pagination', name: 'Pagination', icon: 'ellipsis' },
    { id: 'breadcrumb', name: 'Breadcrumb', icon: 'chevron-right' },
    { id: 'stepper', name: 'Stepper', icon: 'shoe-prints' },
    { id: 'timeline', name: 'Timeline', icon: 'timeline' },
    { id: 'loading', name: 'Loading', icon: 'spinner' },
    { id: 'skeleton', name: 'Skeleton', icon: 'bone' },
    { id: 'modal', name: 'Modal', icon: 'window-maximize' },
    { id: 'wizard', name: 'Wizard', icon: 'wand-magic-sparkles' },
    { id: 'datepicker', name: 'Date & Time Pickers', icon: 'calendar' },
    { id: 'upload', name: 'Upload', icon: 'upload' },
    { id: 'divider', name: 'Divider', icon: 'minus' },
    { id: 'signin', name: 'Sign-in Gov.br', icon: 'right-to-bracket' },
    { id: 'magic-button', name: 'Magic Button', icon: 'wand-sparkles' },
    { id: 'sidebar-demo', name: 'Sidebar', icon: 'bars' },
    { id: 'mega-menu', name: 'Mega Menu', icon: 'th-large' },
    { id: 'cookiebar', name: 'Cookie Bar', icon: 'cookie-bite' },
    { id: 'toast', name: 'Toast', icon: 'bell-concierge' },
    { id: 'menu', name: 'Menu', icon: 'bars-staggered' },
    { id: 'menu-bar', name: 'Menu Bar', icon: 'grip-lines' },
    { id: 'success-check', name: 'Success Check', icon: 'circle-check' },
    { id: 'skiplink', name: 'Skiplink', icon: 'person-walking-arrow-right' },
    { id: 'layout', name: 'Layout', icon: 'table-columns' },
  ];

  codeExamples: Record<string, string> = {
    toast: `// injete o service e dispare de qualquer lugar
private readonly toast = inject(BrToastService);

this.toast.success('Operação concluída com sucesso.');
this.toast.danger('Não foi possível concluir a operação.');

// monte o container UMA vez, na casca da aplicação:
// <br-toast-container position="top-right" />`,

    buttons: `<br-button emphasis="primary">Primário</br-button>
<br-button emphasis="secondary">Secundário</br-button>
<br-button emphasis="primary" icon="plus">Com Ícone</br-button>
<br-button emphasis="primary" [loading]="true">Carregando</br-button>
<br-button emphasis="primary" [circle]="true" icon="plus"></br-button>`,

    input: `<br-input
  label="Nome completo"
  placeholder="Digite seu nome"
  [(ngModel)]="nome"
  [required]="true"
></br-input>

<br-input
  label="E-mail"
  type="email"
  placeholder="seu@email.com"
  icon="envelope"
></br-input>

<br-input
  label="Senha"
  type="password"
  placeholder="******"
></br-input>

<br-input
  label="Com erro"
  error="Este campo é obrigatório"
></br-input>

<br-input
  label="Com sucesso"
  successMessage="Campo válido"
></br-input>

<br-input
  label="Desabilitado"
  placeholder="Campo desabilitado"
  [disabled]="true"
></br-input>`,

    'input-masks': `<br-input-cpf label="CPF" [(ngModel)]="cpf"></br-input-cpf>
<br-input-cnpj label="CNPJ" [(ngModel)]="cnpj"></br-input-cnpj>
<br-input-cep label="CEP" [(ngModel)]="cep"></br-input-cep>
<br-input-telefone label="Telefone" [(ngModel)]="tel"></br-input-telefone>
<br-input-money label="Valor" [(ngModel)]="valor" prefix="R$"></br-input-money>`,

    'input-button': `<!-- Com label: use items-end para alinhar pela base -->
<div class="flex items-end gap-2">
  <br-input label="Buscar" class="flex-1"></br-input>
  <br-button label="Pesquisar" icon="search"></br-button>
</div>

<!-- Sem label -->
<div class="flex gap-2">
  <br-input placeholder="Digite..." class="flex-1"></br-input>
  <br-button icon="search"></br-button>
</div>

<!-- Densidade small -->
<div class="flex items-end gap-2">
  <br-input label="Código" density="small" class="flex-1"></br-input>
  <br-button label="Validar" density="small"></br-button>
</div>

<!-- Select + Botão -->
<div class="flex items-end gap-2">
  <br-select label="Estado" [options]="options" class="flex-1"></br-select>
  <br-button label="Filtrar" icon="filter"></br-button>
</div>`,

    select: `<br-select
  label="Estado"
  placeholder="Selecione"
  [options]="estados"
  [(ngModel)]="estado"
></br-select>

<br-select
  label="Com busca"
  [options]="estados"
  [searchable]="true"
></br-select>

<br-select
  label="Multi-seleção"
  [options]="estados"
  [multiple]="true"
></br-select>`,

    textarea: `<br-textarea
  label="Descrição"
  placeholder="Digite..."
  [maxLength]="200"
  helperText="Máximo 200 caracteres"
></br-textarea>

<br-textarea
  label="Com erro"
  error="Campo obrigatório"
  [required]="true"
></br-textarea>`,

    checkbox: `<!-- Padrão -->
<br-checkbox label="Checado" [(ngModel)]="checked"></br-checkbox>

<!-- Estados -->
<br-checkbox label="Desativado" [disabled]="true"></br-checkbox>
<br-checkbox label="Inválido" state="invalid"></br-checkbox>
<br-checkbox label="Válido" state="valid"></br-checkbox>

<!-- Indeterminado -->
<br-checkbox label="Indeterminado" [indeterminate]="true"></br-checkbox>

<!-- Com mensagem de erro -->
<br-checkbox
  label="Campo obrigatório"
  state="invalid"
  errorMessage="Seleção obrigatória"
></br-checkbox>

<!-- Tamanho pequeno -->
<br-checkbox label="Pequeno" size="small"></br-checkbox>`,

    switch: `<br-switch
  label="Modo escuro"
  [(ngModel)]="darkMode"
></br-switch>

<br-switch
  label="Notificações"
  [(ngModel)]="notif"
  helperText="Receba alertas"
></br-switch>

<br-switch label="Desabilitado" [disabled]="true"></br-switch>`,

    radio: `radioOptions = [
  { label: 'Pessoa Física', value: 'pf' },
  { label: 'Pessoa Jurídica', value: 'pj' },
];

<br-radio-group
  legend="Tipo de pessoa"
  [options]="radioOptions"
  [(ngModel)]="tipo"
></br-radio-group>

<br-radio-group
  legend="Inline"
  [options]="radioOptions"
  [inline]="true"
></br-radio-group>`,

    chip: `<br-chip
  label="Filtro"
  [selectable]="true"
  [(selected)]="selecionado"
></br-chip>

<br-chip label="Removível" [removable]="true"></br-chip>
<br-chip label="Com ícone" icon="tag" [removable]="true"></br-chip>
<br-chip label="Desabilitado" [disabled]="true"></br-chip>`,

    badge: `<br-badge variant="primary">Primário</br-badge>
<br-badge variant="success">Sucesso</br-badge>
<br-badge variant="danger">Erro</br-badge>
<br-badge variant="warning">Alerta</br-badge>
<br-badge variant="neutral">Neutro</br-badge>`,

    notification: `<br-notification [count]="5">
  <br-button emphasis="secondary" icon="bell" [circle]="true"></br-button>
</br-notification>

<br-notification [count]="150" [max]="99">
  <br-button emphasis="secondary" icon="envelope" [circle]="true"></br-button>
</br-notification>

<br-notification [showDot]="true" variant="success">
  <br-button emphasis="secondary" icon="check-circle" [circle]="true"></br-button>
</br-notification>`,

    message: `<br-message type="success">Operação realizada!</br-message>
<br-message type="danger">Ocorreu um erro.</br-message>
<br-message type="warning" [dismissible]="true">Atenção!</br-message>
<br-message type="info">Informação importante.</br-message>`,

    tooltip: `<br-tooltip text="Tooltip acima" place="top">
  <br-button>Top</br-button>
</br-tooltip>

<br-tooltip text="Tooltip abaixo" place="bottom">
  <br-button>Bottom</br-button>
</br-tooltip>

<br-tooltip text="Tooltip à esquerda" place="left">
  <br-button>Left</br-button>
</br-tooltip>

<br-tooltip text="Tooltip à direita" place="right">
  <br-button>Right</br-button>
</br-tooltip>`,

    avatar: `<br-avatar name="Maria Silva" size="small"></br-avatar>
<br-avatar name="João" size="medium" status="online"></br-avatar>
<br-avatar name="Ana" size="large" variant="success"></br-avatar>
<br-avatar
  src="https://i.pravatar.cc/80"
  name="Foto"
  size="large"
  status="online"
></br-avatar>`,

    card: `<br-card
  icon="users"
  linkText="Ver detalhes"
  linkRoute="/usuarios"
>
  <h3>Usuários</h3>
  <p class="text-3xl font-bold">1.234</p>
</br-card>`,

    list: `<br-list title="Serviços" variant="bordered">
  <br-item
    title="Consulta CPF"
    subtitle="Receita Federal"
    icon="id-card"
    [clickable]="true"
    [showArrow]="true"
  ></br-item>
  <br-item
    title="Carteira de Trabalho"
    subtitle="Min. Trabalho"
    icon="briefcase"
    tag="Novo"
    [clickable]="true"
  ></br-item>
</br-list>`,

    accordion: `<br-accordion mode="single">
  <br-accordion-item
    title="O que é o Gov.br?"
    icon="circle-question"
    [open]="true"
  >
    <p>Plataforma do Governo Federal...</p>
  </br-accordion-item>
  <br-accordion-item title="Como acessar?" icon="right-to-bracket">
    <p>Acesse gov.br e faça login...</p>
  </br-accordion-item>
</br-accordion>`,

    tabs: `tabItems = [
  { label: 'Dados Pessoais', icon: 'user' },
  { label: 'Endereço', icon: 'location-dot' },
  { label: 'Documentos', icon: 'file', counter: 3 },
];

<br-tab [tabs]="tabItems" [(activeIndex)]="activeTab">
  <br-tab-panel label="Dados Pessoais">
    <p>Conteúdo da aba 1</p>
  </br-tab-panel>
  <br-tab-panel label="Endereço">
    <p>Conteúdo da aba 2</p>
  </br-tab-panel>
</br-tab>`,

    table: `<br-table
  headerStyle="primary"
  [page]="page"
  [totalPages]="5"
  (pageChange)="page = $event"
>
  <thead>
    <tr>
      <th>Nome</th>
      <th>CPF</th>
      <th>Situação</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Maria da Silva</td>
      <td>123.456.789-00</td>
      <td><br-badge variant="success">Ativo</br-badge></td>
    </tr>
  </tbody>
</br-table>`,

    pagination: `<!-- Padrão (com input de página) -->
<br-pagination
  [page]="page"
  [totalPages]="10"
  [totalItems]="100"
  variant="default"
  (pageChange)="page = $event"
></br-pagination>

<!-- Contextual (padrão Gov.br com dropdowns) -->
<br-pagination
  [page]="page"
  [totalPages]="5"
  [totalItems]="50"
  [itemsPerPage]="10"
  variant="contextual"
  [showItemsPerPage]="true"
  [showSummary]="true"
  [showGoToPage]="true"
  (pageChange)="page = $event"
  (itemsPerPageChange)="onItemsPerPageChange($event)"
></br-pagination>`,

    breadcrumb: `breadcrumbItems = [
  { label: 'Serviços', route: '/servicos' },
  { label: 'Cadastro', route: '/cadastro' },
  { label: 'Dados pessoais' },
];

<br-breadcrumb
  [items]="breadcrumbItems"
  [showHome]="true"
  homeRoute="/"
></br-breadcrumb>`,

    stepper: `stepperSteps = [
  { label: 'Identificação', description: 'Dados do solicitante' },
  { label: 'Documentos', description: 'Upload de arquivos' },
  { label: 'Revisão', description: 'Conferir informações' },
];

<br-stepper
  [steps]="stepperSteps"
  [currentStep]="current"
  [clickable]="true"
  (stepChange)="current = $event"
></br-stepper>`,

    timeline: `timelineItems = [
  { title: 'Solicitação criada', date: '01/02/2024', status: 'completed' },
  { title: 'Em análise', date: '02/02/2024', status: 'completed' },
  { title: 'Aprovado', date: '03/02/2024', status: 'current' },
  { title: 'Finalizado', status: 'pending' },
];

<br-timeline [items]="timelineItems"></br-timeline>`,

    loading: `<br-loading size="small"></br-loading>
<br-loading size="medium"></br-loading>
<br-loading size="large"></br-loading>
<br-loading size="medium" [progress]="65"></br-loading>`,

    skeleton: `<br-skeleton variant="line" width="w-3/4"></br-skeleton>
<br-skeleton variant="line"></br-skeleton>
<br-skeleton variant="line" width="w-1/2"></br-skeleton>
<br-skeleton variant="card"></br-skeleton>`,

    modal: `<br-button (click)="modalOpen = true">Abrir Modal</br-button>

<br-modal
  [isOpen]="modalOpen"
  title="Confirmar ação"
  size="medium"
  primaryText="Confirmar"
  cancelText="Cancelar"
  (closed)="modalOpen = false"
  (confirmed)="onConfirm()"
>
  <p>Tem certeza que deseja continuar?</p>
</br-modal>`,

    wizard: `<br-wizard
  [currentStep]="step"
  (stepChange)="step = $event"
  [showNavigation]="true"
>
  <br-wizard-step label="Dados pessoais" icon="user">
    <p>Preencha seus dados.</p>
  </br-wizard-step>
  <br-wizard-step label="Endereço" icon="location-dot">
    <p>Informe seu endereço.</p>
  </br-wizard-step>
  <br-wizard-step label="Revisão" icon="check">
    <p>Revise os dados.</p>
  </br-wizard-step>
</br-wizard>`,

    datepicker: `<br-datepicker
  label="Data de nascimento"
  [(ngModel)]="data"
></br-datepicker>

<br-timepicker
  label="Horário"
  [(ngModel)]="hora"
></br-timepicker>

<br-datetimepicker
  label="Agendamento"
  layout="vertical"
  [(ngModel)]="dataHora"
></br-datetimepicker>`,

    upload: `<br-upload
  label="Documentos"
  accept=".pdf,.jpg,.png"
  [multiple]="true"
  [maxSizeMB]="5"
  helperText="PDF, JPG ou PNG até 5MB"
></br-upload>`,

    divider: `<p>Conteúdo acima</p>
<br-divider></br-divider>
<p>Conteúdo abaixo</p>`,

    signin: `<br-signin variant="primary" size="medium"></br-signin>
<br-signin variant="secondary" size="medium"></br-signin>
<br-signin variant="dark" size="medium"></br-signin>`,

    'magic-button': `magicActions = [
  { id: 'new', icon: 'plus', label: 'Novo' },
  { id: 'edit', icon: 'edit', label: 'Editar' },
  { id: 'share', icon: 'share', label: 'Compartilhar' },
];

<br-magic-button icon="plus" [actions]="magicActions"></br-magic-button>`,

    'sidebar-demo': `<br-sidebar [(mobileOpen)]="sidebarOpen">
  <br-sidebar-item icon="home" label="Início" route="/"></br-sidebar-item>
  <br-sidebar-item icon="user" label="Perfil"></br-sidebar-item>
  <br-sidebar-sub icon="file-alt" label="Documentos" [open]="true">
    <br-sidebar-item label="Enviados"></br-sidebar-item>
    <br-sidebar-item label="Recebidos"></br-sidebar-item>
  </br-sidebar-sub>
  <br-sidebar-item icon="cog" label="Configurações"></br-sidebar-item>
</br-sidebar>`,

    'mega-menu': `<br-mega-menu [(activePanel)]="activePanel">
  <br-mega-menu-trigger label="Serviços" panelId="servicos"></br-mega-menu-trigger>
  <br-mega-menu-trigger label="Cidadão" panelId="cidadao"></br-mega-menu-trigger>

  <br-mega-menu-panel panelId="servicos" [isActive]="activePanel === 'servicos'">
    <br-mega-menu-column title="Consultas">
      <br-mega-menu-link label="Situação cadastral"></br-mega-menu-link>
      <br-mega-menu-link label="Processos"></br-mega-menu-link>
    </br-mega-menu-column>
  </br-mega-menu-panel>

  <br-mega-menu-panel panelId="cidadao" [isActive]="activePanel === 'cidadao'">
    <br-mega-menu-column title="Documentos">
      <br-mega-menu-link label="CPF"></br-mega-menu-link>
      <br-mega-menu-link label="RG"></br-mega-menu-link>
    </br-mega-menu-column>
  </br-mega-menu-panel>
</br-mega-menu>`,

    cookiebar: `cookieGroups = [
  { id: 'essential', label: 'Essenciais', required: true, enabled: true },
  { id: 'analytics', label: 'Analytics', enabled: false },
  { id: 'marketing', label: 'Marketing', enabled: false },
];

<br-cookiebar
  [(visible)]="visible"
  [cookieGroups]="cookieGroups"
  (acceptAll)="onAccept('all')"
  (acceptSelected)="onAccept('selected')"
  (reject)="onAccept('reject')"
>
  <p>Este site utiliza cookies.</p>
</br-cookiebar>`,
  };

  // Form values
  nameValue = '';
  cpfValue = '';
  cnpjValue = '';
  cepValue = '';
  telefoneValue = '';
  moneyValue = 0;
  selectedState = '';
  checkTerms = false;
  checkNotif = true;
  switchDark = false;
  switchNotif = true;
  chip1 = true;
  chip2 = false;
  chip3 = false;
  radioValue = 'pf';
  tablePage = 1;
  paginationPage = 1;
  paginationPage2 = 1;
  tablePageDefault = 1;
  tablePageContextual = 1;
  activeTab = 0;
  stepperCurrent = 1;
  wizardStep = 0;
  dateValue = '';
  timeValue = '';
  datetimeValue = '';
  modalOpen = false;
  modalDangerOpen = false;
  cookiebarVisible = false;
  sidebarDemoOpen = false;
  activeMegaPanel: string | null = null;

  selectOptions: BrSelectOption[] = [
    { label: 'São Paulo', value: 'SP' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'Bahia', value: 'BA' },
    { label: 'Paraná', value: 'PR' },
  ];

  radioOptions: BrRadioOption[] = [
    { label: 'Pessoa Física', value: 'pf' },
    { label: 'Pessoa Jurídica', value: 'pj' },
    { label: 'Estrangeiro', value: 'est', disabled: true },
  ];

  breadcrumbItems: BrBreadcrumbItem[] = [
    { label: 'Serviços', route: '/showcase' },
    { label: 'Cadastro', route: '/showcase' },
    { label: 'Dados pessoais' },
  ];

  tabItems: BrTabItem[] = [
    { label: 'Dados Pessoais', icon: 'user' },
    { label: 'Endereço', icon: 'location-dot' },
    { label: 'Documentos', icon: 'file', counter: 3 },
  ];

  stepperSteps: BrStepperStep[] = [
    { label: 'Identificação', description: 'Dados do solicitante' },
    { label: 'Documentos', description: 'Upload de arquivos' },
    { label: 'Revisão', description: 'Conferir informações' },
    { label: 'Conclusão', description: 'Finalizar processo' },
  ];

  timelineItems = [
    { title: 'Solicitação criada', description: 'Protocolo #12345', date: '01/02/2024 09:00', status: 'completed' as const },
    { title: 'Em análise', description: 'Aguardando documentação', date: '02/02/2024 14:30', status: 'completed' as const },
    { title: 'Aprovado', description: 'Documentação validada', date: '03/02/2024 10:15', status: 'current' as const },
    { title: 'Finalizado', description: 'Processo concluído', status: 'pending' as const },
  ];

  cookieGroups: BrCookieGroup[] = [
    { id: 'essential', label: 'Essenciais', description: 'Cookies necessários', required: true, enabled: true },
    { id: 'analytics', label: 'Analytics', description: 'Cookies para análise', enabled: false },
    { id: 'marketing', label: 'Marketing', description: 'Cookies para anúncios', enabled: false },
  ];

  magicActions = [
    { id: 'new', icon: 'plus', label: 'Novo' },
    { id: 'edit', icon: 'edit', label: 'Editar' },
    { id: 'share', icon: 'share', label: 'Compartilhar' },
  ];

  setActiveSection(id: string): void {
    this.activeSection = id;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  toggleCode(section: string): void {
    this.showCode[section] = !this.showCode[section];
  }

  onCookieAccept(type: string): void {
    console.log('Cookie accept:', type);
  }
}
