import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { enableProdMode } from '@angular/core';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideHttpClient } from '@angular/common/http'; // NECESARIO TENER INSTALADO

enableProdMode();

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(), // NECESARIO TENER INSTALADO
    provideRouter(routes, withPreloading(PreloadAllModules)),

    provideAuth0({
      domain: 'dev-yonz0ue78cor27pr.us.auth0.com',
      clientId: 'YCObZcaDnn2XMenaNSoyyRmhUbncXYux',
      authorizationParams: {
        redirect_uri: 'https://dragonballrpg-3a242.web.app/' // Asegúrate de que la URL coincida
      }
    }),

  ],
});