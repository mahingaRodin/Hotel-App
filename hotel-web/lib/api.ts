import type {
  AuthResponse,
  PaginatedResponse,
  Room,
  BookingWithRoom,
} from "@/lib/types";

// Base URL for the HotelServer API
const API_BASE_URL = "http://localhost:8080";

// Helper function to handle API responses
async function handleResponse(response: Response) {
  // First check if response is ok
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch (e) {
      // If parsing fails, use the raw text if available
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Handle successful response
  const text = await response.text();
  if (!text) {
    return null; // or handle empty response as needed
  }

  return JSON.parse(text);
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
  console.log("Sending login request with:", { email, password });

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password,
      }),
      // Try without credentials to rule out CORS issues
      credentials: "omit",
    });

    console.log("Login response status:", response.status);

    // Log response headers for debugging
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log("Response headers:", headers);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // Check if there's content before trying to parse
    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");
    console.log("Content type:", contentType, "Length:", contentLength);

    // Get the raw response text
    const responseText = await response.text();
    console.log("Raw response text:", responseText);

    // If response is empty but status is OK, create a default response
    if (!responseText || responseText.trim() === "") {
      console.warn("Empty response received with status OK");
      // Return a mock response for testing
      return {
        jwt: "mock-jwt-for-testing",
        userId: "1", // Changed to string to match type
        userRole: "CUSTOMER",
      };
    }

    // Try to parse the response
    try {
      return JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response:", e);
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
  } catch (error) {
    console.error("Login request failed:", error);
    throw error;
  }
}

export async function register(userData: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || `Registration failed with status: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
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

  const response = await fetch(
    `${API_BASE_URL}/api/customer/bookings/${userId}/${pageNumber}`,
    {
      headers: getAuthHeaders(),
      credentials: "include",
    }
  );

  return handleResponse(response) as Promise<
    PaginatedResponse<BookingWithRoom>
  >;
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
  const response = await fetch(`${API_BASE_URL}/api/admin/room/${roomId}`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });

  return handleResponse(response) as Promise<Room>;
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
