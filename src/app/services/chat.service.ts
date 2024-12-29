import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { combineLatest, firstValueFrom, map, Observable } from 'rxjs';
import { Message } from '../models/message';
import { User } from '../models/user';
import { ChatData } from '../models/chatData';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private firestore: AngularFirestore) { }

  // Enviar un mensaje
  sendMessage(senderId: string, receiverId: string, message: string): void {
    const chatRef = this.firestore.collection('messages');
    chatRef.add({
      senderId: senderId,
      receiverId: receiverId,
      message: message,
      timestamp: new Date()
    });
  }

  // Obtener los mensajes entre dos usuarios
  getMessages(senderId: string, receiverId: string): Observable<Message[]> {
    const messagesSent = this.firestore.collection<Message>('messages', ref =>
      ref.where('senderId', '==', senderId)
        .where('receiverId', '==', receiverId)
        .orderBy('timestamp')
    ).valueChanges();

    const messagesReceived = this.firestore.collection<Message>('messages', ref =>
      ref.where('senderId', '==', receiverId)
        .where('receiverId', '==', senderId)
        .orderBy('timestamp')
    ).valueChanges();

    return combineLatest([messagesSent, messagesReceived]).pipe(
      map(([sent, received]) => {
        // Asegúrate de que `timestamp` esté definido y puedas hacer la comparación
        return [...sent, ...received].sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
      })
    );
  }

  async getRecentUserChats(userId: string, limitResults: number): Promise<any[]> {
    const chatsRef = this.firestore.collection<ChatData>(
      `users/${userId}/chats`,
      ref => ref.orderBy('lastMessageTimestamp', 'desc').limit(limitResults)
    );
  
    // Usa `firstValueFrom` en lugar de `toPromise`
    const snapshot = await firstValueFrom(chatsRef.snapshotChanges());
  
    if (!snapshot || snapshot.length === 0) {
      // Retorna un array vacío si no hay resultados
      return [];
    }
  
    // Procesa los documentos en el snapshot
    return snapshot.map(change => {
      const data = change.payload.doc.data(); // Obtén los datos del documento
      if (!data) {
        return { otherUserId: change.payload.doc.id }; // Si no hay datos, retorna solo el ID
      }
  
      return {
        otherUserId: change.payload.doc.id, // ID del documento
        ...data, // Propaga los datos del documento
      };
    });
  }

  async updateUserChats(
    senderId: string,
    lastSenderName: string,
    receiverId: string,
    message: string,
    timestamp: Date
  ): Promise<void> {
    // Referencia al chat del remitente
    const senderChatRef = this.firestore.doc(`users/${senderId}/chats/${receiverId}`);
    debugger;
    await senderChatRef.set(
      {
        lastMessage: message,
        lastMessageTimestamp: timestamp,
        lastSenderId: senderId,
        lastSenderName: lastSenderName
      },
      { merge: true }
    );

    // Referencia al chat del receptor
    const receiverChatRef = this.firestore.doc(`users/${receiverId}/chats/${senderId}`);
    await receiverChatRef.set(
      {
        lastMessage: message,
        lastMessageTimestamp: timestamp,
        lastSenderId: senderId,
      },
      { merge: true }
    );
  }

}
