import { Component, ViewEncapsulation } from '@angular/core';
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
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="showcase-container">
      <!-- Mobile Header -->
      <header class="showcase-mobile-header">
        <button
          type="button"
          class="showcase-menu-toggle"
          (click)="toggleMobileMenu()"
          aria-label="Abrir menu"
        >
          <i class="fas fa-bars"></i>
        </button>
        <h1 class="showcase-mobile-title">Componentes Gov.br</h1>
      </header>

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

            <div class="bg-white rounded-lg border border-govbr-gray-10 overflow-hidden">
              <div class="p-6 space-y-8">
                <div>
                  <p class="text-govbr-xs font-semibold text-govbr-gray-40 mb-3 uppercase">Padrão (com input)</p>
                  <br-pagination
                    [page]="paginationPage"
                    [totalPages]="10"
                    [totalItems]="100"
                    [itemsPerPage]="10"
                    variant="default"
                    (pageChange)="paginationPage = $event"
                  ></br-pagination>
                </div>
                <div>
                  <p class="text-govbr-xs font-semibold text-govbr-gray-40 mb-3 uppercase">Contextual (padrão Gov.br com dropdowns)</p>
                  <br-pagination
                    [page]="paginationPage2"
                    [totalPages]="5"
                    [totalItems]="50"
                    [itemsPerPage]="10"
                    variant="contextual"
                    (pageChange)="paginationPage2 = $event"
                  ></br-pagination>
                </div>
              </div>

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
              <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <br-datepicker label="Data" [(ngModel)]="dateValue"></br-datepicker>
                <br-timepicker label="Horário" [(ngModel)]="timeValue"></br-timepicker>
                <br-datetimepicker label="Agendamento" layout="vertical" [(ngModel)]="datetimeValue"></br-datetimepicker>
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
              <div class="p-6">
                <p class="text-govbr-sm text-govbr-gray-60">Veja o botão flutuante no canto inferior direito da tela.</p>
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

    <!-- Magic Button -->
    <br-magic-button icon="plus" [actions]="magicActions"></br-magic-button>

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
  `,
  styles: [`
    :host {
      display: block;
    }

    /* ═══════════════════════════════════════════════════════════════
       SHOWCASE RESPONSIVE LAYOUT
       ═══════════════════════════════════════════════════════════════ */

    .showcase-container {
      display: flex;
      min-height: 100vh;
      background: var(--govbr-gray-2, #f8f8f8);
    }

    /* ─── MOBILE HEADER ─────────────────────────────────────────────── */
    .showcase-mobile-header {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 56px;
      background: var(--govbr-primary, #1351b4);
      color: white;
      z-index: 100;
      align-items: center;
      padding: 0 16px;
      gap: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
      top: 0;
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
        top: 0;
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

      .showcase-mobile-header {
        display: flex;
      }

      .showcase-overlay {
        display: block;
      }

      .showcase-sidebar-close {
        display: flex;
      }

      /* Conteúdo principal - NÃO move quando sidebar abre */
      .showcase-main {
        margin-left: 0 !important;
        padding-top: 56px;
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
    { id: 'cookiebar', name: 'Cookie Bar', icon: 'cookie-bite' },
  ];

  codeExamples: Record<string, string> = {
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
  activeTab = 0;
  stepperCurrent = 1;
  wizardStep = 0;
  dateValue = '';
  timeValue = '';
  datetimeValue = '';
  modalOpen = false;
  modalDangerOpen = false;
  cookiebarVisible = false;

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
