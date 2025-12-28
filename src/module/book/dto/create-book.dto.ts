export class CreateBookDto {
  seat_id: number;
  name: string;
  email: string;
  status: BookingStatus;
} 

export enum BookingStatus {
  BOOKED = 'BOOKED',
  CANCELLED = 'CANCELLED',
}