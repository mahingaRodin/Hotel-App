import type {
  AuthResponse,
  PaginatedResponse,
  Room,
  BookingWithRoom,
} from "@/lib/types";

// Base URL for the HotelServer API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9090";

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "An error occurred while fetching data");
  }
  return response.json();
}

// Get JWT token from localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt_token");
  }
  return null;
};

// Add authorization header if token exists
const getAuthHeaders = () => {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Authentication
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const data = await handleResponse(response);

  // Store JWT token in localStorage
  if (data.jwt) {
    localStorage.setItem("jwt_token", data.jwt);
    localStorage.setItem("user_id", data.userId);
    localStorage.setItem("user_role", data.userRole);
  }

  return data;
}

export async function register(userData: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    }),
    credentials: "include",
  });

  return handleResponse(response);
}

export async function logout() {
  // Clear JWT token from localStorage
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_role");

  return { success: true };
}

// Customer APIs
export async function getAvailableRooms(pageNumber = 0) {
  const response = await fetch(
    `${API_BASE_URL}/api/customer/rooms/${pageNumber}`,
    {
      headers: getAuthHeaders(),
      credentials: "include",
    }
  );

  return handleResponse(response) as Promise<PaginatedResponse<Room>>;
}

export async function createBooking(bookingData: {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}) {
  const userId = localStorage.getItem("user_id");

  const response = await fetch(`${API_BASE_URL}/api/customer/book`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      ...bookingData,
      userId,
    }),
    credentials: "include",
  });

  return handleResponse(response);
}

export async function getUserBookings(pageNumber = 0) {
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/customer/bookings/${userId}/${pageNumber}`,
      {
        headers: getAuthHeaders(),
        credentials: "include",
      }
    );

    const data = await handleResponse(response);

    // Ensure the response has the correct structure
    return {
      content: data.content || [],
      totalPages: data.totalPages || 0,
      totalElements: data.totalElements || 0,
      size: data.size || 10,
      number: data.number || 0,
      first: data.first || true,
      last: data.last || true,
      empty: data.empty || true,
    } as PaginatedResponse<BookingWithRoom>;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    // Return a default empty response structure
    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
      size: 10,
      number: 0,
      first: true,
      last: true,
      empty: true,
    } as PaginatedResponse<BookingWithRoom>;
  }
}

// Admin APIs
export async function getAllReservations(pageNumber = 0) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/reservations/${pageNumber}`,
    {
      headers: getAuthHeaders(),
      credentials: "include",
    }
  );

  return handleResponse(response) as Promise<
    PaginatedResponse<BookingWithRoom>
  >;
}

export async function updateReservationStatus(
  reservationId: string,
  status: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/reservation/${reservationId}/${status}`,
    {
      method: "GET", // Note: This is GET according to the backend controller
      headers: getAuthHeaders(),
      credentials: "include",
    }
  );

  return handleResponse(response);
}

export async function getAllRooms(pageNumber = 0) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/rooms/${pageNumber}`,
    {
      headers: getAuthHeaders(),
      credentials: "include",
    }
  );

  return handleResponse(response) as Promise<PaginatedResponse<Room>>;
}

export async function getRoomById(roomId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/room/${roomId}`, {
      headers: getAuthHeaders(),
      credentials: "include",
    });

    return handleResponse(response) as Promise<Room>;
  } catch (error) {
    console.error("Failed to get room as admin, trying public access:", error);
    // If admin access fails, try to get the room from the available rooms
    // This is a workaround since the backend doesn't have a public endpoint for a single room
    const availableRooms = await getAvailableRooms(0);
    const room = availableRooms.content.find((room) => room.id === roomId);

    if (!room) {
      throw new Error("Room not found");
    }

    return room;
  }
}

export async function createRoom(roomData: {
  name: string;
  description: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  images: string[];
}) {
  const response = await fetch(`${API_BASE_URL}/api/admin/room`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(roomData),
    credentials: "include",
  });

  return handleResponse(response);
}

export async function updateRoom(
  roomId: string,
  roomData: {
    name?: string;
    description?: string;
    capacity?: number;
    pricePerNight?: number;
    amenities?: string[];
    images?: string[];
  }
) {
  const response = await fetch(`${API_BASE_URL}/api/admin/room/${roomId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(roomData),
    credentials: "include",
  });

  return handleResponse(response);
}

export async function deleteRoom(roomId: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/room/${roomId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  return handleResponse(response);
}
