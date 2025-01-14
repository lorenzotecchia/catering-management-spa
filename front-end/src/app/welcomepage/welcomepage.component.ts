// src/app/welcomepage/welcomepage.component.ts
import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './welcomepage.component.html',
  styleUrl: './welcomepage.component.sass'
})
export class WelcomePageComponent {
  router = inject(Router);
}
