export const APP_COLORS = {
  // Color principal de la aplicación (reemplaza al rosa)
  primary: '#10B981',
  
  // Variaciones del color principal
  primaryLight: '#34D399',
  primaryDark: '#059669',
  
  // Colores de estado
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Colores neutros
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
} as const;

// Clases CSS personalizadas para usar en los componentes
export const COLOR_CLASSES = {
  // Texto
  textPrimary: 'text-emerald-500',
  textPrimaryLight: 'text-emerald-400',
  textPrimaryDark: 'text-emerald-600',
  
  // Fondo
  bgPrimary: 'bg-emerald-500',
  bgPrimaryLight: 'bg-emerald-400',
  bgPrimaryDark: 'bg-emerald-600',
  
  // Bordes
  borderPrimary: 'border-emerald-500',
  borderPrimaryLight: 'border-emerald-400',
  borderPrimaryDark: 'border-emerald-600',
  
  // Hover
  hoverBgPrimary: 'hover:bg-emerald-600',
  hoverBgPrimaryLight: 'hover:bg-emerald-500',
  hoverTextPrimary: 'hover:text-emerald-400',
  
  // Focus
  focusRingPrimary: 'focus:ring-emerald-500',
  focusBorderPrimary: 'focus:border-emerald-500',
  
  // Opacidad
  borderPrimaryOpacity20: 'border-emerald-500/20',
  borderPrimaryOpacity30: 'border-emerald-500/30'
} as const;
