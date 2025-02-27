// Base URL for the HotelServer API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api";

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "An error occurred while fetching data");
  }
  return response.json();
}

// Authentication
export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  return handleResponse(response);
}

export async function register(userData: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
    credentials: "include",
  });
  return handleResponse(response);
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return handleResponse(response);
}

// Customer APIs
export async function getAvailableRooms(params?: {
  checkIn?: string;
  checkOut?: string;
  price?: number;
}) {
  const queryParams = new URLSearchParams();
  if (params?.checkIn) queryParams.append("checkIn", params.checkIn);
  if (params?.checkOut) queryParams.append("checkOut", params.checkOut);
  if (params?.price) queryParams.append("capacity", params.price.toString());

  const response = await fetch(
    `${API_BASE_URL}/rooms/available?${queryParams.toString()}`,
    {
      credentials: "include",
    }
  );
  return handleResponse(response);
}

export async function createBooking(bookingData: {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}) {
  const response = await fetch(`${API_BASE_URL}/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
    credentials: "include",
  });
  return handleResponse(response);
}

export async function getUserBookings(pageNumber: number) {
  const response = await fetch(
    `${API_BASE_URL}/bookings/{userId}/${pageNumber}`,
    {
      credentials: "include",
    }
  );
  return handleResponse(response);
}

// Admin APIs
export async function getAllReservations(pageNumber: number) {
  const response = await fetch(
    `${API_BASE_URL}/admin/reservations/${pageNumber}`,
    {
      credentials: "include",
    }
  );
  return handleResponse(response);
}

export async function updateReservationStatus(id: string, status: string) {
  const response = await fetch(
    `${API_BASE_URL}/admin/reservation/${id}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
      credentials: "include",
    }
  );
  return handleResponse(response);
}

export async function getAllRooms() {
  const response = await fetch(`${API_BASE_URL}/admin/rooms`, {
    credentials: "include",
  });
  return handleResponse(response);
}

export async function getRoomById(roomId: string) {
  const response = await fetch(`${API_BASE_URL}/admin/rooms/${roomId}`, {
    credentials: "include",
  });
  return handleResponse(response);
}

export async function createRoom(roomData: {
  name: string;
  type: string;
  price: number;
  available: boolean;
}) {
  const response = await fetch(`${API_BASE_URL}/admin/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(roomData),
    credentials: "include",
  });
  return handleResponse(response);
}

export async function updateRoom(
  id: string,
  roomData: {
    name?: string;
    type?: string;
    price?: number;
    available?: boolean;
  }
) {
  const response = await fetch(`${API_BASE_URL}/admin/room/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(roomData),
    credentials: "include",
  });
  return handleResponse(response);
}

export async function deleteRoom(id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/room/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse(response);
}
