# Documentación del Proyecto G-Point

## 📋 Descripción General

**G-Point** es una plataforma web desarrollada en Angular 15 que funciona como una red social para creadores de contenido adulto. La aplicación permite a los usuarios crear perfiles, compartir contenido multimedia, gestionar álbumes, interactuar mediante chat y monetizar su contenido a través de suscripciones y donaciones.

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico
- **Frontend**: Angular 15.2.10
- **UI Framework**: Angular Material 15.2.9
- **CSS Framework**: Tailwind CSS 3.4.16
- **Backend**: APIs REST (.NET)
- **Base de Datos**: Firebase Firestore
- **Autenticación**: Firebase Auth + JWT
- **Hosting**: Firebase Hosting
- **Gráficos**: Chart.js con ng2-charts

### Estructura del Proyecto

```
g-point/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes de la UI
│   │   ├── services/           # Servicios de negocio
│   │   ├── models/             # Interfaces y tipos
│   │   ├── guard/              # Guards de autenticación
│   │   ├── interceptors/       # Interceptores HTTP
│   │   └── shared/             # Módulo compartido
│   ├── assets/                 # Recursos estáticos
│   └── environments/           # Configuraciones por ambiente
├── firebase.json              # Configuración de Firebase
└── tailwind.config.js         # Configuración de Tailwind
```

## 🔐 Sistema de Autenticación

### Servicios de Autenticación
- **AuthService**: Maneja login, registro y gestión de sesiones
- **Firebase Auth**: Autenticación con tokens personalizados
- **JWT**: Tokens para autorización en APIs
- **Guards**: Protección de rutas según roles

### Guards Implementados
- `AuthGuard`: Protege rutas que requieren autenticación
- `AuthBuyerGuard`: Verifica acceso a contenido comprado
- `AuthNoLoggedGuard`: Previene acceso a usuarios logueados
- `AuthProfileGuard`: Valida existencia de perfiles
- `AuthReportGuard`: Controla acceso a reportes
- `AuthPurchaseSuscriptionGuard`: Gestiona compras de suscripciones

## 👥 Modelos de Datos Principales

### Usuario y Perfil
```typescript
interface User {
  id: number;
  userName: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
}

interface UserProfile {
  id: number;
  userName?: string;
  emailAddress?: string;
  firstName?: string;
  lastName?: string;
  followersCount?: number;
  followsCount?: number;
  postssCount?: number;
  aboutMe?: string;
  webSite?: string;
  // Redes sociales
  igSocialMedia?: string;
  xSocialMedia?: string;
  fbSocialMedia?: string;
  ytSocialMedia?: string;
  otherSocialMedia?: string;
}
```

### Contenido Multimedia
```typescript
interface Album {
  id: number;
  name: string;
  price: number;
  miniature: string;
  creationDate: Date;
  numberOfPosts: number;
  userId: number;
}

interface Post {
  id: number;
  userId: number;
  albumId: number;
  upload_Date: Date;
  url_File: string;
  description: string;
  contentType: string;
  currentUserData: any;
}

interface PersonalPhoto {
  id: number;
  userId: number;
  upload_Date: Date;
  url_File: string;
}
```

### Monetización
```typescript
interface Plan {
  id: number;
  userId: number;
  productId?: number;
  price: number;
  active: boolean;
}

interface Donation {
  donorName: string;
  message: string;
  amount: number;
  currency: string;
  userId: number;
}
```

## 🎯 Funcionalidades Principales

### 1. Gestión de Usuarios
- **Registro/Login**: Sistema completo de autenticación
- **Perfiles**: Gestión de información personal y redes sociales
- **Fotos de Perfil**: Subida y gestión de avatares y fotos de portada
- **Configuración**: Ajustes de privacidad y etiquetas

### 2. Gestión de Contenido
- **Álbumes**: Creación y gestión de colecciones de contenido
- **Posts**: Subida de fotos y videos con descripciones
- **Fotos Personales**: Galería de contenido personal
- **Etiquetas**: Sistema de categorización de contenido

### 3. Interacción Social
- **Chat**: Sistema de mensajería en tiempo real con Firebase
- **Seguimientos**: Follow/unfollow de usuarios
- **Suscripciones**: Sistema de planes de pago
- **Donaciones**: Sistema de contribuciones monetarias

### 4. Monetización
- **Planes de Suscripción**: Diferentes niveles de contenido premium
- **Venta de Álbumes**: Contenido de pago por álbum
- **Chat Premium**: Mensajería de pago
- **Reportes**: Análisis de ingresos y métricas

