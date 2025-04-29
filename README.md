# Documentación Técnica

## 1. Introducción

# Descripción General del Proyecto 

## Propósito y Visión
El sistema de gestión de actividades es una plataforma web desarrollada en Angular que permite administrar el ciclo de vida completo de actividades académicas o formativas en un entorno educativo o corporativo. La plataforma facilita la creación, administración, difusión y participación en diversas actividades, siguiendo un modelo de permisos basado en roles.

## Características principales

### Sistema de usuarios y roles
- **Roles diferenciados**: Administradores, profesores y usuarios estándar, cada uno con diferentes niveles de acceso y permisos
- **Perfiles de usuario personalizables**: Cada usuario puede gestionar su información personal
- **Panel de administración de usuarios**: Para la creación y gestión de cuentas (exclusivo para administradores)

### Gestión de actividades
- **Catálogo de actividades**: Listado completo con búsqueda y filtros
- **Creación y edición**: Interfaz intuitiva para profesores y administradores
- **Control de cupos**: Limitación automática de inscripciones
- **Gestión de fechas**: Control de inicio y finalización de actividades
- **Recursos asociados**: Posibilidad de especificar materiales o requisitos necesarios

### Inscripciones
- **Proceso simplificado**: Inscripción con un solo clic para usuarios registrados
- **Validaciones automáticas**: Control de cupos disponibles y requisitos
- **Notificaciones**: Sistema de alertas para confirmaciones y errores
- **Historial de participación**: Registro de actividades en las que el usuario participa

### Interfaz y experiencia de usuario
- **Dashboard personalizado**: Contenido adaptado según el rol del usuario
- **Menú lateral inteligente**: Se adapta a dispositivos móviles y muestra opciones según permisos
- **Formularios con validación**: Control de datos en tiempo real
- **Previsualización de imágenes**: Para actividades con material gráfico
- **Sistema de notificaciones**: Feedback inmediato sobre acciones realizadas

### Seguridad
- **Autenticación robusta**: Sistema de login seguro
- **Protección de rutas**: Acceso controlado según rol del usuario
- **Guards de Angular**: Implementados para protección de componentes sensibles
- **Tokens de autenticación**: Gestión segura de sesiones

### Arquitectura técnica
- **Modular**: Organización por funcionalidades en módulos independientes
- **Reactiva**: Uso de Observables de RxJS para manejo de datos asíncronos
- **Responsive**: Adaptación a diferentes tamaños de pantalla
- **Escalable**: Diseñada para crecer y agregar nuevas funcionalidades

Este sistema proporciona una solución integral para entornos donde se requiere organizar actividades con diferentes niveles de gestión y participación, facilitando tanto la administración como la experiencia del usuario final.


### Tecnologías utilizadas
- **Frontend**: Angular, TypeScript, HTML/CSS
- **Gestión de estado**: Servicios de Angular
- **UI/UX**: CSS Tailwind, componentes responsivos
- **Formularios**: Angular Reactive Forms

## 2 Arquitectura del Sistema

## Patrones de diseño implementados

### Arquitectura por componentes
El proyecto está estructurado siguiendo el patrón de arquitectura por componentes de Angular, organizando la aplicación en unidades funcionales independientes y reutilizables:

- **Componentes de páginas**: Como `CreateActivityComponent` y `ListActivitiesComponent` que implementan vistas completas
- **Componentes de navegación**: Como `AsideComponent` que gestiona el menú lateral adaptativo
- **Componentes modales**: Para confirmación de eliminación y edición de actividades
- **Componentes de formulario**: Para la creación y edición de actividades con validaciones

Esta arquitectura facilita:
- Reutilización de código
- Mantenimiento independiente de cada componente
- Pruebas unitarias aisladas
- División clara de responsabilidades

### Servicios singleton

La aplicación implementa servicios como singletons que centralizan la lógica de negocio y el acceso a datos:

