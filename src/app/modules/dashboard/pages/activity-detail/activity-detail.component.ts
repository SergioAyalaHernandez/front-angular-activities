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
  mostrarModalConfirmacion = false;
  usuarioAEliminar: string | null = null;

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
          this.verificarUsuarioInscrito();
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
  verificarUsuarioInscrito(): void {
    if (this.actividad && this.actividad.usuariosRegistrados && this.actividad.usuariosRegistrados.length > 0) {
      const usuarioId = this.authServices.getUserId();
      this.usuarioInscrito = this.actividad.usuariosRegistrados.some((usuario: any) => usuario.usuarioId === usuarioId);
    } else {
      this.usuarioInscrito = false;
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

  checkCreatorPermission(activity: any): boolean {
    const userId = this.authServices.getUserId();
    return activity.profesorId === userId;
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

  cancelarRegistroUsuario(usuarioId: string): void {
    // En lugar de usar confirm(), mostramos un modal personalizado
    this.usuarioAEliminar = usuarioId;
    this.mostrarModalConfirmacion = true;
  }

  confirmarEliminacion(): void {
    if (!this.usuarioAEliminar) return;

    this.loading = true;

    const payload = {
      usuarioId: this.usuarioAEliminar
    };

    this.activityService.cancelarRegistroUsuario(this.actividadId, payload)
      .subscribe({
        next: (response) => {
          this.notificationService.showNotification('Usuario eliminado correctamente', 'success');

          // Actualizar los datos
          if (this.usuariosInscritos) {
            this.usuariosInscritos.cuposDisponibles = response.cuposRestantes;
            this.usuariosInscritos.usuarios = this.usuariosInscritos.usuarios.filter(
              usuario => usuario.usuarioId !== this.usuarioAEliminar
            );

            // Actualizar estado si es necesario
            if (this.usuariosInscritos.estado === 'completo' && response.cuposRestantes > 0) {
              this.usuariosInscritos.estado = 'abierto';
            }

            // Actualizar también la actividad principal
            if (this.actividad) {
              this.actividad.cuposDisponibles = response.cuposRestantes;
              this.actividad.estado = this.usuariosInscritos.estado;
            }
          }

          this.loading = false;
          window.location.reload();
          this.cerrarModalConfirmacion();
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          let mensaje = 'Error al eliminar usuario de la actividad';

          if (typeof error.error === 'string') {
            mensaje = error.error;
          } else if (error.error && error.error.error) {
            mensaje = error.error.error;
          }

          this.notificationService.showNotification(mensaje, 'error');
          this.loading = false;
          this.cerrarModalConfirmacion();
        }
      });
  }

  cerrarModalConfirmacion(): void {
    this.mostrarModalConfirmacion = false;
    this.usuarioAEliminar = null;
  }

}
