import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthRequest } from './auth-request.type';
import { EventItem } from './event-item.type';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class RestBackendService {
  url = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    console.log('Current token:', token); // Debug log
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getEventsCount(): Observable<number> {
    return this.getEvents().pipe(
      map(events => events.length),
      catchError(error => {
        console.error('Error getting events count:', error);
        return of(0);
      })
    );
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error?.message || error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }


  login(loginRequest: AuthRequest): Observable<any> {
    const url = `${this.url}/auth`;
    return this.http.post<any>(url, loginRequest).pipe(
      map(response => {
        if (!response || !response.token) {
          throw new Error('Invalid response from server');
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }


  signup(signupRequest: AuthRequest) {
    const url = `${this.url}/signup`;
    console.log(signupRequest);
    return this.http.post(url, signupRequest, this.httpOptions);
  }

  getEvents(): Observable<EventItem[]> {
    const url = `${this.url}/event/`;
    return this.http.get<{ success: boolean, data: EventItem[] }>(url).pipe(
      map(response => {
        if (!response.success || !Array.isArray(response.data)) {
          throw new Error('Invalid response format');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  getWaiters(): Observable<AuthRequest[]> {
    const url = `${this.url}/users/waiters`;
    return this.http.get<AuthRequest[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching waiters:', error);
        return throwError(() => new Error('Failed to fetch waiters'));
      })
    );
  }

  getEventById(id: number): Observable<EventItem> {
    const url = `${this.url}/event/${id}`;
    return this.http.get<{ success: boolean, data: EventItem }>(url).pipe(
      map(response => {
        console.log('Raw response from server:', response);
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  createEvent(event: EventItem): Observable<EventItem> {
    console.log('Creating event with data:', event); // Add this log
    return this.http.post<EventItem>(`${this.url}/event/`, event, this.httpOptions).pipe(
      tap(response => console.log('Server response:', response)), // Add this log
      catchError(this.handleError)
    );
  }


  update(eventItem: EventItem): Observable<EventItem> {
    const url = `${this.url}/event/${eventItem.id}`;
    console.log('Update request headers:', this.getAuthHeaders()); // Debug log
    console.log('Update request data:', eventItem); // Debug log

    return this.http.put<EventItem>(url, eventItem, this.getAuthHeaders()).pipe(
      tap(response => console.log('Update response:', response)),
      catchError(error => {
        console.error('Update error:', error);
        return throwError(() => error);
      })
    );
  }

  delete(eventItem: EventItem) {
    const url = `${this.url}/event/${eventItem.id}`;
    console.log('Deleting event:', eventItem);
    return this.http.delete<{ success: boolean, message: string }>(url, this.httpOptions).pipe(
      tap(response => console.log('Delete response:', response))
    );
  }
}