```typescript
// Ejemplo de servicios singleton
@Injectable({
  providedIn: 'root'  // Garantiza una única instancia a nivel de aplicación
})
export class ActivityService {
  // Lógica centralizada para gestión de actividades
}
```

Los principales servicios son:
- **AuthService**: Gestiona autenticación, tokens y roles
- **ActivityService**: Centraliza operaciones CRUD para actividades
- **NotificationService**: Maneja el sistema de notificaciones global

### Patrón observador

Se implementa extensivamente a través de Observables de RxJS:

```typescript
// Ejemplo en ActivityService
obtenerActividades(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/activities`);
}
```

En los componentes:
```typescript
this.listServices.obtenerActividades().subscribe({
  next: (res: any) => {
    this.activities = res;
    this.loading = false;
  },
  error: (err: any) => {
    // Manejo de errores...
  }
});
```

Este patrón permite:
- Manejo asíncrono de datos
- Reactividad a cambios en tiempo real
- Cancelación de suscripciones innecesarias
- Transformación y filtrado de datos

### Control de acceso basado en roles

La arquitectura implementa un sofisticado sistema de control de acceso:

2.1. **Verificación de roles en componentes**:
```typescript
checkUserRoles(): void {
  const userRoles = this.authService.getUserRole();
  this.isAdminOrProfessor = userRoles.includes('admin') || userRoles.includes('profesor');
}
```

2.2. **Filtrado dinámico de elementos de UI**:
```typescript
filterMenuItems(items: MenuItem[]): MenuItem[] {
  return items
    .filter(item => !item.adminOnly || (item.adminOnly && this.isAdmin))
    .map(item => ({
      ...item,
      children: item.children ? this.filterMenuItems(item.children) : undefined
    }));
}
```

2.3. **Guards de ruta para protección**:
  - Impiden navegación a rutas protegidas
  - Redirigen a usuarios sin privilegios
  - Validan tokens antes de permitir acceso

## Flujo de datos en la arquitectura

El sistema sigue un flujo de datos unidireccional:

1. **Servicios**: Realizan peticiones HTTP al backend
2. **Componentes**: Consumen datos de los servicios y manejan la lógica de presentación
3. **Plantillas**: Renderizan los datos procesados por los componentes
4. **Eventos UI**: Capturados por los componentes que actualizan el estado a través de servicios

## Estructura modular

La aplicación está organizada en módulos funcionales:

- **AuthModule**: Componentes y servicios de autenticación
- **DashboardModule**: Estructura principal de la aplicación post-login
- **SharedModule**: Componentes comunes reutilizables
- **CoreModule**: Servicios esenciales y guardias

Esta arquitectura modular facilita la implementación de lazy loading, mejorando el rendimiento inicial de la aplicación.


### Estructura general
La aplicación sigue una estructura modular donde cada funcionalidad está encapsulada en su propio módulo. El módulo principal de dashboard contiene los diferentes componentes y páginas que conforman la interfaz de usuario principal.

# 3. Módulos del Sistema

## 3.1. Módulo de Autenticación

El sistema implementa un mecanismo de autenticación robusto que gestiona el acceso de usuarios según sus roles y permisos asignados. Este módulo es el punto de entrada a la aplicación y garantiza que solo usuarios autorizados puedan acceder a las funcionalidades específicas.

### Componentes principales

#### LoginComponent
Proporciona una interfaz para que los usuarios ingresen sus credenciales:
- Formulario con validación reactiva
- Manejo de errores de autenticación
- Redirección al dashboard según rol del usuario

#### RegisterComponent
Permite la creación de nuevas cuentas (cuando está habilitado):
- Validación de campos obligatorios y formatos
- Verificación de duplicidad de email
- Asignación de rol básico por defecto

### AuthService

Este servicio centraliza toda la lógica de autenticación y autorización:

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;
  private authTokenKey = 'auth_token';
  private userRolesKey = 'user_roles';
  private userIdKey = 'user_id';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  // Inicia sesión y almacena datos de autenticación
  login(credentials: {email: string, password: string}): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          // Almacena token y datos de usuario
          localStorage.setItem(this.authTokenKey, response.token);
          localStorage.setItem(this.userRolesKey, JSON.stringify(response.roles));
          localStorage.setItem(this.userIdKey, response.userId);
          this.currentUser = response.user;
        }),
        catchError(error => {
          console.error('Error de autenticación', error);
          return throwError(() => error);
        })
      );
  }

  // Cierra la sesión del usuario
  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.userRolesKey);
    localStorage.removeItem(this.userIdKey);
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  // Obtiene los roles del usuario actual
  getUserRole(): string[] {
    const rolesStr = localStorage.getItem(this.userRolesKey);
    return rolesStr ? JSON.parse(rolesStr) : [];
  }

  // Verifica si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    const roles = this.getUserRole();
    return roles.includes(role);
  }

  // Obtiene información detallada del usuario
  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/users/${userId}`);
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    return localStorage.getItem(this.authTokenKey) !== null;
  }

  // Obtiene el token para las peticiones autenticadas
  getAuthToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  // Obtiene el ID del usuario actual
  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  // Carga el usuario desde el almacenamiento local
  private loadUserFromStorage(): void {
    if (this.isAuthenticated()) {
      const userId = this.getUserId();
      if (userId) {
        this.getUserById(userId).subscribe({
          next: (response) => this.currentUser = response.user,
          error: () => this.logout()
        });
      }
    }
  }
}
```

### Guards de protección

El módulo implementa varios guards que protegen las rutas de la aplicación:

#### AuthGuard
Protege rutas que requieren autenticación:

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}
```

