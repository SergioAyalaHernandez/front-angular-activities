import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NotificationService} from "../../../../services/notification.service";
import {AuthService} from "../../../../services/auth.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
     if (this.authService.isAuthenticated()) {
       this.router.navigate(['home']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        this.cookieService.set('accessToken', res.access, { secure: true, sameSite: 'Strict' });
        this.cookieService.set('refreshToken', res.refresh, { secure: true, sameSite: 'Strict' });
        this.cookieService.set('id', res.user.id, { secure: true, sameSite: 'Strict' });
        sessionStorage.setItem('userEmail', res.user.email);
        if (res.user?.rol) {
          this.cookieService.set('rol', res.user.rol, { secure: true, sameSite: 'Strict' });
        }
        this.isLoading = false;
        this.notificationService.showNotification('¡Inicio de sesión exitoso!', 'success');
        this.router.navigate(['/home']);

      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.errorMessage = 'Acceso no autorizado. Por favor, verifica tus credenciales.';
          if (error.error === 'Credenciales inválidas') {
            this.errorMessage = 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
          } else if (error.error?.detail) {
            this.errorMessage = error.error.detail;
          }
        } else {
          this.errorMessage = error?.error?.non_field_errors?.[0] ??
            error?.error?.detail ??
            'Error al iniciar sesión. Por favor, intenta nuevamente.';
        }
        this.notificationService.showNotification(this.errorMessage, 'error');
      }
    });

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

}

