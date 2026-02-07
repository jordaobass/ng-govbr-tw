import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BR_ANIMATION_CONFIG } from 'ng-govbr-tw';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: BR_ANIMATION_CONFIG,
      useValue: {
        enabled: true,
        defaultDuration: 'normal',
        defaultEasing: 'ease-out',
        respectReducedMotion: true,
      },
    },
  ],
};
