export interface PrivacySettings {
  userId: number;
  enabledChat: boolean;
  receiveEmailNotifications: boolean;
}

export interface PrivacySettingsResponse {
  enabledChat: boolean;
  receiveEmailNotifications: boolean;
}

export interface PrivacySettingsRequest {
  userId: number;
  enabledChat?: boolean;
  receiveEmailNotifications?: boolean;
}