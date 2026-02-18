import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  BrFooterComponent,
  BrSkiplinkComponent,
  BrToastContainerComponent,
} from 'ng-govbr-tw';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BrFooterComponent,
    BrSkiplinkComponent,
    BrToastContainerComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <!--
      O skiplink é o PRIMEIRO elemento focável da página — se vier depois de
      qualquer outro, deixa de cumprir a função.
    -->
    <br-skiplink></br-skiplink>

    <div class="min-h-screen flex flex-col bg-govbr-gray-2">
      <main id="conteudo" class="flex-1">
        <router-outlet></router-outlet>
      </main>

      <br-footer
        logoSrc="https://www.gov.br/++theme++flavor/static/images/govbr-logo-large.png"
      >
        <div class="text-center text-sm text-govbr-gray-60">
          <p>Biblioteca open-source para Angular 17+</p>
          <p class="mt-1">
            <a href="https://github.com/jordaobass/ng-govbr-tw" target="_blank" class="text-govbr-primary hover:underline">
              GitHub
            </a>
            &bull;
            <a href="https://www.npmjs.com/package/@schenkerjon/ng-govbr-tw" target="_blank" class="text-govbr-primary hover:underline">
              NPM
            </a>
            &bull;
            <!-- Caminho relativo: o demo é servido sob /ng-govbr-tw/, então
                 isto resolve para /ng-govbr-tw/storybook/. -->
            <a href="storybook/" class="text-govbr-primary hover:underline">
              Documentação dos componentes
            </a>
          </p>
        </div>
      </br-footer>
    </div>

    <!--
      Container de toast montado UMA vez na casca, como manda o padrão do
      componente. Antes não era montado em lugar nenhum: o BrToastService tinha
      13 testes unitários e nenhum toast jamais apareceu na tela.
    -->
    <br-toast-container position="top-right"></br-toast-container>
  `,
})
export class AppComponent {}
