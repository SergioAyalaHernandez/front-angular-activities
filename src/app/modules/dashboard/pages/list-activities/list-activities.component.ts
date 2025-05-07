import {Component} from '@angular/core';
import {ActivityService} from "../../../../services/activity.service";
import {NotificationService} from "../../../../services/notification.service";
import {AuthService} from "../../../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-list-activities',
  templateUrl: './list-activities.component.html',
  styleUrls: ['./list-activities.component.css']
})
export class ListActivitiesComponent {
  activities: any[] = [];
  loading: boolean = true;
  isAdminOrProfessor: boolean = false;
  showDeleteModal: boolean = false;
  activityToDelete: any = null;
  showEditModal: boolean = false;
  editForm: FormGroup;
  activityToEdit: any = null;
  isAdmin = false;


  constructor(
    private listServices: ActivityService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      cupoMaximo: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.checkUserRoles();
    this.loadActivities();
  }

  checkUserRoles(): void {
    const userRole = this.authService.getUserRole();
    this.isAdmin = userRole === 'admin';
    this.isAdminOrProfessor = userRole === 'admin' || userRole === 'profesor';
  }
  loadActivities(): void {this.listServices.obtenerActividades().subscribe(
    (res: any) => {
      this.activities = res;
      this.loading = false;
    },
    (err: any) => {
      this.loading = false;
      this.notificationService.showNotification('Error al obtener actividades', 'error');
    }
  );
  }

  editActivity(activity: any): void {
    this.activityToEdit = activity;
    // @ts-ignore
    this.editForm.patchValue({
      nombre: activity.nombre,
      descripcion: activity.descripcion,
      fechaInicio: activity.fechaInicio,
      fechaFin: activity.fechaFin,
      cupoMaximo: activity.cupoMaximo,
    });
    this.showEditModal = true;
  }

  deleteActivity(activity: any): void {
    this.activityToDelete = activity;
    this.showDeleteModal = true;
  }

  confirmDeleteActivity(): void {
    if (this.activityToDelete) {
      this.listServices.eliminarActividad(this.activityToDelete.id).subscribe(
        () => {
          this.notificationService.showNotification('Actividad eliminada con éxito', 'success');
          window.location.reload();
          this.closeDeleteModal();
        },
        (error) => {
          this.notificationService.showNotification('Error al eliminar la actividad', 'error');
          this.closeDeleteModal();
        }
      );
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.activityToDelete = null;
  }

  confirmEditActivity(): void {
    // @ts-ignore
    if (this.editForm.valid && this.activityToEdit) {
      // @ts-ignore
      const updatedData = this.editForm.value;
      this.listServices.actualizarActividad(this.activityToEdit.id, 'TOKEN', updatedData).subscribe(
        () => {
          this.notificationService.showNotification('Actividad actualizada con éxito', 'success');
          this.loadActivities();
          this.closeEditModal();
        },
        (error) => {
          this.notificationService.showNotification(error.error.error, 'error');
        }
      );
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.activityToEdit = null;
    // @ts-ignore
    this.editForm.reset();
  }

  enrollActivity(activity: any): void {
    // Indicar que está cargando
    this.loading = true;
    const userId = this.authService.getUserId();

    if (!userId) {
      this.notificationService.showNotification('Usuario no autenticado', 'error');
      this.loading = false;
      return;
    }

    // Validar que la actividad tenga un ID válido
    if (!activity || !activity.id) {
      this.notificationService.showNotification('Datos de la actividad incompletos', 'error');
      this.loading = false;
      return;
    }

    this.notificationService.showNotification('Procesando inscripción...', 'info');

    this.authService.getUserById(userId).subscribe({
      next: (response: any) => {
        // Verificar que los datos del usuario sean correctos
        const userData = response.user;
        if (!userData || !userData._id || !userData.email) {
          this.notificationService.showNotification('Datos de usuario incompletos', 'error');
          this.loading = false;
          return;
        }

        this.listServices.registrarUsuarioEnActividad(activity.id, userData._id, userData.email)
          .subscribe({
            next: () => {
              this.notificationService.showNotification('Te has inscrito con éxito', 'success');
              this.loading = false;
              this.loadActivities(); // Refrescar la lista de actividades
            },
            error: (error) => {
              console.error('Error de inscripción:', error);
              let mensaje = 'Error al inscribirse en la actividad';

              if (typeof error.error === 'string') {
                mensaje = error.error;
              }
              else if (error.error && typeof error.error === 'object' && error.error.error) {
                mensaje = error.error.error;
              }
              // Si error.error tiene un campo message
              else if (error?.error?.message) {
                mensaje = error.error.message;
              }

              this.notificationService.showNotification(mensaje, 'error');
              this.loading = false;
            }
          });
      },
      error: (error) => {
        console.error('Error obteniendo datos del usuario:', error);
        this.notificationService.showNotification('Error al obtener información del usuario', 'error');
        this.loading = false;
      }
    });
  }

  checkCreatorPermission(activity: any): boolean {
    const userId = this.authService.getUserId();
    return activity.profesorId === userId;
  }

  showPermissionAlert(): void {
    this.notificationService.showNotification('No tienes permisos para modificar esta actividad. Solo el profesor que la creó puede editarla o eliminarla.', 'warning');
  }

}
