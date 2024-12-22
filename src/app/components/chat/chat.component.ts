import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
   messages: any[] = [];
  // senderId: string = 'user1'; // ID del usuario actual
  // receiverId: string = 'user2'; // ID del receptor
   newMessage: string = '';
   currentUserLoggedId: string = '';
   @Input() senderId!: string; // ID del usuario actual
  @Input() receiverId!: string; // ID del receptor
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el chat

  // @Output() close = new EventEmitter<void>(); // Emite cuando se cierra el chat

  constructor(private chatService: ChatService, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUserLoggedId = this.authService.CurrentUserLoggedId.toString();
    this.loadMessages();
  }

    // Método para cargar los mensajes entre los dos usuarios
    loadMessages(): void {
      debugger;
      this.chatService.getMessages(this.senderId, this.receiverId).subscribe((messages: any[]) => {
        this.messages = messages;
      });
    }

  // messages = [
  //   { sender: 'User1', text: 'Hola, ¿cómo estás?' },
  //   { sender: 'User2', text: 'Todo bien, ¿y tú?' },
  // ];
  // newMessage = '';

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.senderId, this.receiverId, this.newMessage);
      this.newMessage = '';  // Limpiar el campo del mensaje
    }
  }

  closeChat() {
    this.close.emit();
  }
}
