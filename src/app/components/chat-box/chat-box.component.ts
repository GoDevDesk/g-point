import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('messageContainer') messageContainer!: ElementRef;
  constructor(private chatService: ChatService, private authService: AuthService) {
    
  }
  // Lista de contactos
  contacts = [
    {
      id: 18,
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/48',
      lastMessage: 'Hey! How are you?'
    },
    {
      id: 17,
      name: 'Jane Smith',
      avatar: 'https://via.placeholder.com/48',
      lastMessage: 'Are we still on for tomorrow?'
    },
    {
      id: 3,
      name: 'Alex Johnson',
      avatar: 'https://via.placeholder.com/48',
      lastMessage: 'I’ll call you later.'
    }
  ];

  // Mensajes del chat
  messages: any[] = [];

  // Contacto seleccionado
  selectedContact: { id: number; name: string; avatar: string; lastMessage: string } | null = null;

  // Nuevo mensaje
  newMessage = '';

  ngOnInit(): void {
    debugger;
    this.currentUserLoggedId = this.authService.getCurrentUserLoggedId().toString();
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
        this.recentChats = await this.chatService.getRecentUserChats(userId, limitResults);
        console.log('Recent chats:', this.recentChats);
      } catch (error) {
        console.error('Error fetching recent chats:', error);
      }
  }


  // scrollToBottom(): void {
  //   if (this.messageContainer) {
  //     //  this.cdr.detectChanges();
  //     setTimeout(() => {
  //       this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
  //     }, 50);
  //   }
  // }

  // Método para seleccionar un contacto
  selectContact(contact: { id: number; name: string; avatar: string; lastMessage: string }) {
    debugger;
    this.selectedContact = contact;
    this.receiverId = contact.id.toString();
    this.loadMessages();

    // Ejemplo: cargar mensajes de este contacto (simulado)
    this.messages = [
      {
        content: 'Hello!',
        isOutgoing: false,
        avatar: this.selectedContact?.avatar || 'https://via.placeholder.com/48',
      },
      {
        content: 'Hi! How are you?',
        isOutgoing: true,
        avatar: 'https://via.placeholder.com/48', // Tu avatar
      },
    ];
  }

  // Método para enviar un mensaje
  async sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.senderId, this.receiverId, this.newMessage);
      this.updateUserChats(this.senderId, this.receiverId, this.newMessage);
      this.getRecentUserChats(this.currentUserLoggedId, 10);
      this.newMessage = '';  // Limpiar el campo del mensaje
      this.scrollToBottom(); // Desplaza el scroll después de cargar mensajes
      console.log(this.recentChats);
    }
  }

  async updateUserChats(senderId: string, receiverId:string, message: string){

    const timestamp = new Date();

    try {
      // Enviar el mensaje a Firestore (puedes usar otra lógica para almacenarlo)
      // Aquí solo actualizamos los chats de usuario como ejemplo
      await this.chatService.updateUserChats(senderId, receiverId, message, timestamp);
  
      console.log('Mensaje enviado y chats actualizados.');
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }

}