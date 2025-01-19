import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './_interceptors/auth/auth.interceptor';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMarkdown } from 'ngx-markdown';
import { FullCalendarModule } from '@fullcalendar/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideToastr({
      timeOut: 4000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      easing: 'ease-in',
      easeTime: 300,
      enableHtml: true,
      tapToDismiss: true,
      maxOpened: 3,
      autoDismiss: true,
      newestOnTop: true
    }),
    provideHttpClient(
      withFetch(), // Utilizza l'API Fetch invece di XMLHttpRequests
      withInterceptors([authInterceptor])
    ),
    MatIconModule,
    provideAnimations(),
    provideMarkdown(),
    importProvidersFrom(FullCalendarModule)
  ]
};
