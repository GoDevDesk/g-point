
export interface Message {
    senderId: string;
    receiverId: string;
    message: string;
    timestamp: any; // Asegúrate de usar el tipo de Firestore para los timestamps
  }