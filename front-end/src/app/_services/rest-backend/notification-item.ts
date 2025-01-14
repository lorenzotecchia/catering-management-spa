// notification-item.ts
export interface NotificationItem {
  id?: number;
  NotificationContent: string;
  read: boolean;
  UserUserName: string;
  Event?: string;
  createdAt?: Date;
}
