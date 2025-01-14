// rest-backend.service.ts
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthRequest } from './auth-request.type';
import { EventItem } from './event-item.type';
import { NotificationItem } from './notification-item';
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

  getUnreadNotificationsCount(): Observable<number> {
    const url = `${this.url}/notification/unread/count`;
    return this.http.get<number>(url, this.getAuthHeaders()).pipe(
      catchError(error => {
        console.error('Error getting unread notifications count:', error);
        return of(0); // Return 0 in case of error
      })
    );
  }

  getNotifications(): Observable<NotificationItem[]> {
    const url = `${this.url}/notification`;
    return this.http.get<NotificationItem[]>(url, this.getAuthHeaders()).pipe(
      tap(notifications => console.log('Fetched notifications:', notifications)),
      catchError(error => {
        console.error('Error fetching notifications:', error);
        return throwError(() => error);
      })
    );
  }

  createNotification(notification: Partial<NotificationItem>): Observable<NotificationItem> {
    const url = `${this.url}/notification`;
    console.log('Creating notification:', notification);
    return this.http.post<NotificationItem>(url, notification, this.getAuthHeaders()).pipe(
      tap(created => console.log('Created notification:', created)),
      catchError(error => {
        console.error('Error creating notification:', error);
        return throwError(() => error);
      })
    );
  }


  markNotificationAsRead(id: number): Observable<NotificationItem> {
    const url = `${this.url}/notification/${id}/read`;
    return this.http.patch<NotificationItem>(url, {}, this.getAuthHeaders()).pipe(
      catchError(error => {
        console.error('Error marking notification as read:', error);
        return throwError(() => error);
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

  // rest-backend.service.ts
  // rest-backend.service.ts
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

  getNotificationById(id: number): Observable<NotificationItem> {
    const url = `${this.url}/notification/${id}`;
    return this.http.get<NotificationItem>(url, this.httpOptions);
  }

  markAllNotificationsAsRead(): Observable<void> {
    const url = `${this.url}/notification/read-all`;
    return this.http.patch<void>(url, {}, this.httpOptions);
  }

  deleteNotification(id: number): Observable<void> {
    const url = `${this.url}/notification/${id}`;
    return this.http.delete<void>(url, this.httpOptions);
  }



}


