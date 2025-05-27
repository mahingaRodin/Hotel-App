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
    // Try to parse error message if available
    const errorText = await response.text();
    let error;
    try {
      error = JSON.parse(errorText);
    } catch {
      error = { message: errorText || "An error occurred while fetching data" };
    }
    throw new Error(error?.message || "An error occurred while fetching data");
  }

  // If response has no content, return null
  const text = await response.text();
  if (!text) return null;
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
      headers: getAuthHeaders?.(),
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Failed to fetch rooms");
  const data = await response.json();
  return {
    content: (data.roomDtoList || []).map((room: any) => ({
      ...room,
      pricePerNight: room.price,
      description: room.description || "",
      capacity: room.capacity || 1,
      type: room.type || "",
      available: room.available !== undefined ? room.available : true,
    })),
    totalPages: data.totalPages || 1,
    number: data.pageNumber || 0,
  };
}

export async function getCustomerRoomById(roomId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/customer/get-room/${roomId}`,
    {
      headers: getAuthHeaders?.(),
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Failed to fetch room");
  const data = await response.json();
  return {
    ...data,
    pricePerNight: data.price,
    description: data.description || "",
    capacity: data.capacity || 1,
    type: data.type || "",
    available: data.available !== undefined ? data.available : true,
  };
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

  if (!response.ok) throw new Error("Failed to create booking");
  // Backend returns empty body on success
  return { success: true };
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
  if (!response.ok) throw new Error("Failed to fetch rooms");
  const data = await response.json();
  return {
    content: (data.roomDtoList || []).map((room: any) => ({
      ...room,
      pricePerNight: room.price,
      description: room.description || "",
      capacity: room.capacity || 1,
      type: room.type || "",
      available: room.available !== undefined ? room.available : true,
    })),
    totalPages: data.totalPages || 1,
    totalElements: data.totalElements || 0,
    size: data.size || 10,
    number: data.pageNumber || 0,
    first: data.pageNumber === 0,
    last: data.pageNumber + 1 === (data.totalPages || 1),
    empty: (data.roomDtoList || []).length === 0,
  };
}

export async function getAdminRoomById(roomId: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/get-room/${roomId}`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch room");
  const data = await response.json();
  return {
    ...data,
    pricePerNight: data.price,
    description: data.description || "",
    capacity: data.capacity || 1,
    type: data.type || "",
    available: data.available !== undefined ? data.available : true,
  };
}

export async function createRoom(roomData: {
  name: string;
  price: number;
  type: string;
  available?: boolean;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/room`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...roomData,
        available: true, // Default to true for new rooms
      }),
      credentials: "include",
    });

    // If the response is empty but status is ok, consider it a success
    if (response.status === 200 || response.status === 201) {
      return { success: true, message: "Room created successfully" };
    }

    // Try to parse error response if available
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // If we can't parse the response as JSON, throw a generic error
      throw new Error("Failed to create room");
    }

    throw new Error(errorData?.message || "Failed to create room");
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
}

export async function updateRoom(
  roomId: string,
  roomData: {
    name?: string;
    type?: string;
    pricePerNight?: number;
    available?: boolean;
  }
) {
  // Only send the fields your backend expects
  const payload: any = {
    name: roomData.name,
    type: roomData.type,
    price: roomData.pricePerNight, // map pricePerNight to price
    available: roomData.available,
  };

  const response = await fetch(`${API_BASE_URL}/api/admin/room/${roomId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
    credentials: "include",
  });

  // If response is empty but status is ok, consider it a success
  if (response.status === 200 || response.status === 204) {
    return { success: true, message: "Room updated successfully" };
  }

  // Try to parse error response if available
  let errorData;
  try {
    errorData = await response.json();
  } catch (e) {
    throw new Error("Failed to update room");
  }

  throw new Error(errorData?.message || "Failed to update room");
}

export async function deleteRoom(roomId: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/room/${roomId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  return handleResponse(response);
}

export async function getAllBookings(pageNumber = 0) {
  // GET /api/admin/reservations/{pageNumber}
  const response = await fetch(
    `${API_BASE_URL}/api/admin/reservations/${pageNumber}`,
    {
      headers: getAuthHeaders(),
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Failed to fetch all bookings");
  return response.json();
}


export async function getCustomerBookings(userId: number, pageNumber = 0) {
  // GET /api/customer/bookings/{userId}/{pageNumber}
  const response = await fetch(
    `${API_BASE_URL}/api/customer/bookings/${userId}/${pageNumber}`,
    {
      headers: getAuthHeaders?.(),
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Failed to fetch customer bookings");
  return response.json();
}
