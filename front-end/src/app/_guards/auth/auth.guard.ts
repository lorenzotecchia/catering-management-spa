import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../_services/auth/auth.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const router = inject(Router);

  if (authService.isUserAuthenticated()) {
    return true;
  } else {
    toastr.warning("Please, login to access this feature", "Unauthorized!", {
      timeOut: 4000,
      progressBar: true,
    });
    return router.parseUrl("/login");
  }
};


export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const router = inject(Router);

  // First check if user is authenticated
  if (!authService.isUserAuthenticated()) {
    toastr.warning("Please, login to access this feature", "Unauthorized!", {
      timeOut: 4000,
      progressBar: true,
    });
    return router.parseUrl("/login");
  }

  // Then check if user has one of the required roles
  const requiredRoles = route.data['roles'] as string[];
  const userRole = localStorage.getItem('userRole');

  if (userRole && requiredRoles.includes(userRole)) {
    return true;
  } else {
    toastr.error("You don't have permission to access this feature", "Access Denied!", {
      timeOut: 4000,
      progressBar: true,
    });
    return router.parseUrl("/events");
  }
};
