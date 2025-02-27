import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // This is a placeholder for your actual authentication logic
    // In a real application, you would verify credentials against your database

    // Simple validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Mock authentication - in a real app, you would check credentials in your database
    if (email === "admin@example.com" && password === "password") {
      return NextResponse.json({
        user: {
          id: "2",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        },
      });
    } else if (email === "user@example.com" && password === "password") {
      return NextResponse.json({
        user: {
          id: "1",
          name: "Demo User",
          email: "user@example.com",
          role: "customer",
        },
      });
    } else {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
