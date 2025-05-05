import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Actividad, ActivityService} from '../../../../services/activity.service';
import {NotificationService} from '../../../../services/notification.service';
import {AuthService} from "../../../../services/auth.service";

interface Usuario {
  usuarioId: string;
  correo: string;
  fechaRegistro: Date;
}

interface UsuariosInscritos {
  cupoMaximo: number;
  cuposDisponibles: number;
  estado: string;
  usuarios: Usuario[];
}

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.css']
})
export class ActivityDetailComponent implements OnInit {
  actividadId: string = '';
  actividad: Actividad | null = null;
  loading: boolean = true;
  error: string | null = null;
  mostrarModal = false;
  escalaImagen = 1;
  isAdmin = false;
  // @ts-ignore
  history = window.history;

  usuarioInscrito = false;

  mostrarModalUsuarios = false;
  loadingUsuarios = false;
  usuariosInscritos: UsuariosInscritos | null = null;

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private notificationService: NotificationService,
    protected authServices: AuthService
  ) {
  }

  ngOnInit(): void {
    this.checkAdminStatus();
    this.route.params.subscribe(params => {
      this.actividadId = params['id'];
      this.cargarActividad();
    });
  }

  cargarActividad(): void {

    if (this.actividadId) {
      this.loading = true;
      this.activityService.obtenerActividadPorId(this.actividadId).subscribe({
        next: (data) => {
          this.actividad = data;
          this.loading = false;
          this.notificationService.showNotification('Actividad cargada con éxito', 'success');
        },
        error: (err) => {
          this.error = 'Error al cargar la actividad';
          this.loading = false;
          this.notificationService.showNotification('Error al cargar la actividad', 'error');
        }
      });
    }
  }

  checkAdminStatus(): void {
    const userRole = this.authServices.getUserRole();
    this.isAdmin = userRole === 'admin' || userRole === 'profesor';
  }

  cambiarEscalaConDobleClick() {
    if (this.escalaImagen === 1) {
      this.escalaImagen = 1.5;
    } else if (this.escalaImagen === 1.5) {
      this.escalaImagen = 2;
    } else {
      this.escalaImagen = 1;
    }
  }

  mostrarUsuariosInscritos(): void {
    this.mostrarModalUsuarios = true;
    this.loadingUsuarios = true;

    if (!this.actividad || !this.actividad.id) {
      this.loadingUsuarios = false;
      return;
    }

    this.activityService.obtenerUsuariosRegistrados(this.actividad.id).subscribe({
      next: (data) => {
        this.usuariosInscritos = data;
        this.loadingUsuarios = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios inscritos:', err);
        this.loadingUsuarios = false;
      }
    });
  }

  cerrarModalUsuarios(): void {
    this.mostrarModalUsuarios = false;
  }


  inscribirseEnActividad(): void {
    if (this.actividad) {
      const usuarioId = this.authServices.getUserId();
      const correo = this.authServices.getMail();

      this.activityService.registrarUsuarioEnActividad(
        this.actividad.id,
        usuarioId,
        correo
      ).subscribe({
        next: (response) => {
          this.usuarioInscrito = true;

          // @ts-ignore
          this.actividad.cuposDisponibles--;
          this.notificationService.showNotification("Inscripción exitosa", 'success');
        },
        error: (err: any) => {
          const errorMessage = typeof err.error === 'object' ? err.error.error : err.error;
          this.notificationService.showNotification(errorMessage || 'Error desconocido', 'error');
        }
      });
    }
  }

}
