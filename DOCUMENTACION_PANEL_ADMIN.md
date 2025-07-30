# Panel de Administración - G-Point

## Descripción
El panel de administración es una interfaz exclusiva para administradores del sistema que permite gestionar usuarios, monitorear estadísticas y administrar la aplicación.

## Características Implementadas

### 1. Dashboard Principal
- **Estadísticas en tiempo real:**
  - Total de usuarios registrados
  - Usuarios activos
  - Ingresos totales del sistema

### 2. Gestión de Usuarios
- **Lista completa de usuarios** con información detallada:
  - Foto de perfil
  - Nombre de usuario y ID
  - Email
  - Tipo de suscripción (Gratuito, Premium, VIP)
  - Estado (Activo, Inactivo, Bloqueado)
  - Fecha de registro
  - Última actividad

- **Filtros avanzados:**
  - Búsqueda por nombre de usuario o email
  - Filtro por estado del usuario
  - Filtro por tipo de suscripción

- **Acciones de administrador:**
  - Ver detalles del usuario
  - Editar información del usuario
  - Bloquear/Desbloquear usuarios
  - Eliminar usuarios

- **Paginación** para manejar grandes volúmenes de datos

### 3. Navegación Modular
El panel está organizado en secciones:
- **Gestión de Usuarios** (implementado)
- **Ventas y Suscripciones** (pendiente)
- **Moderación** (pendiente)
- **Análisis** (pendiente)
- **Configuración** (pendiente)

## Seguridad

### Guard de Administración
- **Ruta protegida:** `/admin`
- **Verificación de autenticación:** Verifica que el usuario esté logueado
- **Verificación de permisos:** Confirma que el usuario sea administrador
- **Validación en backend:** Hace llamada al endpoint `/api/user/admin-status`

### Endpoints del Backend Requeridos

#### 1. Verificación de Admin
```
GET /api/user/admin-status
Response: { "isAdmin": boolean }
```

#### 2. Estadísticas del Dashboard
```
GET /api/admin/stats
Response: {
  "totalUsers": number,
  "activeUsers": number,
  "totalRevenue": number,
  "newUsersThisMonth": number,
  "premiumUsers": number
}
```

#### 3. Lista de Usuarios
```
GET /api/admin/users?search=string&status=string&subscriptionType=string&page=number&limit=number
Response: {
  "users": AdminUser[],
  "total": number
}
```

#### 4. Actualizar Estado de Usuario
```
PATCH /api/admin/users/{userId}/status
Body: { "status": "active" | "blocked" }
```

#### 5. Eliminar Usuario
```
DELETE /api/admin/users/{userId}
```

## Estructura de Archivos

```
src/app/
├── components/admin/
│   ├── admin.component.ts
│   ├── admin.component.html
│   └── admin.component.scss
├── guard/
│   └── auth-admin.guard.ts
├── services/
│   └── admin.service.ts
└── app-routing.module.ts (ruta agregada)
```

## Uso

### Acceso al Panel
1. El usuario debe estar autenticado
2. El usuario debe tener permisos de administrador
3. Navegar a `/admin` en la aplicación

### Funcionalidades Disponibles

#### Gestión de Usuarios
1. **Ver lista de usuarios:** Se muestra automáticamente al acceder
2. **Filtrar usuarios:** Usar los filtros en la parte superior
3. **Buscar usuarios:** Escribir en el campo de búsqueda
4. **Acciones:**
   - Click en el ícono de ojo para ver detalles
   - Click en el ícono de editar para modificar
   - Click en el ícono de bloqueo para bloquear/desbloquear
   - Click en el ícono de eliminar para eliminar usuario

#### Navegación
- Usar los botones de navegación para cambiar entre secciones
- La sección activa se resalta visualmente

## Diseño y UX

### Características del Diseño
- **Responsive:** Se adapta a diferentes tamaños de pantalla
- **Moderno:** Gradientes y efectos visuales atractivos
- **Intuitivo:** Iconografía clara y navegación sencilla
- **Profesional:** Colores y tipografía corporativos

### Elementos Visuales
- **Cards de estadísticas** con animaciones hover
- **Tabla de usuarios** con hover effects
- **Badges de estado** con colores distintivos
- **Botones de acción** con iconos descriptivos
- **Paginación** con controles intuitivos

## Próximas Implementaciones

### Sección de Ventas y Suscripciones
- Dashboard de ventas con gráficos
- Lista de transacciones
- Estadísticas de ingresos
- Gestión de planes

### Sección de Moderación
- Reportes de contenido inapropiado
- Gestión de posts reportados
- Sistema de advertencias

### Sección de Análisis
- Métricas de uso
- Análisis de engagement
- Reportes de actividad

### Sección de Configuración
- Configuración de planes
- Gestión de tags
- Configuración del sistema

## Notas Técnicas

### Dependencias
- Angular Material (ya incluidas)
- Font Awesome (para iconos)
- HttpClient (para llamadas API)

### Manejo de Errores
- Los componentes incluyen manejo de errores
- Datos de ejemplo se muestran en caso de error de API
- Alertas informativas para el usuario

### Performance
- Paginación para optimizar carga de datos
- Filtros en tiempo real
- Lazy loading de secciones (pendiente)

## Configuración del Backend

Para que el panel funcione correctamente, el backend debe implementar los siguientes endpoints:

1. **Verificación de permisos de admin**
2. **Estadísticas del sistema**
3. **CRUD de usuarios con filtros**
4. **Gestión de estados de usuario**

## Consideraciones de Seguridad

- **Validación en backend:** Nunca confiar solo en validación del frontend
- **Tokens de autenticación:** Verificar en cada llamada
- **Logs de auditoría:** Registrar todas las acciones de admin
- **Rate limiting:** Proteger endpoints sensibles 