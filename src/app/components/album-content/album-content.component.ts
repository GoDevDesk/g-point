import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-album-content',
  templateUrl: './album-content.component.html',
  styleUrls: ['./album-content.component.scss']
})
export class AlbumContentComponent  {
  title = 'Título por defecto';
  isEditingTitle = false;
  calculatedInputWidth = 0;

  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;
  @ViewChild('title') titleElement!: ElementRef<HTMLHeadingElement>;

  constructor(private renderer: Renderer2) {}

  hoverAddPhoto = false;

  addPhoto() {
    alert('¡Lógica para agregar una foto!');
  }
  ngAfterViewInit() {
    this.setInputWidth();
  }

  /**
   * Activa el modo de edición y enfoca el input dinámicamente.
   */
  startEditing() {
    this.isEditingTitle = true;

    setTimeout(() => {
      this.setInputWidth();
      this.titleInput?.nativeElement.focus();
    });
  }

  /**
   * Calcula el tamaño dinámico del campo de texto para coincidir con el tamaño real del título visible.
   */
  setInputWidth() {
    const titleEl = document.querySelector('h2');
    if (titleEl) {
      this.calculatedInputWidth = titleEl.offsetWidth;
    }
  }

  /**
   * Guarda el título y sale del modo de edición.
   */
  saveTitle() {
    this.isEditingTitle = false;
  }
}