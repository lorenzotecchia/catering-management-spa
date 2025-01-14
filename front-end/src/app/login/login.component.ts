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
    console.log('LoginComponent initialized'); // Add this
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    console.log('LoginComponent initialized in ngOnInit');
  } doLogin(): void {
    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const loginRequest = {
        usr: this.loginForm.get('email')?.value,
        pwd: this.loginForm.get('password')?.value
      };

      console.log('Sending login request:', loginRequest); // Debug log

      this.restService.login(loginRequest).subscribe({
        next: (response) => {
          console.log('Login response:', response); // Debug log
          localStorage.setItem('token', response.token);
          localStorage.setItem('userRole', response.role);
          this.toastr.success('Login successful');
          this.router.navigate(['/events']);
        },
        error: (error) => {
          console.error('Login error:', error); // Debug log
          this.toastr.error('Invalid credentials');
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }
  //  doLogin(): void {
  //    if (this.loginForm.valid && !this.isSubmitting) {
  //      this.isSubmitting = true;
  //
  //      const loginRequest = {
  //        usr: this.loginForm.get('email')?.value,
  //        pwd: this.loginForm.get('password')?.value
  //      };
  //
  //      this.restService.login(loginRequest).subscribe({
  //        next: (token: string) => {
  //          localStorage.setItem('token', token);
  //          // Make sure to set the role after login
  //          localStorage.setItem('userRole', 'maitre'); // or get this from your backend
  //          this.toastr.success('Login successful');
  //          this.router.navigate(['/events']);
  //        },
  //        error: (error) => {
  //          this.toastr.error('Invalid credentials');
  //          this.isSubmitting = false;
  //        }
  //      });
  //    }
  //  }
}
