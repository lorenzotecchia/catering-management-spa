import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthRequest } from '../../../_services/rest-backend/auth-request.type';
import { EventItem } from '../../../_services/rest-backend/event-item.type';
import { RestBackendService } from '../../../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';
import { FormArray } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-event-creation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MarkdownModule],
  templateUrl: './event-creation-form.component.html',
  styleUrl: './event-creation-form.component.sass'
})

export class EventCreationFormComponent implements OnInit {
  eventForm!: FormGroup;
  isSubmitting = false;
  eventId?: number;
  isEditing = false;
  waiters: AuthRequest[] = [];

  get eventName() { return this.eventForm.get('eventName'); }
  get eventDate() { return this.eventForm.get('eventDate'); }
  get eventLocation() { return this.eventForm.get('eventLocation'); }
  get numberOfParticipants() { return this.eventForm.get('numberOfParticipants'); }
  get eventDescription() { return this.eventForm.get('eventDescription'); }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private restService: RestBackendService,
    private toastr: ToastrService
  ) {
    this.initForm();
  }

  private initForm() {
    this.eventForm = this.fb.group({
      eventName: ['', [Validators.required, Validators.minLength(3)]],
      eventDate: ['', [Validators.required, this.futureDateValidator()]],
      numberOfParticipants: ['', [Validators.required, Validators.min(1)]],
      eventLocation: ['', [Validators.required, Validators.minLength(3)]],
      eventDescription: ['', [Validators.maxLength(500)]],
      selectedWaiters: this.fb.array([])
    });
  }

  get selectedWaitersFormArray() {
    return this.eventForm.get('selectedWaiters') as FormArray;
  }

  ngOnInit() {
    this.loadWaiters();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.eventId = +params['id'];
        this.isEditing = true;
        this.loadEventData(this.eventId);
      }
    });
  }

  private loadWaiters() {
    this.restService.getWaiters().subscribe({
      next: (waiters) => {
        this.waiters = waiters;
        console.log('Loaded waiters:', waiters);
      },
      error: (error) => {
        console.error('Error loading waiters:', error);
        this.toastr.error('Failed to load waiters');
      }
    });
  }

  loadEventData(id: number) {
    this.restService.getEventById(id).subscribe({
      next: (event) => {
        console.log('Original event data:', event);

        let dateToSet = '';
        if (event.eventDate) {
          const eventDate = new Date(event.eventDate);
          dateToSet = eventDate.toISOString().slice(0, 16);
        }

        this.eventForm.patchValue({
          eventName: event.eventName,
          eventDate: dateToSet,
          eventLocation: event.eventLocation,
          numberOfParticipants: event.numberOfParticipants,
          eventDescription: event.eventDescription || ''
        });

        const selectedWaiters = event.Users?.map(user => user.usr) || [];
        this.eventForm.patchValue({
          selectedWaiters: selectedWaiters
        });
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.toastr.error('Failed to load event data');
        this.router.navigate(['/events']);
      }
    });
  }

  onWaiterSelectionChange(event: any, waiterUsername: string) {
    const formArray = this.selectedWaitersFormArray;
    if (event.target.checked) {
      formArray.push(this.fb.control(waiterUsername));
    } else {
      const index = formArray.controls.findIndex(control => control.value === waiterUsername);
      if (index >= 0) {
        formArray.removeAt(index);
      }
    }
  }

  onSubmit(): void {
    if (this.eventForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const selectedWaiters = this.eventForm.get('selectedWaiters')?.value || [];
      console.log('Selected waiters:', selectedWaiters);

      const eventData: EventItem = {
        id: this.eventId,
        eventName: this.eventForm.get('eventName')?.value,
        eventDate: new Date(this.eventForm.get('eventDate')?.value),
        eventLocation: this.eventForm.get('eventLocation')?.value,
        numberOfParticipants: this.eventForm.get('numberOfParticipants')?.value,
        eventDescription: this.eventForm.get('eventDescription')?.value,
        Users: selectedWaiters.map((usr: string) => ({
          usr,
          pwd: '',
          role: 'waiter'
        }))
      };

      const request = this.isEditing ?
        this.restService.update(eventData) :
        this.restService.createEvent(eventData);

      request.subscribe({
        next: (savedEvent) => {
          // Show success message for event creation/update
          this.toastr.success(
            this.isEditing ? 'Event updated successfully' : 'Event created successfully'
          );

          // Show assignment notifications for waiters
          if (selectedWaiters.length > 0) {
            const action = this.isEditing ? 'updated' : 'created';
            selectedWaiters.forEach((waiterUsername: string) => {
              this.toastr.info(
                `Waiter ${waiterUsername} has been assigned to the ${action} event "${eventData.eventName}"`,
                'Waiter Assignment'
              );
            });
          }

          this.router.navigate(['/events']);
        },
        error: (error) => {
          console.error('Error saving event:', error);
          this.toastr.error(
            this.isEditing ? 'Failed to update event' : 'Failed to create event'
          );
          this.isSubmitting = false;
        }
      });
    }
  }

  futureDateValidator() {
    return (control: any) => {
      if (control.value) {
        const selectedDate = new Date(control.value);
        if (selectedDate <= new Date()) {
          return { futureDate: true };
        }
      }
      return null;
    };
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

  isWaiterSelected(waiterUsername: string): boolean {
    return this.selectedWaitersFormArray.controls
      .some(control => control.value === waiterUsername);
  }
}
