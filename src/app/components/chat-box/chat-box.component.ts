import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {

  // Lista de contactos
  contacts = [
    { id: 17, name: 'Alice', avatar: 'https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato', message: 'Hoorayy!!' },
    { id: 2, name: 'Martin', avatar: 'https://placehold.co/200x/ad922e/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato', message: 'That pizza place was amazing! 🍕' },
    { id: 3, name: 'Charlie', avatar: 'https://placehold.co/200x/2e83ad/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato', message: 'Any good movie recommendations?' },
    // Agrega más contactos según sea necesario
  ];

  // Contacto seleccionado
  selectedContact: any = null;
  receiverId = 0;  // ID del receptor si lo necesitas
  senderId = 17;  // ID del emisor (tu propio ID)


  ngOnInit(): void {
    // Selecciona el primer contacto de la lista al iniciar
    if (this.contacts.length > 0) {
      this.selectedContact = this.contacts[0];  // Asigna el primer contacto
      this.receiverId = this.selectedContact.id;  // Asigna el ID del receptor
      debugger;
    }
  }

  // Método para seleccionar un contacto
  selectContact(contact: any) {
    this.selectedContact = contact;
    this.receiverId = contact.id;  // Asignamos el ID del receptor
  }

  closeChatBox() {
    this.selectedContact = null;  // Cerrar el chat
  }
}