#### RoleGuard
Protege rutas que requieren roles específicos:

```typescript
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as Array<string>;
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    const userRoles = this.authService.getUserRole();
    const hasAccess = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasAccess) {
      this.router.navigate(['/forbidden']);
      return false;
    }
    
    return true;
  }
}
```

### Interceptor HTTP

Para garantizar que todas las peticiones autenticadas incluyan el token:

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAuthToken();
    
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq);
    }
    
    return next.handle(req);
  }
}
```

### Flujo de autenticación

1. **Inicio de sesión**:
  - Usuario ingresa credenciales
  - Sistema valida contra el backend
  - Se almacena token y roles en localStorage
  - Redirección al dashboard según rol

2. **Verificación de sesión activa**:
  - Guards verifican existencia de token
  - Se comprueba validez del token
  - Se redirige a login si no hay sesión válida

3. **Control de acceso por ruta**:
  - RoleGuard verifica si el usuario tiene los roles necesarios
  - Se deniega acceso a rutas no autorizadas
  - Se muestra página de error 403 (Forbidden)

4. **Cierre de sesión**:
  - Se eliminan datos de sesión del localStorage
  - Se redirecciona al login
  - Se reinicia el estado de la aplicación

### Consideraciones de seguridad

- **Almacenamiento seguro**: Tokens guardados en localStorage con tiempo de expiración
- **HTTPS obligatorio**: Todas las comunicaciones cifradas
- **Tokens JWT**: Con firma digital para verificar integridad
- **Renovación automática**: Sistema de refresh token para sesiones prolongadas
- **Protección XSS**: Sanitización de inputs en formularios de autenticación

El módulo de autenticación proporciona una base sólida para la seguridad de la aplicación, garantizando que cada usuario solo pueda acceder a las funcionalidades permitidas según su rol asignado.

### 3.2. Módulo de Dashboard

#### Componente Aside
Este componente implementa la navegación lateral con las siguientes características:

- **Menú adaptativo**: Se colapsa en dispositivos móviles
- **Navegación dinámica**: Muestra opciones según el rol del usuario
- **Estructura jerárquica**: Menús y submenús expandibles

```typescript
// Estructura del menú
menuItems: MenuItem[] = [
  { icon: 'home', label: 'Inicio', route: '/home' },
  {
    icon: 'user',
    label: 'Usuarios',
    children: [
      { icon: 'profile', label: 'Crear Usuario', route: 'create-user', adminOnly: true },
      // Más opciones...
    ]
  },
  // Más menús...
];
```

### 3.3. Módulo de Actividades

#### ListActivitiesComponent
Este componente maneja:

- Listado de todas las actividades disponibles
- Operaciones CRUD si el usuario es admin o profesor
- Inscripción de usuarios en actividades
- Modales de confirmación para eliminar/editar

```typescript
// Ejemplo de función de inscripción
enrollActivity(activity: any): void {
  // Validación del usuario
  // Proceso de inscripción
  // Notificación del resultado
}
```

#### CreateActivityComponent
Permite a administradores y profesores crear nuevas actividades con:

- Formulario completo con validaciones
- Subida de imágenes con vista previa
- Campos para detallar recursos necesarios

## 4. Servicios Principales

### AuthService
Gestiona la autenticación y autorización:
- Login/logout
- Almacenamiento seguro de tokens
- Obtención de información de usuario
- Verificación de roles

### ActivityService
Maneja las operaciones relacionadas con actividades:
- Obtención de listados
- Creación, edición y eliminación
- Inscripción de usuarios
- Validaciones de cupos y fechas

### NotificationService
Sistema de notificaciones para el usuario:
- Mensajes de éxito/error
- Alertas informativas
- Confirmaciones de acciones

## 5. Flujos de Trabajo Principales

### Inscripción en Actividades
1. Usuario selecciona actividad
2. Sistema verifica disponibilidad de cupo
3. Se registra al usuario en la actividad
4. Se notifica el resultado (éxito/error)

```typescript
// Proceso de inscripción
this.listServices.registrarUsuarioEnActividad(activity.id, userData._id, userData.email)
  .subscribe({
    next: () => {
      this.notificationService.showNotification('Te has inscrito con éxito', 'success');
      // Actualizar vista
    },
    error: (error) => {
      // Manejo de errores específicos
    }
  });
