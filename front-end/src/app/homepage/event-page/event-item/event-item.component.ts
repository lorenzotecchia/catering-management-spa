import { Component } from "@angular/core";
import { Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventItem } from '../../../_services/rest-backend/event-item.type';
import { MarkdownModule } from "ngx-markdown";

@Component({
  selector: 'app-event-item',
  standalone: true,
  imports: [CommonModule, RouterLink, MarkdownModule],
  templateUrl: './event-item.component.html',
  styleUrl: './event-item.component.sass'
})

export class EventItemComponent {

  @Input() event!: EventItem;
  @Output() edit = new EventEmitter<EventItem>();
  @Output() delete = new EventEmitter<EventItem>();
  @Input() isMaitre: boolean = false;  // Make sure this is properly defined

  onDelete() {
    this.delete.emit(this.event);
  }

  onEdit() {
    this.edit.emit(this.event);
  }
}
