import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-edit-photo-modal',
  templateUrl: './edit-photo-modal.component.html',
  styleUrls: ['./edit-photo-modal.component.scss']
})
export class EditPhotoModalComponent {

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  @Input() isOpen: boolean = false; // Control de apertura
  @Input() currentPhoto: string = ''; // Foto actual
  @Input() currentPhotoId: number = 0; // Foto actual

  @Output() close = new EventEmitter<void>(); // Para cerrar el modal
  @Output() updatePhoto = new EventEmitter<File>(); // Emitirá solo el objeto File
  @Output() deletePhoto = new EventEmitter<number>(); // Emitirá solo el objeto File


  defaultPhoto = 'assets/defaultIcons/defaultProfilePhoto.png';
  previewPhoto: string | null = null; // Vista previa de la nueva foto
  selectedFile: File | null = null;


  constructor() {    
  }

///los dos de arriba son los q agregue

  onPhotoUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const file = input.files[0];
      
      // Asignar el archivo seleccionado
      this.selectedFile = file;
  
      // Leer el archivo para vista previa de manera asíncrona
      this.getFilePreview(file);
    }
  }
  
  private getFilePreview(file: File): void {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        this.previewPhoto = e.target?.result as string || null;
        if (this.previewPhoto == null)
          this.previewPhoto =  this.defaultPhoto;

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
    this.close.emit();
  }

  // Confirmar la foto nueva
  submitPhoto(): void {
    if (this.selectedFile) {
      this.updatePhoto.emit(this.selectedFile); // Solo envía el archivo
      this.closeModal();
    }
  }

   deleteActualPhoto(): void {
     if (this.currentPhotoId != 0) {
       this.deletePhoto.emit(this.currentPhotoId); // Solo envía el archivo
       this.closeModal();
     }
   }
}