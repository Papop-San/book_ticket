export class CreateBookDto {
  id: number;
  seat_id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: "BOOKED" | "CANCELLED"
}
