import { APP_COLORS, COLOR_CLASSES } from './colors.config';

/**
 * Utilidades para manejar colores de manera centralizada
 */
export class ColorUtils {
  
  /**
   * Obtiene el color principal de la aplicación
   */
  static getPrimaryColor(): string {
    return APP_COLORS.primary;
  }

  /**
   * Obtiene variaciones del color principal
   */
  static getPrimaryVariants() {
    return {
      light: APP_COLORS.primaryLight,
      dark: APP_COLORS.primaryDark
    };
  }

  /**
   * Mapeo de colores pink a emerald para migración
   */
  static readonly COLOR_MAPPING = {
    // Clases de Tailwind
    'emerald-50': 'emerald-50',
    'emerald-100': 'emerald-100',
    'emerald-200': 'emerald-200',
    'emerald-300': 'emerald-300',
    'emerald-400': 'emerald-400',
    'emerald-500': 'emerald-500',
    'emerald-600': 'emerald-600',
    'emerald-700': 'emerald-700',
    'emerald-800': 'emerald-800',
    'emerald-900': 'emerald-900',
    
    // Clases personalizadas
    'text-emerald-500': 'text-emerald-500',
    'bg-emerald-500': 'bg-emerald-500',
    'border-emerald-500': 'border-emerald-500',
    'hover:bg-emerald-600': 'hover:bg-emerald-600',
    'focus:ring-emerald-500': 'focus:ring-emerald-500',
    'focus:border-emerald-500': 'focus:border-emerald-500',
    
    // Opacidades
    'border-emerald-500/20': 'border-emerald-500/20',
    'border-emerald-500/30': 'border-emerald-500/30',
    
    // Hover states
    'hover:text-emerald-400': 'hover:text-emerald-400',
    'hover:bg-emerald-700': 'hover:bg-emerald-700'
  };

  /**
   * Reemplaza todas las clases de color pink por emerald en un string
   */
  static replacePinkWithEmerald(content: string): string {
    let result = content;
    
    Object.entries(this.COLOR_MAPPING).forEach(([pinkClass, emeraldClass]) => {
      const regex = new RegExp(pinkClass, 'g');
      result = result.replace(regex, emeraldClass);
    });
    
    return result;
  }

  /**
   * Obtiene las clases CSS recomendadas para usar en componentes
   */
  static getRecommendedClasses() {
    return COLOR_CLASSES;
  }

  /**
   * Valida si un color es válido
   */
  static isValidColor(color: string): boolean {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color);
  }
}
