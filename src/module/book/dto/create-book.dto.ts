export class CreateBookDto {
  seat_id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: BookingStatus;
} 

export enum BookingStatus {
  BOOKED = 'BOOKED',
  CANCELLED = 'CANCELLED',
}