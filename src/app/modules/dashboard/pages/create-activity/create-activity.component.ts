import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivityService } from "../../../../services/activity.service";
import {NotificationService} from "../../../../services/notification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.css']
})
export class CreateActivityComponent {

  actividadForm: FormGroup;
  imagenPreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private notificationService: NotificationService,
    private router: Router,
  ) {
    this.actividadForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      cupoMaximo: [''],
      recursos: [''],
      enlace: [''],
      categoria: 'deporte',
      imagen: [null]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.type.startsWith('image/')) {
        this.actividadForm.get('imagen')?.setValue(file);
        this.imagenPreview = URL.createObjectURL(file);
      } else {
        this.actividadForm.get('imagen')?.reset();
        this.imagenPreview = null;
        this.notificationService.showNotification('Solo puedes subir imágenes', 'error');
      }
    }
  }

  onSubmit(): void {
    if (this.actividadForm.valid) {
      const formValues = this.actividadForm.value;
      const imagenFile = formValues.imagen;

      if (!imagenFile) {
        this.notificationService.showNotification('Debe seleccionar una imagen.', 'error');
        return;
      }

      this.activityService.convertirImagenABase64(imagenFile).then(imagenBase64 => {
        const actividadData = {
          nombre: formValues.nombre,
          descripcion: formValues.descripcion,
          fechaInicio: formValues.fechaInicio,
          fechaFin: formValues.fechaFin,
          horaInicio: formValues.horaInicio,
          horaFin: formValues.horaFin,
          cupoMaximo: formValues.cupoMaximo,
          recursos: formValues.recursos,
          enlace: formValues.enlace,
          categoria: "deporte",
          imagen: imagenBase64
        };
        const token = '<TOKEN>';

        this.activityService.crearActividad(
          token,
          actividadData.nombre,
          actividadData.descripcion,
          actividadData.fechaInicio,
          actividadData.fechaFin,
          actividadData.horaInicio,
          actividadData.horaFin,
          actividadData.cupoMaximo,
          actividadData.recursos,
          actividadData.enlace,
          actividadData.categoria,
          imagenFile
        ).subscribe(response => {
          this.notificationService.showNotification('Actividad creada con éxito', 'success');
          this.router.navigate(['/home']);
        }, error => {
          this.notificationService.showNotification('Error al crear la actividad', 'error');
        });

      }).catch(error => {
        this.notificationService.showNotification('Error al convertir la imagen', 'error');
      });
    } else {
      this.notificationService.showNotification('Por favor complete todos los campos requeridos', 'error');
      this.actividadForm.markAllAsTouched();
    }
  }

  eliminarImagen(): void {
    this.imagenPreview = null;
    this.actividadForm.get('imagen')?.reset();

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
