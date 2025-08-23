import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Exportar utilidades de colores para uso en toda la aplicación
export { APP_COLORS, COLOR_CLASSES } from './colors.config';
export { ColorUtils } from './color-utils';

@NgModule({
  declarations: [
  ],
  exports: [
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
