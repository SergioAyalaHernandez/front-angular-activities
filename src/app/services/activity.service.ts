import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {from, Observable, switchMap} from "rxjs";

export interface UsuarioRegistrado {
  usuarioId: string;
  correo: string;
  fechaRegistro: string;
}

export interface Actividad {
  id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  horaInicio?: string;
  horaFin?: string;
  cupoMaximo: number;
  recursos: string;
  enlace?: string;
  categoria: string;
  imagen?: {
    data: string;
    contentType: string;
    nombre: string;
  };
  cuposDisponibles: number;
  estado: string;
  creado?: string;
  profesorId?: string | null;
  usuariosRegistrados?: UsuarioRegistrado[];
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private baseUrl = 'http://localhost:8000/api/actividades';

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
    profesorId: string,
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
          profesorId,
          imagen: imagenBase64
        };

        return this.http.post(`${this.baseUrl}/crear/`, actividad);
      })
    );
  }
  obtenerActividades(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.baseUrl}/obtener-actividades/`);
  }

  obtenerActividadPorId(id: string): Observable<Actividad> {
    return this.http.get<Actividad>(`${this.baseUrl}/actividad/${id}/`);
  }

  actualizarActividad(
    id: string,
    actividad: {
      nombre?: string,
      descripcion?: string,
      fechaInicio?: string,
      fechaFin?: string,
      horaInicio?: string,
      horaFin?: string,
      cupoMaximo?: string,
      recursos?: string,
      enlace?: string,
      categoria?: string,
      estado?: string
    },
    imagen?: File
  ): Observable<any> {
    if (imagen) {
      return from(this.convertirImagenABase64(imagen)).pipe(
        switchMap(imagenBase64 => {
          const datosActualizados = {
            ...actividad,
            imagen: imagenBase64
          };
          return this.http.put(`${this.baseUrl}/actividad/${id}/actualizar/`, datosActualizados);
        })
      );
    } else {
      return this.http.put(`${this.baseUrl}/actividad/${id}/actualizar/`, actividad);
    }
  }

  eliminarActividad(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/actividad/${id}/eliminar/`);
  }

  registrarUsuarioEnActividad(actividadId: string, usuarioId: string, correo: string): Observable<any> {
    const datos = { usuarioId, correo };
    return this.http.post(`${this.baseUrl}/actividades/${actividadId}/registrar-usuario/`, datos);
  }

  obtenerUsuariosRegistrados(actividadId: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/actividades/${actividadId}/usuarios-registrados/`
    );
  }

  cancelarRegistroUsuario(actividadId: string, payload: any) {
    return this.http.post<any>(`${this.baseUrl}/actividades/${actividadId}/cancelar-registro/`, payload);
  }

  getActividadesUsuario(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/actividades/usuario/${userId}`);
  }

}
