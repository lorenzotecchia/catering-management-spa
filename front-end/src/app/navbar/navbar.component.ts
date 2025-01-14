import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../_services/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { effect } from '@angular/core';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent {
  unreadNotificationsCount: number = 0;

  get isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  constructor(
    private restService: RestBackendService,
    private auth: AuthService,
    private router: Router
  ) {
    effect(() => {
      if (this.auth.isAuthenticated()) {
        this.loadUnreadNotificationCount();
      } else {
        this.unreadNotificationsCount = 0
      }
    });
  }

  private loadUnreadNotificationCount() {
    this.restService.getUnreadNotificationsCount().subscribe({
      next: (count) => {
        this.unreadNotificationsCount = count
      },
      error: (error) => console.error('Error loading notifications', error)
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
