export class CreateSeatDto {
  event_id: number;
  seat_codes: string[];
}

export interface Seat {
  id: number;
  event_id: number;
  seat_code: string;
  status: 'AVAILABLE' | 'BOOKED';
  created_at: Date;
  updated_at: Date;
}