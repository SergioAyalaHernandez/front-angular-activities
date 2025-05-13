import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {NotificationService} from "../../../../services/notification.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;


  constructor(private userService:AuthService,
              private router:Router,
              private formBuilder: FormBuilder,
              private notificationService: NotificationService) {

    this.registerForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      identificacion: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.notificationService.showNotification("Formulario inválido", 'error');
      return;
    }

    const { nombre, email, identificacion, password } = this.registerForm.value;

    this.userService.register({
      nombre,
      email,
      identificacion,
      password,
      rol: 'estudiante'
    }).subscribe({
      next: (res) => {
        this.notificationService.showNotification('Registro exitoso', 'success');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        const errorMsg = error.error?.error || error.message || 'Error desconocido';
        this.notificationService.showNotification(`Error en el registro: ${errorMsg}`, 'error');
      }
    });
  }

}
