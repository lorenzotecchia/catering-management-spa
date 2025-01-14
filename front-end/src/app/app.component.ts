import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { WelcomePageComponent } from './welcomepage/welcomepage.component';
import { EventCreationFormComponent } from './homepage/event-page/event-creation-form/event-creation-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, FooterComponent, NavbarComponent, WelcomePageComponent, EventCreationFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'event-management-app';

  isUserAuthenticated(): boolean {
    return true
  }
}
