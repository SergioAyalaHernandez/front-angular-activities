import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {CookieService} from "ngx-cookie-service";
import {AuthService} from "../services/auth.service";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check if the user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Get the roles required for the route
    const requiredRoles = route.data['roles'] as Array<string>;

    // If no specific roles are required, just being authenticated is enough
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get the user's role from the cookie
    const userRole = this.cookieService.get('rol');

    // Check if the user's role is in the required roles
    if (requiredRoles.includes(userRole)) {
      return true;
    }

    // If the user doesn't have the required role, redirect to unauthorized page
    this.router.navigate(['/unauthorized']);
    return false;
  }
};