```

### Gestión de Actividades (Admin/Profesor)
1. Listar actividades existentes
2. Opciones para crear/editar/eliminar
3. Formularios con validaciones
4. Confirmación de acciones críticas

## 6. Sistema de Control de Acceso

El sistema implementa un control de acceso basado en roles que:

- Restringe opciones de menú según el rol del usuario
- Impide acciones no autorizadas
- Personaliza la interfaz según permisos

```typescript
// Filtrado de menús según roles
filterMenuItems(items: MenuItem[]): MenuItem[] {
  return items
    .filter(item => !item.adminOnly || (item.adminOnly && this.isAdmin))
    // Procesamiento adicional
}
```

# 7. Componentes UI/UX Extendidos

## 7.1 Modales de confirmación

Los modales de confirmación son elementos críticos del sistema que garantizan que las operaciones irreversibles requieran confirmación explícita del usuario:

### Implementación técnica
```typescript
// En el componente ListActivitiesComponent
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
```

### Características principales
- **Enfoque modal**: Bloquea la interacción con el resto de la interfaz hasta tomar una decisión
- **Contexto claro**: Muestra información detallada sobre qué se va a eliminar/modificar
- **Mensajes específicos**: Comunica claramente las consecuencias de la acción
- **Contraste visual**: Diferenciación clara entre acciones destructivas y cancelación
- **Diseño responsivo**: Adaptación a diferentes tamaños de pantalla

### Tipos de modales implementados
1. **Modal de eliminación**: Para confirmar la eliminación de actividades
2. **Modal de edición**: Formulario emergente para editar actividades
3. **Modal de confirmación de inscripción**: Para confirmar la inscripción en actividades con cupo limitado

## 7.2 Sistema de notificaciones

El sistema de notificaciones proporciona feedback contextual crucial para mantener informado al usuario sobre el resultado de sus acciones:

### Implementación técnica
```typescript
// NotificationService
showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
  const notification = { message, type, id: Date.now() };
  this.notifications.push(notification);
  
  // Auto-ocultar después de un tiempo
  setTimeout(() => {
    this.removeNotification(notification.id);
  }, 5000);
}
```

### Características del sistema
- **Notificaciones temporales**: Aparecen y desaparecen automáticamente después de 5 segundos
- **Codificación por colores**: Verde para éxito, rojo para errores, azul para información, amarillo para advertencias
- **Posicionamiento no intrusivo**: Generalmente en la esquina superior derecha
- **Apilamiento ordenado**: Múltiples notificaciones se organizan secuencialmente
- **Capacidad de descarte**: El usuario puede cerrarlas manualmente

### Tipos de notificaciones
1. **Éxito**: Confirmación de operaciones completadas correctamente
  - Inscripción en actividad exitosa
  - Creación/edición/eliminación de actividades
2. **Error**: Problemas en la ejecución de operaciones
  - Credenciales incorrectas
  - Cupo lleno en actividades
  - Problemas de comunicación con el servidor
3. **Información**: Estados intermedios o neutrales
  - "Procesando inscripción..."
  - "Cargando actividades..."
4. **Advertencia**: Alertas preventivas
  - "La actividad está próxima a completar su cupo"
  - "La sesión expirará pronto"

## 7.3 Vista previa de imágenes

La funcionalidad de vista previa de imágenes mejora significativamente la experiencia al crear o editar actividades:

### Implementación técnica
```html
<div *ngIf="imagenPreview" class="mt-3">
  <p class="text-sm text-gray-600 mb-2">Vista previa:</p>
  <div class="border rounded-lg p-2 bg-gray-50">
    <img [src]="imagenPreview" alt="Vista previa" class="max-w-full max-h-64 mx-auto rounded shadow-sm" />
  </div>
