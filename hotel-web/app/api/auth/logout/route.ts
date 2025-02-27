import { NextResponse } from "next/server";

export async function POST() {
  try {
    // In a real application, you would clear the session cookie here

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
