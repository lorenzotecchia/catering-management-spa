import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './_guards/auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { EventPageComponent } from './homepage/event-page/event-page.component';
import { WelcomePageComponent } from './welcomepage/welcomepage.component';
import { EventCreationFormComponent } from './homepage/event-page/event-creation-form/event-creation-form.component';
import { CalendarPageComponent } from './homepage/calendar-page/calendar-page.component';

export const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'events', canActivate: [authGuard], children: [
      {
        path: '',
        component: EventPageComponent
      },
      {
        path: 'create',
        component: EventCreationFormComponent,
        canActivate: [roleGuard],
        data: { roles: ['maitre'] }
      },
      {
        path: ':id/edit',
        component: EventCreationFormComponent,
        canActivate: [roleGuard],
        data: { roles: ['maitre'] }
      }
    ]
  },
  {
    path: 'calendar',
    component: CalendarPageComponent,
    canActivate: [authGuard]
  },
];
