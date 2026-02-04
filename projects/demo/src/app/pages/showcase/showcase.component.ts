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
} from 'ng-govbr-tw';

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
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="space-y-12">
      <!-- BUTTONS -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-4">Botoes</h2>
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

      <!-- INPUTS -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-4">Campos de Entrada</h2>
        <div class="max-w-md space-y-2">
          <br-input label="Nome completo" placeholder="Digite seu nome" [(ngModel)]="nameValue" [required]="true"></br-input>
          <br-input label="E-mail" type="email" placeholder="seu@email.com"></br-input>
          <br-input label="Senha" type="password" placeholder="******"></br-input>
          <br-input label="Campo com erro" placeholder="Valor invalido" error="Este campo e obrigatorio"></br-input>
          <br-input label="Selecione uma opcao" type="select" placeholder="Escolha...">
            <option value="op1">Opcao 1</option>
            <option value="op2">Opcao 2</option>
            <option value="op3">Opcao 3</option>
          </br-input>
          <br-input label="Arquivo" type="file" placeholder="Selecionar arquivo"></br-input>
          <p class="text-sm text-govbr-gray-40" *ngIf="nameValue">Valor digitado: {{ nameValue }}</p>
        </div>
      </section>

      <!-- BADGES -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-4">Badges</h2>
        <div class="flex flex-wrap gap-2">
          <br-badge variant="primary">Primario</br-badge>
          <br-badge variant="success">Sucesso</br-badge>
          <br-badge variant="danger">Erro</br-badge>
          <br-badge variant="warning">Alerta</br-badge>
          <br-badge variant="neutral">Neutro</br-badge>
        </div>
      </section>

      <!-- MESSAGES -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-4">Mensagens</h2>
        <div class="space-y-3">
          <br-message type="success">Operacao realizada com sucesso!</br-message>
          <br-message type="danger">Ocorreu um erro ao processar sua solicitacao.</br-message>
          <br-message type="warning" [dismissible]="true">Atencao: verifique os dados antes de prosseguir.</br-message>
          <br-message type="info">Informacao: o sistema estara em manutencao amanha.</br-message>
        </div>
      </section>

      <!-- CARDS -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-4">Cards</h2>
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

      <!-- TABLE -->
      <section>
        <h2 class="text-2xl font-bold text-govbr-gray-80 mb-4">Tabela</h2>
        <br-table [page]="tablePage" [totalPages]="5" (pageChange)="tablePage = $event">
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
              <td>
                <br-button variant="secondary" size="small" icon="eye">Ver</br-button>
              </td>
            </tr>
            <tr>
              <td>Joao Santos</td>
              <td>987.654.321-00</td>
              <td><br-badge variant="warning">Pendente</br-badge></td>
              <td>
                <br-button variant="secondary" size="small" icon="eye">Ver</br-button>
              </td>
            </tr>
            <tr>
              <td>Ana Oliveira</td>
              <td>456.789.123-00</td>
              <td><br-badge variant="danger">Inativo</br-badge></td>
              <td>
                <br-button variant="secondary" size="small" icon="eye">Ver</br-button>
              </td>
            </tr>
          </tbody>
        </br-table>
      </section>
    </div>
  `,
})
export class ShowcaseComponent {
  nameValue = '';
  tablePage = 1;
}
