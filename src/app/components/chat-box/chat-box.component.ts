import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent {
  // @Input() currentUserId!: string;
  // @Input() otherUserId!: string;
  // @Input() otherUserName!: string;

  currentUserLoggedId: string = '';
  senderId: string = '';
  receiverId: string = '';
  recentChats: any[] = [];
  user: any;
  defaultPhoto = 'assets/defaultIcons/defaultProfilePhoto.png';
  currentAvatarPhoto = this.defaultPhoto;
  isLoading = false; // Simula la carga inicial

  selectedChat: { id: number; name: string; avatar: string; lastMessage: string; otherUserId: string; otherUserName: string; } = {
    id: 0,
    name: '',
    avatar: '',
    lastMessage: '',
    otherUserId: '',
    otherUserName: 'Seleccione un chat'
  };

  @ViewChild('messageContainer') messageContainer!: ElementRef;
  constructor(private chatService: ChatService, private authService: AuthService, private profileService: ProfileService) {

  }

  // Mensajes del chat
  messages: any[] = [];

  // Contacto seleccionado
  otherUserId!: string;
  otherUserName!: string;

  // Nuevo mensaje
  newMessage = '';

  ngOnInit(): void {
    this.isLoading = true;
    this.currentUserLoggedId = this.authService.getCurrentUserLoggedIdFromStorage().toString();
    this.user = JSON.parse(this.authService.getUserStorage());  ///este no es el mismo de arriba??

    // Obtener datos del estado de navegación
    const state = history.state;

    this.otherUserId = state.otherUserId || ''; // ID del usuario actual
    this.otherUserName = state.otherUserName || ''; // Nombre del otro usuario

    this.getRecentUserChats(this.currentUserLoggedId, 10);

    if (this.otherUserId || this.otherUserName) {
      this.createNewChat(this.otherUserName, this.otherUserId,);
    }

    this.profileService.getAvatarPhoto().subscribe(photoUrl => {
      this.currentAvatarPhoto = photoUrl;
    });

    this.senderId = this.currentUserLoggedId;
    this.loadMessages(); //validar q haya ids antes de hacer esto
  }

  loadMessages(): void {
    const receiverId = this.selectedChat.otherUserId; // Usamos `selectedChat` para obtener el `receiverId`

    // Verifica que el `receiverId` esté correctamente definido
    if (!receiverId) {
      return;
    }

    this.chatService.getMessages(this.senderId, receiverId).subscribe((messages: any[]) => {
      // Verifica que los mensajes solo se asignen si el `receiverId` sigue siendo el mismo
      if (this.selectedChat.otherUserId === receiverId) {
        this.messages = messages;

        // Si hay mensajes, asigna el último mensaje
        if (messages.length > 0) {
          this.selectedChat.lastMessage = messages[messages.length - 1].message;
        } else {
          this.selectedChat.lastMessage = ''; // Si no hay mensajes, establece un valor vacío
        }
        this.isLoading = false;
        this.scrollToBottom(); // Desplaza el scroll después de cargar los mensajes
      } else {
        this.isLoading = false;
      }
    });
  }

  scrollToBottom(): void {
    if (this.messageContainer) {
      try {
        setTimeout(() => {
          this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
        }, 50);
      } catch (err) {
        console.error('Error al desplazar el scroll:', err);
      }
    }
  }

  async getRecentUserChats(userId: string, limitResults: number) {
    try {
      this.chatService.getRecentUserChats(userId, limitResults).subscribe(chats => {
        chats.forEach(newChat => {
          const newOtherUserId = newChat.otherUserId; // Obtiene el otherUserId del nuevo chat

          if (!newChat.avatar || newChat.avatar.trim() === "") {
            newChat.avatar = this.defaultPhoto;
          }

          const existingIndex = this.recentChats.findIndex(existingChat => {
            return existingChat.otherUserId === newOtherUserId; // Compara por otherUserId
          });

          if (existingIndex !== -1) {
            // Reemplaza el chat existente con el mismo otherUserId
            this.recentChats[existingIndex] = newChat;
          } else {
            // Agrega el nuevo chat si no existe
            this.recentChats.push(newChat);
          }
        });
        this.isLoading = false;
      });
    } catch (error) {
      this.isLoading = false;
      console.error('Error fetching recent chats:', error);
    }
  }

  sortRecentChatsByTimestamp(): void {
    // Ordena colocando el chat más reciente al inicio de la lista
    this.recentChats.sort((a, b) => {
      const timestampA = a.lastMessageTimestamp.seconds * 1000 + a.lastMessageTimestamp.nanoseconds / 1000000;
      const timestampB = b.lastMessageTimestamp.seconds * 1000 + b.lastMessageTimestamp.nanoseconds / 1000000;
      return timestampB - timestampA; // Ordena en orden descendente
    });

    // Reasignación para garantizar detección de cambios en Angular
    this.recentChats = [...this.recentChats];
  }

  //abrir una nueva conversacion
  createNewChat(UserNameForChat: String, otherUserId: string) {
    var newChat = {
      lastMessage: '',
      lastSenderId: '',
      lastSenderName: '',
      otherUserId: otherUserId,
      otherUserName: UserNameForChat
    }
    this.recentChats.push(newChat)
    this.selectChatById(otherUserId);
  }

  // Método para seleccionar un contacto solo con el ID del chat
  selectChatById(otherUserId: string): void {
    // Busca el chat en recentChats por su id
    const chat = this.recentChats.find(c => c.otherUserId === otherUserId);

    if (chat) {
      this.selectedChat = chat; // Asigna el chat seleccionado
      this.receiverId = chat.otherUserId; // Actualiza el ID del receptor
      this.loadMessages(); // Carga los mensajes para este chat
    } else {
      console.error(`Chat con id ${otherUserId} no encontrado.`);
    }
  }

  // Método para enviar un mensaje
  async sendMessage() {
    if (this.newMessage.trim()) {
      // Enviar el mensaje al servidor
      this.chatService.sendMessage(this.senderId, this.receiverId, this.newMessage);

      // Actualizar el timestamp localmente
      const timestamp = new Date();
      const updatedTimestamp = {
        seconds: Math.floor(timestamp.getTime() / 1000),
        nanoseconds: (timestamp.getTime() % 1000) * 1000000
      };

      // Actualiza el chat correspondiente en recentChats
      const chatIndex = this.recentChats.findIndex(chat => chat.otherUserId === this.receiverId);
      if (chatIndex !== -1) {
        this.recentChats[chatIndex].lastMessage = this.newMessage;
        this.recentChats[chatIndex].lastMessageTimestamp = updatedTimestamp;
      }
      await this.updateUserChats(
        this.senderId,
        this.user.userName,
        this.receiverId,
        this.selectedChat.otherUserName,
        this.newMessage
      );


      // Ordena los chats inmediatamente
      this.sortRecentChatsByTimestamp();
      this.newMessage = '';
    }
  }

  async updateUserChats(senderId: string, senderName: string, receiverId: string, receiverName: string, message: string) {

    const timestamp = new Date();
    try {
      // Enviar el mensaje a Firestore (puedes usar otra lógica para almacenarlo)
      // Aquí solo actualizamos los chats de usuario como ejemplo
      await this.chatService.updateUserChats(senderId, senderName, receiverId, receiverName, message, timestamp);

    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }
}