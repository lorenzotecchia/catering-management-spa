import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private restService: RestBackendService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  } doLogin(): void {
    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const loginRequest = {
        usr: this.loginForm.get('email')?.value,
        pwd: this.loginForm.get('password')?.value
      };


      this.restService.login(loginRequest).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userRole', response.role);
          this.toastr.success('Login successful');
          this.router.navigate(['/events']);
        },
        error: (error) => {
          this.toastr.error('Invalid credentials');
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }
}
