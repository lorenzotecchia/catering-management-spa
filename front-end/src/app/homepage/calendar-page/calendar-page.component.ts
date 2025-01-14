import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { RestBackendService } from '../../_services/rest-backend/rest-backend.service';
import { EventItem } from '../../_services/rest-backend/event-item.type';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.sass'
})
export class CalendarPageComponent implements OnInit {
  events: EventItem[] = [];
  selectedEvent: EventItem | null = null;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventDisplay: 'auto',
    displayEventTime: true,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false
    },
    height: 'auto',
    dayMaxEvents: true,
    weekends: true,
    fixedWeekCount: false,
    showNonCurrentDates: true
  };

  constructor(
    private restService: RestBackendService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.restService.getEvents().subscribe({
      next: (events) => {
        this.events = events;

        if (events.length > 0) {
          this.toastr.info(
            `You have ${events.length} event${events.length > 1 ? 's' : ''} scheduled`,
            'Your Events'
          );
        }

        this.calendarOptions.events = events.map(event => ({
          title: event.eventName,
          start: new Date(event.eventDate),
          backgroundColor: '#3547b9',
          borderColor: '#3547b9',
          textColor: '#ffffff',
          extendedProps: { event }
        }));
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.toastr.error('Failed to load events');
      }
    });
  }

  handleEventClick(arg: any) {
    this.selectedEvent = arg.event.extendedProps.event;
  }
}
