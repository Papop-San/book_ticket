export class UpdateSeatDto {
  event_id?: number;
  seat_code?: string;
  status?: "AVAILABLE" | "BOOKED";
}