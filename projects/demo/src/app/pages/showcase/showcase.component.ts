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
} from 'ng-govbr-tw';
import type { BrRadioOption, BrSelectOption, BrBreadcrumbItem, BrTabItem } from 'ng-govbr-tw';

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
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="space-y-12">

      <!-- ─── BUTTONS ────────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Botoes</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componente: <code>br-button</code></p>
        <div class="flex flex-wrap gap-3 items-center">
          <br-button variant="primary">Primario</br-button>
          <br-button variant="secondary">Secundario</br-button>
          <br-button variant="danger">Perigo</br-button>
          <br-button variant="primary" icon="plus">Com Icone</br-button>
          <br-button variant="primary" [loading]="true">Carregando</br-button>
          <br-button variant="primary" [disabled]="true">Desabilitado</br-button>
          <br-button variant="primary" [circle]="true" icon="plus"></br-button>
          <br-button variant="primary" size="small">Pequeno</br-button>
          <br-button variant="primary" size="large">Grande</br-button>
        </div>
        <div class="mt-3">
          <br-button variant="primary" [block]="true">Botao Block (largura total)</br-button>
        </div>
      </section>

      <!-- ─── INPUTS ─────────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Campos de Entrada</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componente: <code>br-input</code></p>
        <div class="max-w-md space-y-2">
          <br-input label="Nome completo" placeholder="Digite seu nome" [(ngModel)]="nameValue" [required]="true"></br-input>
          <br-input label="E-mail" type="email" placeholder="seu@email.com"></br-input>
          <br-input label="Senha" type="password" placeholder="******"></br-input>
          <br-input label="Campo com erro" placeholder="Valor invalido" error="Este campo e obrigatorio"></br-input>
          <br-input label="Busca" type="search" placeholder="Pesquisar..."></br-input>
          <br-input label="Arquivo" type="file" placeholder="Selecionar arquivo"></br-input>
          <p class="text-sm text-govbr-gray-40" *ngIf="nameValue">Valor digitado: {{ nameValue }}</p>
        </div>
      </section>

      <!-- ─── SELECT ─────────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Select</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componente: <code>br-select</code></p>
        <div class="max-w-md space-y-4">
          <br-select
            label="Estado"
            placeholder="Selecione um estado"
            [options]="selectOptions"
            [(ngModel)]="selectedState"
          ></br-select>
          <br-select
            label="Com busca"
            placeholder="Digite para filtrar"
            [options]="selectOptions"
            [searchable]="true"
          ></br-select>
          <br-select
            label="Multi-selecao"
            placeholder="Escolha varios"
            [options]="selectOptions"
            [multiple]="true"
          ></br-select>
          <p class="text-sm text-govbr-gray-40" *ngIf="selectedState">Selecionado: {{ selectedState }}</p>
        </div>
      </section>

      <!-- ─── TEXTAREA ───────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Textarea</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componente: <code>br-textarea</code></p>
        <div class="max-w-md space-y-4">
          <br-textarea
            label="Descricao"
            placeholder="Digite uma descricao..."
            [maxLength]="200"
            helperText="Maximo de 200 caracteres"
          ></br-textarea>
          <br-textarea
            label="Com erro"
            placeholder="Campo obrigatorio"
            error="Este campo e obrigatorio"
            [required]="true"
          ></br-textarea>
        </div>
      </section>

      <!-- ─── CHECKBOX ───────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Checkbox</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componente: <code>br-checkbox</code></p>
        <div class="space-y-2">
          <br-checkbox label="Aceito os termos de uso" [(ngModel)]="checkTerms"></br-checkbox>
          <br-checkbox label="Receber notificacoes por e-mail" [(ngModel)]="checkNotif"></br-checkbox>
          <br-checkbox label="Indeterminado" [indeterminate]="true"></br-checkbox>
          <br-checkbox label="Com erro" state="invalid" error="Selecao obrigatoria"></br-checkbox>
          <p class="text-sm text-govbr-gray-40">Termos: {{ checkTerms }} | Notificacoes: {{ checkNotif }}</p>
        </div>
      </section>

      <!-- ─── RADIO ──────────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Radio</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componente: <code>br-radio-group</code></p>
        <div class="space-y-4">
          <br-radio-group
            legend="Tipo de pessoa"
            [options]="radioOptions"
            [(ngModel)]="radioValue"
          ></br-radio-group>
          <br-radio-group
            legend="Inline"
            [options]="radioOptions"
            [inline]="true"
            [(ngModel)]="radioValue"
          ></br-radio-group>
          <p class="text-sm text-govbr-gray-40">Selecionado: {{ radioValue }}</p>
        </div>
      </section>

      <!-- ─── BADGES ─────────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Badges</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componente: <code>br-badge</code></p>
        <div class="flex flex-wrap gap-2">
          <br-badge variant="primary">Primario</br-badge>
          <br-badge variant="success">Sucesso</br-badge>
          <br-badge variant="danger">Erro</br-badge>
          <br-badge variant="warning">Alerta</br-badge>
          <br-badge variant="neutral">Neutro</br-badge>
        </div>
      </section>

      <!-- ─── MESSAGES ───────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Mensagens</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componente: <code>br-message</code></p>
        <div class="space-y-3">
          <br-message type="success">Operacao realizada com sucesso!</br-message>
          <br-message type="danger">Ocorreu um erro ao processar sua solicitacao.</br-message>
          <br-message type="warning" [dismissible]="true">Atencao: verifique os dados antes de prosseguir.</br-message>
          <br-message type="info">Informacao: o sistema estara em manutencao amanha.</br-message>
        </div>
      </section>

      <!-- ─── TOOLTIP ────────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Tooltip</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componente: <code>br-tooltip</code></p>
        <div class="flex flex-wrap gap-4 items-center">
          <br-tooltip text="Tooltip acima" place="top">
            <br-button variant="secondary" size="small">Top</br-button>
          </br-tooltip>
          <br-tooltip text="Tooltip abaixo" place="bottom">
            <br-button variant="secondary" size="small">Bottom</br-button>
          </br-tooltip>
          <br-tooltip text="Tooltip a esquerda" place="left">
            <br-button variant="secondary" size="small">Left</br-button>
          </br-tooltip>
          <br-tooltip text="Tooltip a direita" place="right">
            <br-button variant="secondary" size="small">Right</br-button>
          </br-tooltip>
          <br-tooltip text="Sucesso!" variant="success">
            <br-button variant="secondary" size="small">Success</br-button>
          </br-tooltip>
          <br-tooltip text="Erro!" variant="danger">
            <br-button variant="secondary" size="small">Danger</br-button>
          </br-tooltip>
        </div>
      </section>

      <!-- ─── CARDS ──────────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Cards</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componente: <code>br-card</code></p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <br-card icon="users" linkText="Ver detalhes" linkRoute="/showcase">
            <h3 class="text-lg font-semibold text-govbr-gray-80 mb-1">Usuarios</h3>
            <p class="text-3xl font-bold text-govbr-primary">1.234</p>
            <p class="text-sm text-govbr-gray-40">Usuarios ativos no sistema</p>
          </br-card>
          <br-card icon="file-lines" linkText="Ver relatorios" linkRoute="/showcase">
            <h3 class="text-lg font-semibold text-govbr-gray-80 mb-1">Documentos</h3>
            <p class="text-3xl font-bold text-govbr-primary">567</p>
            <p class="text-sm text-govbr-gray-40">Documentos processados</p>
          </br-card>
          <br-card icon="chart-line" linkText="Ver dashboard" linkRoute="/showcase">
            <h3 class="text-lg font-semibold text-govbr-gray-80 mb-1">Solicitacoes</h3>
            <p class="text-3xl font-bold text-govbr-success">98%</p>
            <p class="text-sm text-govbr-gray-40">Taxa de atendimento</p>
          </br-card>
        </div>
      </section>

      <!-- ─── ACCORDION ──────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Accordion</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componentes: <code>br-accordion</code> + <code>br-accordion-item</code></p>
        <div class="max-w-xl">
          <br-accordion mode="single">
            <br-accordion-item title="O que e o Gov.br?" icon="circle-question" [open]="true">
              <p class="text-govbr-sm text-govbr-gray-60">
                O Gov.br e a plataforma do Governo Federal que reune servicos
                publicos digitais em um unico lugar.
              </p>
            </br-accordion-item>
            <br-accordion-item title="Como acessar?" icon="right-to-bracket">
              <p class="text-govbr-sm text-govbr-gray-60">
                Acesse gov.br e faca login com sua conta.
                Voce pode usar CPF e senha, certificado digital ou login Gov.br.
              </p>
            </br-accordion-item>
            <br-accordion-item title="Preciso pagar?" icon="credit-card" [disabled]="true">
              <p class="text-govbr-sm text-govbr-gray-60">
                Nao, os servicos do Gov.br sao gratuitos.
              </p>
            </br-accordion-item>
          </br-accordion>
        </div>
      </section>

      <!-- ─── TABS ───────────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Tabs</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componentes: <code>br-tab</code> + <code>br-tab-panel</code></p>
        <div class="max-w-xl">
          <br-tab [tabs]="tabItems" [(activeIndex)]="activeTab">
            <br-tab-panel label="Dados Pessoais">
              <p class="text-govbr-sm text-govbr-gray-60 py-4">
                Formulario com dados pessoais: nome, CPF, data de nascimento.
              </p>
            </br-tab-panel>
            <br-tab-panel label="Endereco">
              <p class="text-govbr-sm text-govbr-gray-60 py-4">
                Formulario com endereco: CEP, rua, numero, cidade, estado.
              </p>
            </br-tab-panel>
            <br-tab-panel label="Documentos">
              <p class="text-govbr-sm text-govbr-gray-60 py-4">
                Upload de documentos: RG, CPF, comprovante de residencia.
              </p>
            </br-tab-panel>
          </br-tab>
        </div>
      </section>

      <!-- ─── LIST ───────────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">List</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componentes: <code>br-list</code> + <code>br-item</code></p>
        <div class="max-w-md">
          <br-list title="Servicos recentes" variant="bordered">
            <br-item
              title="Consulta CPF"
              subtitle="Receita Federal"
              icon="id-card"
              [clickable]="true"
              [showArrow]="true"
            ></br-item>
            <br-item
              title="Carteira de Trabalho Digital"
              subtitle="Ministerio do Trabalho"
              icon="briefcase"
              tag="Novo"
              [clickable]="true"
              [showArrow]="true"
            ></br-item>
            <br-item
              title="Meu INSS"
              subtitle="Instituto Nacional do Seguro Social"
              icon="shield-halved"
              [clickable]="true"
              [showArrow]="true"
            ></br-item>
          </br-list>
        </div>
      </section>

      <!-- ─── TABLE ──────────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Tabela</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componente: <code>br-table</code> com <code>headerStyle</code>: primary | secondary | light</p>

        <div class="space-y-6">
          <div>
            <p class="text-govbr-xs font-semibold text-govbr-gray-40 mb-2 uppercase">headerStyle="primary" (default)</p>
            <br-table headerStyle="primary" [page]="tablePage" [totalPages]="5" (pageChange)="tablePage = $event">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Situacao</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Maria da Silva</td>
                  <td>123.456.789-00</td>
                  <td><br-badge variant="success">Ativo</br-badge></td>
                  <td><br-button variant="secondary" size="small" icon="eye">Ver</br-button></td>
                </tr>
                <tr>
                  <td>Joao Santos</td>
                  <td>987.654.321-00</td>
                  <td><br-badge variant="warning">Pendente</br-badge></td>
                  <td><br-button variant="secondary" size="small" icon="eye">Ver</br-button></td>
                </tr>
              </tbody>
            </br-table>
          </div>

          <div>
            <p class="text-govbr-xs font-semibold text-govbr-gray-40 mb-2 uppercase">headerStyle="secondary"</p>
            <br-table headerStyle="secondary">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Situacao</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Carlos Souza</td>
                  <td>111.222.333-44</td>
                  <td><br-badge variant="success">Ativo</br-badge></td>
                </tr>
              </tbody>
            </br-table>
          </div>

          <div>
            <p class="text-govbr-xs font-semibold text-govbr-gray-40 mb-2 uppercase">headerStyle="light"</p>
            <br-table headerStyle="light">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Situacao</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ana Oliveira</td>
                  <td>456.789.123-00</td>
                  <td><br-badge variant="danger">Inativo</br-badge></td>
                </tr>
              </tbody>
            </br-table>
          </div>
        </div>
      </section>

      <!-- ─── PAGINATION ─────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Paginacao</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componente: <code>br-pagination</code></p>
        <div class="space-y-4">
          <br-pagination [page]="paginationPage" [totalPages]="10" (pageChange)="paginationPage = $event"></br-pagination>
          <br-pagination [page]="paginationPage" [totalPages]="10" [showFirstLast]="true" density="small" (pageChange)="paginationPage = $event"></br-pagination>
          <p class="text-sm text-govbr-gray-40">Pagina atual: {{ paginationPage }}</p>
        </div>
      </section>

      <!-- ─── BREADCRUMB ─────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Breadcrumb</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componente: <code>br-breadcrumb</code></p>
        <br-breadcrumb [items]="breadcrumbItems" [showHome]="true" homeRoute="/showcase"></br-breadcrumb>
      </section>

      <!-- ─── LOADING ────────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Loading</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componente: <code>br-loading</code></p>
        <div class="flex flex-wrap gap-8 items-end">
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
            <p class="text-govbr-xs text-govbr-gray-40 mt-2">Progresso 65%</p>
          </div>
          <div class="text-center">
            <br-loading size="large" [progress]="100"></br-loading>
            <p class="text-govbr-xs text-govbr-gray-40 mt-2">Completo</p>
          </div>
        </div>
      </section>

      <!-- ─── MODAL ──────────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Modal</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componente: <code>br-modal</code></p>
        <div class="flex flex-wrap gap-3">
          <br-button variant="primary" (click)="modalOpen = true">Abrir Modal</br-button>
          <br-button variant="secondary" (click)="modalSmallOpen = true">Modal Pequeno</br-button>
          <br-button variant="danger" (click)="modalDangerOpen = true">Modal Danger</br-button>
          <br-button variant="primary" (click)="modalSuccessOpen = true">Modal Success</br-button>
        </div>
        <br-modal
          [isOpen]="modalOpen"
          title="Confirmar acao"
          size="medium"
          primaryText="Confirmar"
          cancelText="Cancelar"
          (closed)="modalOpen = false"
          (confirmed)="modalOpen = false"
          (canceled)="modalOpen = false"
        >
          <p class="text-govbr-sm text-govbr-gray-60">
            Tem certeza que deseja continuar com esta acao?
            Esta operacao nao pode ser desfeita.
          </p>
        </br-modal>
        <br-modal
          [isOpen]="modalSmallOpen"
          title="Aviso"
          size="small"
          [showCancelButton]="false"
          primaryText="Entendi"
          (closed)="modalSmallOpen = false"
          (confirmed)="modalSmallOpen = false"
        >
          <br-message type="info">Sua sessao expira em 5 minutos.</br-message>
        </br-modal>
        <br-modal
          [isOpen]="modalDangerOpen"
          title="Excluir registro"
          size="small"
          variant="danger"
          primaryText="Excluir"
          (closed)="modalDangerOpen = false"
          (confirmed)="modalDangerOpen = false"
          (canceled)="modalDangerOpen = false"
        >
          <p class="text-govbr-sm text-govbr-gray-60">
            Esta acao ira excluir permanentemente o registro. Deseja continuar?
          </p>
        </br-modal>
        <br-modal
          [isOpen]="modalSuccessOpen"
          title="Operacao concluida"
          size="small"
          variant="success"
          primaryText="Fechar"
          [showCancelButton]="false"
          (closed)="modalSuccessOpen = false"
          (confirmed)="modalSuccessOpen = false"
        >
          <p class="text-govbr-sm text-govbr-gray-60">
            O cadastro foi realizado com sucesso.
          </p>
        </br-modal>
      </section>

      <!-- ─── WIZARD ─────────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Wizard (Stepper)</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componentes: <code>br-wizard</code> + <code>br-wizard-step</code></p>
        <div class="max-w-xl">
          <br-wizard [currentStep]="wizardStep" (stepChange)="wizardStep = $event" [showNavigation]="true">
            <br-wizard-step label="Dados pessoais" icon="user">
              <p class="text-govbr-sm text-govbr-gray-60 py-4">
                Preencha seus dados pessoais: nome, CPF, data de nascimento.
              </p>
            </br-wizard-step>
            <br-wizard-step label="Endereco" icon="location-dot">
              <p class="text-govbr-sm text-govbr-gray-60 py-4">
                Informe seu endereco completo com CEP.
              </p>
            </br-wizard-step>
            <br-wizard-step label="Revisao" icon="check">
              <p class="text-govbr-sm text-govbr-gray-60 py-4">
                Revise os dados antes de enviar o formulario.
              </p>
            </br-wizard-step>
          </br-wizard>
        </div>
      </section>

      <!-- ─── DATEPICKER ─────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Datepicker / Timepicker</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componentes: <code>br-datepicker</code>, <code>br-timepicker</code>, <code>br-datetimepicker</code></p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
          <br-datepicker label="Data de nascimento" [(ngModel)]="dateValue"></br-datepicker>
          <br-timepicker label="Horario" [(ngModel)]="timeValue"></br-timepicker>
          <br-datetimepicker label="Agendamento" layout="vertical" [(ngModel)]="datetimeValue"></br-datetimepicker>
        </div>
      </section>

      <!-- ─── AVATAR ────────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Avatar</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componente: <code>br-avatar</code></p>
        <div class="flex flex-wrap gap-4 items-end">
          <br-avatar name="Maria Silva" size="xsmall"></br-avatar>
          <br-avatar name="Joao Santos" size="small" variant="neutral"></br-avatar>
          <br-avatar name="Ana Oliveira" size="medium" status="online"></br-avatar>
          <br-avatar name="Carlos Souza" size="large" variant="success" status="busy"></br-avatar>
          <br-avatar src="https://i.pravatar.cc/80?img=5" name="Foto" size="large" status="online"></br-avatar>
          <br-avatar name="Pedro Lima" size="xlarge" variant="danger" status="away"></br-avatar>
        </div>
      </section>

      <!-- ─── UPLOAD ────────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Upload</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componente: <code>br-upload</code></p>
        <div class="max-w-lg space-y-6">
          <br-upload
            label="Documentos"
            accept=".pdf,.jpg,.png"
            [multiple]="true"
            [maxSizeMB]="5"
            helperText="PDF, JPG ou PNG ate 5MB cada"
          ></br-upload>
          <br-upload
            label="Foto de perfil"
            accept="image/*"
            [maxFiles]="1"
          ></br-upload>
        </div>
      </section>

      <!-- ─── SKELETON ──────────────────────────────────────────── -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-1">Skeleton</h2>
        <p class="text-govbr-sm text-govbr-gray-40 mb-4">Componente: <code>br-skeleton</code></p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-govbr-xs font-semibold text-govbr-gray-40 mb-2 uppercase">Linhas</p>
            <div class="space-y-2">
              <br-skeleton variant="line" width="w-3/4"></br-skeleton>
              <br-skeleton variant="line"></br-skeleton>
              <br-skeleton variant="line" width="w-1/2"></br-skeleton>
            </div>
          </div>
          <div>
            <p class="text-govbr-xs font-semibold text-govbr-gray-40 mb-2 uppercase">Lista</p>
            <br-skeleton variant="list" [rows]="3"></br-skeleton>
          </div>
          <div>
            <p class="text-govbr-xs font-semibold text-govbr-gray-40 mb-2 uppercase">Card</p>
            <br-skeleton variant="card"></br-skeleton>
          </div>
          <div>
            <p class="text-govbr-xs font-semibold text-govbr-gray-40 mb-2 uppercase">Tabela</p>
            <br-skeleton variant="table" [rows]="3" [cols]="4"></br-skeleton>
          </div>
        </div>
      </section>

    </div>
  `,
})
export class ShowcaseComponent {
  // Input
  nameValue = '';

  // Select
  selectedState = '';
  selectOptions: BrSelectOption[] = [
    { label: 'Sao Paulo', value: 'SP' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'Bahia', value: 'BA' },
    { label: 'Parana', value: 'PR' },
  ];

  // Checkbox
  checkTerms = false;
  checkNotif = true;

  // Radio
  radioValue = 'pf';
  radioOptions: BrRadioOption[] = [
    { label: 'Pessoa Fisica', value: 'pf' },
    { label: 'Pessoa Juridica', value: 'pj' },
    { label: 'Estrangeiro', value: 'est', disabled: true },
  ];

  // Table
  tablePage = 1;

  // Pagination
  paginationPage = 1;

  // Breadcrumb
  breadcrumbItems: BrBreadcrumbItem[] = [
    { label: 'Servicos', route: '/showcase' },
    { label: 'Cadastro', route: '/showcase' },
    { label: 'Dados pessoais' },
  ];

  // Tabs
  activeTab = 0;
  tabItems: BrTabItem[] = [
    { label: 'Dados Pessoais', icon: 'user' },
    { label: 'Endereco', icon: 'location-dot' },
    { label: 'Documentos', icon: 'file', counter: 3 },
  ];

  // Modal
  modalOpen = false;
  modalSmallOpen = false;
  modalDangerOpen = false;
  modalSuccessOpen = false;

  // Wizard
  wizardStep = 0;

  // Date/Time
  dateValue = '';
  timeValue = '';
  datetimeValue = '';
}
