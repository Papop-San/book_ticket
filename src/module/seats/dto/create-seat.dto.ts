export class CreateSeatDto {
  event_id: number;
  seat_codes: string[];
}

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
}

export interface Seat {
  id: number;
  event_id: number;
  seat_code: string;
  status: SeatStatus;
  created_at: Date;
  updated_at: Date;
}