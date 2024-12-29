import { Timestamp } from 'firebase/firestore'; // Desde Firebase, no Angular Fire

export interface ChatData {
    lastMessage: string;
    lastMessageTimestamp: Timestamp; // Cambiado a Timestamp
    lastSenderId: string;
  }