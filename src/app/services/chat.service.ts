import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { combineLatest, map, Observable } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private firestore: AngularFirestore) {}

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
}