</div>
```

```typescript
// En CreateActivityComponent
onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagenPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  } else {
    this.notificationService.showNotification('Por favor seleccione una imagen válida', 'error');
  }
}

eliminarImagen(): void {
  this.imagenPreview = null;
  // Restablecer campo de archivo
}
```

### Características principales
- **Vista previa instantánea**: Genera una previsualización en tiempo real
- **Validación de tipo**: Acepta solamente formatos de imagen válidos
- **Límites de tamaño**: Establece restricciones para optimizar rendimiento
- **Botón de eliminación**: Permite eliminar la imagen seleccionada
- **Adaptación responsiva**: La imagen se ajusta correctamente en dispositivos móviles

## 7.4 Controles de formulario avanzados

Los formularios del sistema incluyen varios controles avanzados para mejorar la experiencia:

### Datepickers
- Selección visual de fechas para inicio y fin de actividades
- Validación de rangos lógicos (fecha fin posterior a fecha inicio)
- Formato consistente de fechas

### Selectores numéricos
- Para configurar cupos máximos de actividades
- Con validación de números positivos
- Con incremento/decremento mediante botones

### Controles de texto enriquecido
- Para descripciones detalladas de actividades
- Con opciones de formato básico
- Limitación de caracteres con contador visual

## 7.5 Feedback visual de estados

El sistema proporciona indicadores visuales claros para diferentes estados:

### Estados de carga
- Spinners animados durante operaciones asíncronas
- Estados de deshabilitado para botones durante procesamiento
- Mensajes informativos durante operaciones largas

### Indicadores de cupo
- Barras de progreso visual para indicar ocupación de actividades
- Códigos de color según disponibilidad (verde: disponible, amarillo: limitado, rojo: lleno)
- Badges numéricos indicando plazas restantes

### Retroalimentación de formularios
- Mensajes de error en tiempo real
- Indicadores visuales de campos válidos/inválidos
- Deshabilitación de botón de envío hasta validación completa

#   f r o n t - a n g u l a r - a c t i v i t i e s  
 