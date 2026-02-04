import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  BrLayoutComponent,
  BrHeaderComponent,
  BrFooterComponent,
  BrMenuComponent,
  BrMenuItemComponent,
} from 'ng-govbr-tw';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BrLayoutComponent,
    BrHeaderComponent,
    BrFooterComponent,
    BrMenuComponent,
    BrMenuItemComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <br-layout>
      <br-header
        systemTitle="Gov.br Tailwind Demo"
        systemSubtitle="Biblioteca de componentes Angular"
        logoSrc="https://www.gov.br/++theme++flavor/static/images/govbr-logo-large.png"
        userName="Administrador"
        userRole="Gestor do Sistema"
        (logout)="onLogout()"
      ></br-header>

      <br-menu>
        <br-menu-item route="/showcase" label="Showcase" icon="grid-2"></br-menu-item>
        <br-menu-item route="/showcase" label="Dashboard" icon="chart-line"></br-menu-item>
        <br-menu-item route="/showcase" label="Usuarios" icon="users"></br-menu-item>
        <br-menu-item route="/showcase" label="Configuracoes" icon="gear"></br-menu-item>
      </br-menu>

      <router-outlet></router-outlet>

      <br-footer logoSrc="https://www.gov.br/++theme++flavor/static/images/govbr-logo-large.png">
        <p>Governo Digital &mdash; Todos os direitos reservados</p>
        <p>Desenvolvido com &#64;aspect-br/ng-govbr-tw</p>
      </br-footer>
    </br-layout>
  `,
})
export class AppComponent {
  onLogout(): void {
    console.log('Logout clicked');
  }
}
