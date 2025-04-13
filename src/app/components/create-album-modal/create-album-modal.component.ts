import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-album-modal',
  templateUrl: './create-album-modal.component.html',
  styleUrls: ['./create-album-modal.component.scss']
})
export class CreateAlbumModalComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() createAlbum = new EventEmitter<{ name: string, price: number }>();

  albumForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.albumForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit() {
    if (this.albumForm.valid) {
      this.createAlbum.emit({
        name: this.albumForm.get('name')?.value,
        price: this.albumForm.get('price')?.value
      });
      this.closeModal();
    }
  }

  closeModal() {
    this.albumForm.reset();
    this.close.emit();
  }
}
