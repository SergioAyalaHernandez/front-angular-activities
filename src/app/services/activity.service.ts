import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable, from, switchMap} from "rxjs";

export interface Actividad {
  id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
  cupoMaximo: string;
  recursos: string;
  enlace: string;
  categoria: string;
  imagen?: {
    data: string;
    contentType: string;
    nombre: string;
  };
  cuposDisponibles: number;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private apiUrl = 'http://127.0.0.1:8000/api/actividades/crear/';
  private apiUrlActividades = 'http://localhost:8000/api/actividades/obtener-actividades/';

  constructor(private http: HttpClient) { }

  convertirImagenABase64(imagen: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string); // Resultado en base64
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(imagen);
    });
  }

  crearActividad(
    token: string,
    nombre: string,
    descripcion: string,
    fechaInicio: string,
    fechaFin: string,
    horaInicio: string,
    horaFin: string,
    cupoMaximo: string,
    recursos: string,
    enlace: string,
    categoria: string,
    imagen: File
  ): Observable<any> {

    return from(this.convertirImagenABase64(imagen)).pipe(
      switchMap(imagenBase64 => {
        const actividad = {
          nombre,
          descripcion,
          fechaInicio,
          fechaFin,
          horaInicio,
          horaFin,
          cupoMaximo,
          recursos,
          enlace,
          categoria,
          imagen: imagenBase64
        };

        return this.http.post(this.apiUrl, actividad, );
      })
    );
  }
  obtenerActividades(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(this.apiUrlActividades);
  }

  obtenerActividadPorId(id: string): Observable<Actividad> {
    return this.http.get<Actividad>(`http://localhost:8000/api/actividades/actividad/${id}/`);
  }

  actualizarActividad(
    id: string,
    token: string,
    actividad: Partial<Actividad>,
    imagen?: File
  ): Observable<any> {
    if (imagen) {
      return from(this.convertirImagenABase64(imagen)).pipe(
        switchMap(imagenBase64 => {
          const datosActualizados = {
            ...actividad,
            imagen: imagenBase64
          };

          return this.http.put(`http://localhost:8000/api/actividades/actividad/${id}/actualizar/`, datosActualizados);
        })
      );
    } else {


      return this.http.put(`http://localhost:8000/api/actividades/actividad/${id}/actualizar/`, actividad);
    }
  }

  eliminarActividad(id: string): Observable<any> {
    return this.http.delete(`http://localhost:8000/api/actividades/actividad/${id}/eliminar/`);
  }

  registrarUsuarioEnActividad(actividadId: string, usuarioId: string, correo: string): Observable<any> {
    const datos = { usuarioId, correo };
    return this.http.post(
      `http://localhost:8000/api/actividades/actividades/${actividadId}/registrar-usuario/`,
      datos,
    );
  }

  obtenerUsuariosRegistrados(actividadId: string): Observable<any> {
    return this.http.get(
      `http://localhost:8000/api/actividades/actividades/${actividadId}/usuarios-registrados/`
    );
  }

}
