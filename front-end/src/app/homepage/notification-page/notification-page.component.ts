import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../../_services/rest-backend/rest-backend.service';
import { NotificationDetailComponent } from './notification-detail/notification-detail.component';
import { NotificationItem } from '../../_services/rest-backend/notification-item';

@Component({
  selector: 'app-notification-page',
  imports: [CommonModule, NotificationDetailComponent],
  templateUrl: './notification-page.component.html',
  styleUrl: './notification-page.component.sass'
})

// notification-page.component.ts
export class NotificationPageComponent implements OnInit {
  notifications: NotificationItem[] = [];

  constructor(
    private restService: RestBackendService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    console.log('Loading notifications...');
    this.restService.getNotifications().subscribe({
      next: (notifications) => {
        console.log('Received notifications:', notifications);
        this.notifications = notifications;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.toastr.error('Failed to load notifications');
      }
    });
  }

  handleAccept(notification: NotificationItem) {
    if (notification.id) {
      this.restService.markNotificationAsRead(notification.id).subscribe({
        next: () => {
          this.toastr.success('You have accepted the invitation');
          this.loadNotifications(); // Reload notifications
        },
        error: (error) => {
          console.error('Error accepting invitation:', error);
          this.toastr.error('Failed to accept invitation');
        }
      });
    }
  }

  handleDecline(notification: NotificationItem) {
    if (notification.id) {
      this.restService.markNotificationAsRead(notification.id).subscribe({
        next: () => {
          this.toastr.info('You have declined the invitation');
          this.loadNotifications(); // Reload notifications
        },
        error: (error) => {
          console.error('Error declining invitation:', error);
          this.toastr.error('Failed to decline invitation');
        }
      });
    }
  }
}
