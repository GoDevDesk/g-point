import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService, PremiumContentPaymentRequest, PremiumContentPaymentResponse } from 'src/app/services/chat.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {
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
  isLoading = false;
  showSidebar = true;

  selectedChat: { id: number; name: string; avatar: string; lastMessage: string; otherUserId: string; otherUserName: string; } = {
    id: 0,
    name: '',
    avatar: '',
    lastMessage: '',
    otherUserId: '',
    otherUserName: 'Seleccione un chat'
  };

  @ViewChild('messageContainer') messageContainer!: ElementRef;
  constructor(private chatService: ChatService, private authService: AuthService, private profileService: ProfileService) {}

  messages: any[] = [];
  newMessage = '';
  chatNotes: { [key: string]: string } = {};
  editingNote: { chatId: string, isEditing: boolean } = { chatId: '', isEditing: false };

  // Propiedades para contenido premium
  showPremiumContentModal = false;
  uploadProgress = 0;
  userGallery: any[] = [];
  contentType: 'url' | 'gallery' | 'upload' = 'url';
  premiumContentMessage = {
    title: '',
    price: '',
    thumbnailUrl: '',
    paymentLink: '',
    contentLink: '',
    file: null as File | null,
    galleryItem: null as any,
    isPaid: false
  };

  ngOnInit(): void {
    this.isLoading = true;
    this.currentUserLoggedId = this.authService.getCurrentUserLoggedIdFromStorage().toString();
    this.user = JSON.parse(this.authService.getUserStorage());
    this.senderId = this.currentUserLoggedId;

    // Cargar chats recientes
    this.getRecentUserChats(this.currentUserLoggedId, 10);

    // Cargar avatar del usuario actual
    this.profileService.getAvatarPhoto().subscribe(photoUrl => {
      this.currentAvatarPhoto = photoUrl;
    });

    // Mock de notas usando los chats reales
    this.chatService.getRecentUserChats(this.currentUserLoggedId, 10).subscribe(chats => {
      // Agregar notas mockeadas solo a los primeros 3 chats
      chats.slice(0, 3).forEach((chat, index) => {
        const mockNotes = [
          'Cliente VIP - Interesado en contenido premium',
          'Preguntar por el pago pendiente',
          'Solicitó contenido personalizado'
        ];
        if (chat.otherUserId) {
          this.chatNotes[chat.otherUserId] = mockNotes[index];
        }
      });
    });
  }

  loadMessages(): void {
    const receiverId = this.selectedChat.otherUserId;
    if (!receiverId) return;

    this.chatService.getMessages(this.senderId, receiverId).subscribe((messages: any[]) => {
      if (this.selectedChat.otherUserId === receiverId) {
        this.messages = messages;
        
        if (messages.length > 0) {
          this.selectedChat.lastMessage = messages[messages.length - 1].message;
        } else {
          this.selectedChat.lastMessage = '';
        }
        this.isLoading = false;
        this.scrollToBottom();
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
      this.chatService.getRecentUserChats(userId, limitResults).subscribe(async chats => {
        // Crear un array para almacenar las promesas de carga de fotos
        const chatsWithPhotos = await Promise.all(chats.map(async (chat) => {
          try {
            // Obtener la foto de perfil usando el ProfileService
            const photoData = await this.profileService.getProfilePhoto(Number(chat.otherUserId)).toPromise();
            chat.avatar = photoData?.url_File || this.defaultPhoto;
          } catch (error) {
            console.error(`Error al cargar foto de perfil para usuario ${chat.otherUserId}:`, error);
            chat.avatar = this.defaultPhoto;
          }
          return chat;
        }));

        // Actualizar la lista de chats con las fotos cargadas
        this.recentChats = chatsWithPhotos;
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
      // Verificar si es un mensaje premium
      let lastMessage = message;
      try {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'premium_content') {
          // Mantener el mensaje premium como JSON para preservar toda la información
          lastMessage = message;
        }
      } catch {
        // Si no es JSON, usar el mensaje original
      }

      // Actualizar los chats con el mensaje
      await this.chatService.updateUserChats(senderId, senderName, receiverId, receiverName, lastMessage, timestamp);

    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }

  // Método para obtener el mensaje formateado para mostrar en los chats recientes
  getFormattedLastMessage(message: string): string {
    try {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.type === 'premium_content') {
        return `🎬 Contenido Premium: ${parsedMessage.content.title} - $${parsedMessage.content.price}`;
      }
    } catch {
      // Si no es JSON o no es contenido premium, devolver el mensaje original
    }
    return message;
  }

  // Método para verificar si debe mostrar un separador de fecha
  shouldShowDateSeparator(currentMessage: any, previousMessage: any): boolean {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.timestamp.seconds * 1000);
    const prevDate = new Date(previousMessage.timestamp.seconds * 1000);
    
    return currentDate.toDateString() !== prevDate.toDateString();
  }

  // Método para formatear la fecha del mensaje
  getMessageDate(message: any): string {
    const date = new Date(message.timestamp.seconds * 1000);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    }
  }

  // Método para mostrar/ocultar el sidebar
  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
    // Si estamos cerrando el sidebar, también cerramos el input de notas
    if (!this.showSidebar) {
      this.cancelEditingNote();
    }
  }

  // Método para seleccionar chat y cerrar sidebar en móvil
  selectChatAndCloseSidebar(otherUserId: string): void {
    this.selectChatById(otherUserId);
    
    // En móvil, cierra el sidebar automáticamente
    if (window.innerWidth < 768) {
      this.showSidebar = false;
      // También cerramos el input de notas al cerrar el sidebar
      this.cancelEditingNote();
    }
  }

  // Método para agregar/editar una nota
  addOrEditNote(chatId: string, note: string): void {
    this.chatNotes[chatId] = note;
    this.editingNote = { chatId: '', isEditing: false };
  }

  // Método para iniciar la edición de una nota
  startEditingNote(chatId: string): void {
    this.editingNote = { chatId, isEditing: true };
  }

  // Método para cancelar la edición de una nota
  cancelEditingNote(): void {
    this.editingNote = { chatId: '', isEditing: false };
  }

  // Método para obtener la nota de un chat
  getNoteForChat(chatId: string): string {
    return this.chatNotes[chatId] || '';
  }

  // Método para calcular la posición del formulario de notas
  getNoteInputPosition(chatId: string): number {
    const chatElement = document.querySelector(`[data-chat-id="${chatId}"]`);
    if (chatElement) {
      const rect = chatElement.getBoundingClientRect();
      // Posicionar el formulario justo debajo del chat
      return rect.bottom + window.scrollY;
    }
    // Fallback a una posición por defecto si no se encuentra el elemento
    return 100;
  }

  // Métodos para manejar mensajes premium
  isPremiumContent(message: any): boolean {
    try {
      const content = JSON.parse(message.message);
      return content.type === 'premium_content';
    } catch {
      return false;
    }
  }

  getPremiumContentThumbnail(message: any): string {
    try {
      const content = JSON.parse(message.message);
      return content.content.thumbnailUrl || this.defaultPhoto;
    } catch {
      return this.defaultPhoto;
    }
  }

  isPremiumContentPaid(message: any): boolean {
    try {
      const content = JSON.parse(message.message);
      return content.content.isPaid || false;
    } catch {
      return false;
    }
  }

  getPremiumContentPrice(message: any): string {
    try {
      const content = JSON.parse(message.message);
      return content.content.price || '0';
    } catch {
      return '0';
    }
  }

  getPremiumContentTitle(message: any): string {
    try {
      const content = JSON.parse(message.message);
      return content.content.title || 'Contenido Premium';
    } catch {
      return 'Contenido Premium';
    }
  }

  getPremiumContentPaymentLink(message: any): string {
    try {
      const content = JSON.parse(message.message);
      return content.content.paymentLink || '#';
    } catch {
      return '#';
    }
  }

  getPremiumContentLink(message: any): string {
    try {
      const content = JSON.parse(message.message);
      return content.content.contentLink || '#';
    } catch {
      return '#';
    }
  }

  // Métodos para manejar contenido premium
  openPremiumContentModal(): void {
    this.showPremiumContentModal = true;
    this.contentType = 'url';
    this.loadUserGallery();
    this.resetPremiumContentForm();
  }

  closePremiumContentModal(): void {
    this.showPremiumContentModal = false;
    this.contentType = 'url';
    this.resetPremiumContentForm();
  }

  resetPremiumContentForm(): void {
    this.premiumContentMessage = {
      title: '',
      price: '',
      thumbnailUrl: '',
      paymentLink: '',
      contentLink: '',
      file: null,
      galleryItem: null,
      isPaid: false
    };
    this.uploadProgress = 0;
  }

  changeContentType(type: 'url' | 'gallery' | 'upload'): void {
    this.contentType = type;
    // Resetear solo los campos específicos del contenido
    this.premiumContentMessage.contentLink = '';
    this.premiumContentMessage.file = null;
    this.premiumContentMessage.galleryItem = null;
    this.premiumContentMessage.thumbnailUrl = '';
    this.uploadProgress = 0;
  }

  async loadUserGallery(): Promise<void> {
    try {
      // Aquí deberías implementar la llamada al servicio para obtener la galería del usuario
      // Por ahora usamos datos de ejemplo
      this.userGallery = [
        {
          id: 1,
          title: 'Video 1',
          thumbnailUrl: this.defaultPhoto,
          url: 'https://ejemplo.com/video1.mp4'
        },
        {
          id: 2,
          title: 'Video 2',
          thumbnailUrl: this.defaultPhoto,
          url: 'https://ejemplo.com/video2.mp4'
        }
      ];
    } catch (error) {
      console.error('Error al cargar la galería:', error);
    }
  }

  selectFromGallery(item: any): void {
    this.premiumContentMessage.galleryItem = item;
    // Asegurarnos de que la miniatura se establezca correctamente
    this.premiumContentMessage.thumbnailUrl = item.thumbnailUrl || this.defaultPhoto;
    this.premiumContentMessage.contentLink = item.url;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.premiumContentMessage.file = file;
      
      // Crear una miniatura del video
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        // Tomar un frame del video como miniatura
        video.currentTime = 1; // Intentar tomar un frame a 1 segundo
      };
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          this.premiumContentMessage.thumbnailUrl = canvas.toDataURL('image/jpeg');
        }
      };
      video.src = URL.createObjectURL(file);

      // Simular subida de archivo
      this.uploadProgress = 0;
      const interval = setInterval(() => {
        this.uploadProgress += 10;
        if (this.uploadProgress >= 100) {
          clearInterval(interval);
        }
      }, 200);
    }
  }

  validatePremiumContent(): boolean {
    if (!this.premiumContentMessage.title || !this.premiumContentMessage.price) {
      return false;
    }

    switch (this.contentType) {
      case 'url':
        return !!this.premiumContentMessage.contentLink;
      case 'gallery':
        return !!this.premiumContentMessage.galleryItem;
      case 'upload':
        return !!this.premiumContentMessage.file;
      default:
        return false;
    }
  }

  async sendPremiumContent(): Promise<void> {
    if (!this.validatePremiumContent()) {
      return;
    }

    try {
      let thumbnailUrl = this.premiumContentMessage.thumbnailUrl;
      let contentLink = this.premiumContentMessage.contentLink;

      // Preparar la URL del contenido y la miniatura según el tipo
      switch (this.contentType) {
        case 'gallery':
          if (this.premiumContentMessage.galleryItem) {
            contentLink = this.premiumContentMessage.galleryItem.url;
            thumbnailUrl = this.premiumContentMessage.galleryItem.thumbnailUrl || this.defaultPhoto;
          }
          break;
        case 'upload':
          if (this.premiumContentMessage.file) {
            // Simulamos la subida del archivo y obtención de URLs
            // TODO: Reemplazar con la implementación real del backend
            contentLink = URL.createObjectURL(this.premiumContentMessage.file);
            thumbnailUrl = this.premiumContentMessage.thumbnailUrl || this.defaultPhoto;
          }
          break;
        case 'url':
          thumbnailUrl = this.premiumContentMessage.thumbnailUrl || this.defaultPhoto;
          break;
      }

      // Asegurarnos de tener una miniatura válida
      thumbnailUrl = thumbnailUrl || this.defaultPhoto;

      // TODO: Reemplazar con la llamada real al backend
      // Simulamos la respuesta del backend
      const mockPaymentResponse: PremiumContentPaymentResponse = {
        paymentId: `payment_${Date.now()}`,
        paymentLink: `https://payment.example.com/pay/${Date.now()}`,
        contentLink: contentLink,
        thumbnailUrl: thumbnailUrl
      };

      // Creamos el mensaje premium con la respuesta maquetada
      const premiumMessage = {
        type: 'premium_content',
        content: {
          title: this.premiumContentMessage.title,
          price: this.premiumContentMessage.price,
          thumbnailUrl: mockPaymentResponse.thumbnailUrl,
          paymentLink: mockPaymentResponse.paymentLink,
          contentLink: mockPaymentResponse.contentLink,
          isPaid: false,
          paymentId: mockPaymentResponse.paymentId
        }
      };

      // TODO: Reemplazar con la implementación real del backend
      // Simulamos el envío del mensaje
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulamos delay de red

      // Enviar el mensaje (esto sí es real)
      await this.chatService.sendMessage(
        this.senderId,
        this.receiverId,
        JSON.stringify(premiumMessage)
      );

      // Actualizar los chats (esto sí es real)
      await this.updateUserChats(
        this.senderId,
        this.user.userName,
        this.receiverId,
        this.selectedChat.otherUserName,
        JSON.stringify(premiumMessage)
      );

      this.closePremiumContentModal();
    } catch (error) {
      console.error('Error al enviar contenido premium:', error);
      // TODO: Implementar manejo de errores real
      alert('Error al enviar el contenido premium. Por favor, intente nuevamente.');
    }
  }
}