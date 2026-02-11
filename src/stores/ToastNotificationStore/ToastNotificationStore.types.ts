export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
} as const;

export type TNotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

export interface IToastNotification {
  id: number;
  text: string;
  type: TNotificationType;
  // keeps it simple, obviously can be expanded with dismissable / custom time / actions etc
}
