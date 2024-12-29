import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent {
  currentUserLoggedId: string = '';
  senderId: string = '';
  receiverId: string = '';
  recentChats: any[] = [];
  user: any;

  selectedChat: { id: number; name: string; avatar: string; lastMessage: string; otherUserId: string;  otherUserName: string; } = {
    id: 0,
    name: '',
    avatar: '',
    lastMessage: '',
    otherUserId: '',
    otherUserName: 'Ajeno'
  };

  @ViewChild('messageContainer') messageContainer!: ElementRef;
  constructor(private chatService: ChatService, private authService: AuthService) {
    
  }

  // Mensajes del chat
  messages: any[] = [];

  // Contacto seleccionado


  // Nuevo mensaje
  newMessage = '';

  ngOnInit(): void {
    debugger;
    this.currentUserLoggedId = this.authService.getCurrentUserLoggedId().toString();
    this.user = JSON.parse(this.authService.getUserStorage());
    this.getRecentUserChats(this.currentUserLoggedId, 10);
    this.senderId = this.currentUserLoggedId;
    this.loadMessages(); //validar q haya ids antes de hacer esto
  }

  ngAfterViewInit() {
 //   this.scrollToBottom();
  }
  // Método para cargar los mensajes entre los dos usuarios
  loadMessages(): void {
    this.chatService.getMessages(this.senderId, this.receiverId).subscribe((messages: any[]) => {
      this.messages = messages;
      this.scrollToBottom(); // Desplaza el scroll después de cargar mensajes

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

  async getRecentUserChats(userId: string,limitResults: number ){
      try {
        debugger;
        this.chatService.getRecentUserChats(userId, limitResults).subscribe(chats => {
          debugger;
          this.recentChats = chats; // Actualiza la lista de chats en tiempo real
        });
        console.log('Recent chats:', this.recentChats);
      } catch (error) {
        console.error('Error fetching recent chats:', error);
      }
  }

  // Método para seleccionar un contacto
  selectChat(chat: { id: number; name: string; avatar: string; lastMessage: string; otherUserId: string; otherUserName: string }) {
    this.selectedChat = chat;
    this.receiverId = chat.otherUserId;
    this.loadMessages();

  }

  // Método para enviar un mensaje
  async sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.senderId, this.receiverId, this.newMessage);


        this.updateUserChats(this.senderId, this.user.userName, this.receiverId,this.selectedChat.otherUserName, this.newMessage);


   //   this.getRecentUserChats(this.currentUserLoggedId, 10);
      this.newMessage = '';  // Limpiar el campo del mensaje
      this.scrollToBottom(); // Desplaza el scroll después de cargar mensajes
      console.log(this.recentChats);
    }
  }

  async updateUserChats(senderId: string, senderName: string, receiverId:string,receiverName:string, message: string){

    const timestamp = new Date();
    debugger;
    try {
      // Enviar el mensaje a Firestore (puedes usar otra lógica para almacenarlo)
      // Aquí solo actualizamos los chats de usuario como ejemplo
      await this.chatService.updateUserChats(senderId,senderName, receiverId,receiverName, message, timestamp);
  
      console.log('Mensaje enviado y chats actualizados.');
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }

}