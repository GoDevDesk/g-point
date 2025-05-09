import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.scss']
})
export class CreatePostModalComponent {

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  @Input() isOpen: boolean = false; // Control de apertura
  @Output() close = new EventEmitter<void>(); // Para cerrar el modal
  @Output() updatePhoto = new EventEmitter<File>(); // Emitirá solo el objeto File

  defaultPhoto = 'assets/defaultIcons/defaultProfilePhoto.png';

  previewPhoto: string | null = null; // Vista previa de la nueva foto
  selectedFile: File | null = null;
  isLoading = false;

  // Constantes para validación
  readonly MAX_PHOTO_SIZE = 10 * 1024 * 1024; // 10MB para fotos
  readonly MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB para videos
  readonly ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
  readonly ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
  errorMessage: string | null = null;

  constructor() {    
  }

  onPhotoUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const file = input.files[0];
      
      // Determinar si es foto o video
      const isPhoto = this.ALLOWED_PHOTO_TYPES.includes(file.type);
      const isVideo = this.ALLOWED_VIDEO_TYPES.includes(file.type);

      if (!isPhoto && !isVideo) {
        this.errorMessage = 'Solo se permiten archivos JPG, PNG, GIF, MP4, MOV y AVI';
        return;
      }

      // Validar tamaño según el tipo
      const maxSize = isPhoto ? this.MAX_PHOTO_SIZE : this.MAX_VIDEO_SIZE;
      if (file.size > maxSize) {
        const maxSizeMB = isPhoto ? 10 : 100;
        this.errorMessage = `El archivo no debe superar los ${maxSizeMB}MB`;
        return;
      }

      // Si pasa las validaciones, limpiar mensaje de error y continuar
      this.errorMessage = null;
      this.selectedFile = file;
      this.getFilePreview(file);
    }
  }
  
  private getFilePreview(file: File): void {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        this.previewPhoto = e.target?.result as string || null;
        if (this.previewPhoto == null)
          this.previewPhoto = this.defaultPhoto;
      } catch (error) {
        console.error('Error procesando la vista previa', error);
      }
    };
  
    reader.onerror = (error) => {
      console.error('Error en FileReader', error);
    };
  
    reader.readAsDataURL(file);
  }

  // Cerrar el modal
  closeModal(): void {
    this.previewPhoto = null;
    this.selectedFile = null;
    this.errorMessage = null;
    this.close.emit();
  }

  // Confirmar la foto nueva
  submitPhoto(): void {
    if (this.selectedFile) {
      this.updatePhoto.emit(this.selectedFile); // Solo envía el archivo
      this.closeModal();
    }
  }
}