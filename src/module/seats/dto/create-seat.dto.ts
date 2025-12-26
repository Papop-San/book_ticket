export class CreateSeatDto {
  id: number;
  event_id: number;
  seat_code: string;
  status: "AVAILABLE" | "BOOKED" 
}

