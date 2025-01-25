import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { combineLatest, map, Observable } from 'rxjs';
import { Message } from '../models/message';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private token = environment.token; // Token obtenido desde environment

  constructor(private firestore: AngularFirestore) {}

  // Enviar un mensaje
  sendMessage(senderId: string, receiverId: string, message: string): void {
    const chatRef = this.firestore.collection('messages');
    chatRef.add({
      senderId: senderId,
      receiverId: receiverId,
      message: message,
      timestamp: new Date(),
      token: this.token // Token añadido
    });
  }

  // Obtener los mensajes entre dos usuarios
  getMessages(senderId: string, receiverId: string): Observable<Message[]> {
    const messagesSent = this.firestore.collection<Message>('messages', ref =>
      ref.where('senderId', '==', senderId)
        .where('receiverId', '==', receiverId)
        .where('token', '==', this.token) // Validar el token en la consulta
        .orderBy('timestamp')
    ).valueChanges();

    const messagesReceived = this.firestore.collection<Message>('messages', ref =>
      ref.where('senderId', '==', receiverId)
        .where('receiverId', '==', senderId)
        .where('token', '==', this.token) // Validar el token en la consulta
        .orderBy('timestamp')
    ).valueChanges();

    return combineLatest([messagesSent, messagesReceived]).pipe(
      map(([sent, received]) => {
        // Asegúrate de que `timestamp` esté definido y puedas hacer la comparación
        return [...sent, ...received].sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
      })
    );
  }

  // Obtener los chats recientes de un usuario
  getRecentUserChats(userId: string, limitResults: number): Observable<any[]> {
    const chatsRef = this.firestore.collection<any>(
      `users/${userId}/chats`,
      ref =>
        ref
          .where('token', '==', this.token) // Validar el token en la consulta
          .orderBy('lastMessageTimestamp', 'desc')
          .limit(limitResults)
    );

    // Escucha los cambios en tiempo real
    return chatsRef.snapshotChanges().pipe(
      map(snapshot =>
        snapshot.map(change => {
          const data = change.payload.doc.data();
          return {
            otherUserId: change.payload.doc.id,
            ...data
          };
        })
      )
    );
  }

  // Actualizar chats de usuario
  async updateUserChats(
    senderId: string,
    lastSenderName: string,
    receiverId: string,
    receiverName: string,
    message: string,
    timestamp: Date
  ): Promise<void> {
    // Referencia al chat del remitente
    const senderChatRef = this.firestore.doc(`users/${senderId}/chats/${receiverId}`);
    await senderChatRef.set(
      {
     //   lastMessage: message,
        lastMessageTimestamp: timestamp,
        lastSenderId: senderId,
        lastSenderName: lastSenderName,
        participants: [
          { id: senderId, name: lastSenderName },
          { id: receiverId, name: receiverName }
        ],
        otherUserName: receiverName,
        token: this.token // Añadir token
      },
      { merge: true }
    );

    // Referencia al chat del receptor
    const receiverChatRef = this.firestore.doc(`users/${receiverId}/chats/${senderId}`);
    await receiverChatRef.set(
      {
    //    lastMessage: message,
        lastMessageTimestamp: timestamp,
        lastSenderId: senderId,
        participants: [
          { id: senderId, name: lastSenderName },
          { id: receiverId, name: receiverName }
        ],
        otherUserName: lastSenderName,
        token: this.token // Añadir token
      },
      { merge: true }
    );
  }

  // Crear o inicializar chats entre usuarios
  async setChats(
    senderId: string,
    receiverId: string,
    receiverName: string,
    senderName: string
  ): Promise<void> {
    // Referencia al chat del remitente
    const senderChatRef = this.firestore.doc(`users/${senderId}/chats/${receiverId}`);
    await senderChatRef.set(
      {
        participants: [
          { id: senderId, name: senderName },
          { id: receiverId, name: receiverName }
        ],
        otherUserName: receiverName,
        token: this.token // Añadir token
      },
      { merge: true }
    );

    // Referencia al chat del receptor
    const receiverChatRef = this.firestore.doc(`users/${receiverId}/chats/${senderId}`);
    await receiverChatRef.set(
      {
        participants: [
          { id: senderId, name: senderName },
          { id: receiverId, name: receiverName }
        ],
        otherUserName: senderName,
        token: this.token // Añadir token
      },
      { merge: true }
    );
  }
}
