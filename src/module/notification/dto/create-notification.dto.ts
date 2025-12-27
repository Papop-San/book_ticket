export type NotificationType =
  | 'FULL'
  | 'AVAILABLE'
  | 'TESTING';


export class CreateNotificationDto {
    type: NotificationType
    message: string;
}