### 5. Análisis y Reportes
- **Dashboard**: Métricas de ventas y comunidad
- **Gráficos**: Visualización de datos con Chart.js
- **Ranking**: Sistema de niveles (Bronze, Silver, Gold, Diamond)

## 🔧 Servicios Principales

### AuthService
- Gestión de autenticación y tokens
- Integración con Firebase Auth
- Control de sesiones de usuario

### ProfileService
- Gestión de fotos de perfil
- Subida de archivos multimedia
- Control de avatares

### AlbumService
- CRUD de álbumes
- Verificación de permisos de acceso
- Gestión de contenido multimedia

### ChatService
- Mensajería en tiempo real
- Integración con Firebase Firestore
- Gestión de conversaciones

### PlanService
- Creación y gestión de planes
- Control de suscripciones activas
- Modificación de precios

### UserService
- Gestión de perfiles de usuario
- Información de usuarios externos
- Datos de seguimiento

## 🎨 Componentes de UI

### Componentes Principales
- **HomeComponent**: Página principal con categorías
- **ProfileComponent**: Perfil de usuario con pestañas
- **LoginComponent/RegisterComponent**: Autenticación
- **ChatBoxComponent**: Sistema de mensajería
- **ConfigurationComponent**: Configuración de cuenta
- **ReportComponent**: Dashboard de métricas

### Componentes Modales
- **CreateAlbumModalComponent**: Creación de álbumes
- **CreatePostModalComponent**: Subida de contenido
- **EditPhotoModalComponent**: Edición de fotos
- **CreatePlanModalComponent**: Configuración de planes

### Componentes de Navegación
- **ToolbarComponent**: Barra superior con búsqueda
- **ToolbarFooterComponent**: Navegación inferior
- **GoBackComponent**: Botón de retroceso

## 🌐 Configuración de Entornos

### Desarrollo
```typescript
export const environment = {
  production: false,
  token: 'clave-secreta',
  firebaseConfig: {
    apiKey: "AIzaSyDrSFdvpidAVcSAw0Mt2lxFubuA0LEHcPk",
    authDomain: "chat-6954e.firebaseapp.com",
    projectId: "chat-6954e",
    storageBucket: "chat-6954e.firebasestorage.app",
    messagingSenderId: "259194079279",
    appId: "1:259194079279:web:14108d32015b75e2bc1eda",
    measurementId: "G-5MS5EFD8EY"
  },
  apiPtUsersBaseUrl: 'https://localhost:44335',
  apiPtFilesBaseUrl: 'https://localhost:44306',
};
```

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Construir con watch mode
npm run watch
```

## 🔒 Seguridad

### Autenticación
- JWT tokens para autorización
- Firebase Auth para autenticación
- Guards para protección de rutas
- Interceptor HTTP para tokens automáticos

### Validaciones
- Verificación de permisos de acceso a álbumes
- Control de contenido premium
- Validación de suscripciones activas
- Protección de rutas sensibles

## 📊 Características Técnicas

### Responsive Design
- Diseño adaptativo con Tailwind CSS
- Componentes optimizados para móvil
- Navegación intuitiva

### Performance
- Lazy loading de componentes
- Optimización de imágenes
- Caching de datos
- Paginación de resultados

### UX/UI
- Interfaz moderna y atractiva
- Gradientes y efectos visuales
- Iconografía FontAwesome
- Paleta de colores rosa/gris

## 🎯 Propósito del Proyecto

G-Point es una plataforma completa para creadores de contenido adulto que permite:

1. **Monetización**: Diversas formas de generar ingresos
2. **Comunidad**: Interacción entre creadores y seguidores
3. **Contenido**: Gestión profesional de multimedia
4. **Análisis**: Métricas detalladas de rendimiento
5. **Privacidad**: Control granular de configuraciones

## 🔮 Observaciones y Recomendaciones

### Fortalezas del Proyecto
- Arquitectura bien estructurada con Angular
- Separación clara de responsabilidades
- Sistema de autenticación robusto
- Integración completa con Firebase
- UI moderna y responsive

### Áreas de Mejora
- Implementar testing unitario más extenso
- Optimizar carga de imágenes
- Agregar más validaciones de seguridad
- Mejorar manejo de errores
- Implementar PWA features

### Consideraciones de Seguridad
- Revisar exposición de tokens en environment
- Implementar rate limiting
- Validar inputs del usuario
- Agregar logging de seguridad
- Considerar implementación de 2FA

Este proyecto demuestra una implementación sólida de una plataforma de contenido adulto con características profesionales y una arquitectura escalable. 