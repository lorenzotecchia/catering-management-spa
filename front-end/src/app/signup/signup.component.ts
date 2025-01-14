import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(RestBackendService);

  submitted = false;

  signupForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(16)
    ])
  });

  doSignUp(): void {
    if (this.signupForm.valid && !this.submitted) {
      this.submitted = true;

      this.restService.signup({
        usr: this.signupForm.value.email as string,
        pwd: this.signupForm.value.password as string
      }).subscribe({
        next: () => {
          this.toastr.success(
            `Registrazione completata!`,
            `Complimenti ${this.signupForm.value.email}!`
          );
          this.router.navigateByUrl("/login");
        },
        error: (error) => {
          this.toastr.error(
            "Il nome utente scelto è già stato utilizzato",
            "Errore nella creazione dell'account"
          );
          this.submitted = false;
        }
      });
    } else if (this.signupForm.invalid) {
      Object.keys(this.signupForm.controls).forEach(key => {
        const control = this.signupForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });

      this.toastr.error("I dati forniti non sono validi!", "Errore nei dati!");
    }
  }
}
