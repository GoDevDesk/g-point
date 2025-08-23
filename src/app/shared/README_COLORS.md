# Sistema de Colores Centralizado - G-Point

## Descripción
Este sistema centraliza todos los colores de la aplicación en un solo lugar, facilitando el mantenimiento y la consistencia visual.

## Archivos de Configuración

### 1. `colors.config.ts`
Contiene las constantes de colores y las clases CSS recomendadas.

```typescript
import { APP_COLORS, COLOR_CLASSES } from './shared/colors.config';

// Usar colores directamente
const primaryColor = APP_COLORS.primary; // '#10B981'

// Usar clases recomendadas
const buttonClass = COLOR_CLASSES.bgPrimary; // 'bg-emerald-500'
```

### 2. `color-utils.ts`
Utilidades para manejar colores y migración.

```typescript
import { ColorUtils } from './shared/color-utils';

// Obtener color principal
const primary = ColorUtils.getPrimaryColor();

// Reemplazar colores pink por emerald
const updatedContent = ColorUtils.replacePinkWithEmerald(htmlContent);
```

## Colores Principales

| Propiedad | Valor | Descripción |
|-----------|-------|-------------|
| `primary` | `#10B981` | Color principal de la app |
| `primaryLight` | `#34D399` | Variación clara |
| `primaryDark` | `#059669` | Variación oscura |

## Clases CSS Recomendadas

### Texto
- `text-emerald-500` - Texto principal
- `text-emerald-400` - Texto secundario
- `text-emerald-600` - Texto destacado

### Fondo
- `bg-emerald-500` - Fondo principal
- `bg-emerald-400` - Fondo secundario
- `bg-emerald-600` - Fondo hover

### Bordes
- `border-emerald-500` - Borde principal
- `border-emerald-500/20` - Borde con opacidad 20%
- `border-emerald-500/30` - Borde con opacidad 30%

## Migración de Colores

### Antes (Pink)
```html
<button class="bg-pink-500 text-white hover:bg-pink-600">
  Botón
</button>
```

### Después (Emerald)
```html
<button class="bg-emerald-500 text-white hover:bg-emerald-600">
  Botón
</button>
```

## Uso en Componentes

### 1. Importar configuración
```typescript
import { APP_COLORS, COLOR_CLASSES } from '../shared/colors.config';
```

### 2. Usar en templates
```html
<div class="bg-emerald-500 text-white">
  Contenido
</div>
```

### 3. Usar en estilos
```scss
.my-component {
  background-color: var(--app-primary);
  border-color: var(--app-primary-light);
}
```

## Variables CSS

Las variables CSS están disponibles globalmente:

```css
:root {
  --app-primary: #10B981;
  --app-primary-light: #34D399;
  --app-primary-dark: #059669;
}
```

## Beneficios

1. **Consistencia**: Todos los componentes usan los mismos colores
2. **Mantenibilidad**: Cambios de color en un solo lugar
3. **Escalabilidad**: Fácil agregar nuevos colores
4. **Reutilización**: Clases CSS reutilizables
5. **Accesibilidad**: Colores contrastantes y accesibles

## Notas Importantes

- **NO usar** colores pink directamente en nuevos componentes
- **SÍ usar** las clases emerald o las constantes de `APP_COLORS`
- **Siempre** importar desde `colors.config.ts` para nuevos colores
- **Mantener** consistencia en toda la aplicación
