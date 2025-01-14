import { Component } from "@angular/core";
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EventItem } from '../../_services/rest-backend/event-item.type';
import { RestBackendService } from '../../_services/rest-backend/rest-backend.service';
import { EventItemComponent } from './event-item/event-item.component';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'event-page',
  standalone: true,
  imports: [CommonModule, RouterLink, EventItemComponent],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.sass'
})

export class EventPageComponent implements OnInit {
  events: EventItem[] = [];
  isMaitre: boolean = false;

  constructor(
    private restService: RestBackendService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Check user role from localStorage
    const userRole = localStorage.getItem('userRole');
    console.log("Current user role:", userRole);
    this.isMaitre = userRole === 'maitre';
  }

  ngOnInit() {
    this.loadEvents();
  }

  // Load all events from the backend
  loadEvents() {
    this.restService.getEvents().subscribe({
      next: (events) => {
        console.log('Loaded events:', events); // Log the loaded events
        console.log('Type of events:', typeof events); // Log the type of events
        if (Array.isArray(events)) {
          console.log('Events is an array');
        } else {
          console.error('Events is not an array');
        }
        this.events = events;
        this.toastr.success('Events loaded successfully');
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.toastr.error('Failed to load events');
      }
    });
  }

  // Navigate to create event form
  navigateToCreate() {
    //if (this.isMaitre) {
    //  this.router.navigate(['/events/create']);
    //} else {
    //  this.toastr.warning('Only maitre can create events');
    //}
    this.router.navigate(['/events/create']);
  }

  // Handle edit event
  onEditEvent(event: EventItem) {
    if (this.isMaitre) {
      this.router.navigate(['/events', event.id, 'edit']);
    } else {
      this.toastr.warning('Only maitre can edit events');
    }
  }

  // Handle delete event
  // event-page.component.ts
  onDeleteEvent(event: EventItem) {
    if (!this.isMaitre) {
      this.toastr.warning('Only maitre can delete events');
      return;
    }
    if (confirm('Are you sure you want to delete this event?')) {
      this.restService.delete(event).subscribe({
        next: (response) => {
          // Remove the event from the local array immediately after successful deletion
          this.events = this.events.filter(e => e.id !== event.id);
          this.toastr.success('Event deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          this.toastr.error('Failed to delete event: ' + error.message);
        }
      });
    }
  }
}
