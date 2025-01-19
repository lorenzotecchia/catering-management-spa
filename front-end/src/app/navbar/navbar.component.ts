import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../_services/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { effect } from '@angular/core';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent {
  eventsCount: number = 0

  get isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  constructor(
    private restService: RestBackendService,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    effect(() => {
      const userRole = localStorage.getItem('userRole')
      if (this.auth.isAuthenticated() && userRole === 'waiter') {
        this.loadEventsCount();
      } else {
        this.eventsCount = 0
      }
    });
  }

  private loadEventsCount() {
    this.restService.getEvents().subscribe({
      next: (events) => {
        const count = events.length;
        if (count > 0) {
          this.toastr.info(
            `You have been added to ${count} event${count === 1 ? '' : 's'}`,
            'Your Events'
          );
        }
      },
      error: (error) => console.error('Error loading events:', error)
    })
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  doLogout() {
    this.auth.logout();
    this.router.navigate([''])
  }

  get showNavbar(): boolean {
    return this.isAuthenticated && this.router.url !== '/' && this.router.url !== '/login';
  }

}
