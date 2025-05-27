import { SetStateAction } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  room?: Room;
}

export interface BookingWithRoom extends Booking {
  room: Room;
}

export interface RoomFilters {
  checkIn?: string;
  checkOut?: string;
  capacity?: number;
}

export interface AuthResponse {
  jwt: string;
  userId: string;
  userRole: "CUSTOMER" | "ADMIN";
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
