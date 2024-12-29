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

  getRecentUserChats(userId: string, limitResults: number): Observable<any[]> {
    const chatsRef = this.firestore.collection<any>(
      `users/${userId}/chats`,
      ref => ref.orderBy('lastMessageTimestamp', 'desc').limit(limitResults)
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
    debugger;
    await senderChatRef.set(
      {
        lastMessage: message,
        lastMessageTimestamp: timestamp,
        lastSenderId: senderId,
        lastSenderName: lastSenderName,
        participants: [
          { id: senderId, name: lastSenderName },
          { id: receiverId, name: receiverName }
        ],
        otherUserName: receiverName
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
        participants: [
          { id: senderId, name: lastSenderName },
          { id: receiverId, name: receiverName }
        ],
        otherUserName: lastSenderName
      },
      { merge: true }
    );
  }

}
