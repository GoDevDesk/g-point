/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // Colores personalizados que reemplazan los rosas
        'app-primary': '#10B981',
        'app-primary-light': '#34D399',
        'app-primary-dark': '#059669',
        
        // Sobrescribir colores pink de Tailwind para usar nuestros colores
        pink: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Color principal de la app
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        }
      }
    },
  },
  plugins: [],
}