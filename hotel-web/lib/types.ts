export interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  available: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
  room?: {
    id: string;
    type: string;
    name: string;
  };
  user?: {
    id: string;
    name: string;
  };
}

export interface BookingWithRoom extends Booking {
  room: Room;
}

export interface RoomFilters {
  checkIn?: string;
  checkOut?: string;
  price?: number;
}
