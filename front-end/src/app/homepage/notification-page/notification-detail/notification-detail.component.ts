import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NotificationItem } from '../../../_services/rest-backend/notification-item';


@Component({
  selector: 'app-notification-detail',
  imports: [CommonModule],
  templateUrl: './notification-detail.component.html',
  styleUrl: './notification-detail.component.sass'
})

export class NotificationDetailComponent {
  @Input() notification!: NotificationItem;
  @Output() accept = new EventEmitter<void>();
  @Output() decline = new EventEmitter<void>();

  onAccept() {
    this.accept.emit();
  }

  onDecline() {
    this.decline.emit();
  }
}

