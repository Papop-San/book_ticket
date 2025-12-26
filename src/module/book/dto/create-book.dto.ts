export class CreateBookDto {
  seat_id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: 'BOOKED' | 'CANCELLED';
} 