"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserBookings } from "@/lib/api";
import type { BookingWithRoom, PaginatedResponse } from "@/lib/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  BedDouble,
  Calendar,
  CreditCard,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function UserBookingsPage() {
  const [bookingsData, setBookingsData] = useState<
    PaginatedResponse<BookingWithRoom>
  >({
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 10,
    number: 0,
    first: true,
    last: true,
    empty: true,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await getUserBookings(0);
        setBookingsData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load your bookings. Please try again.",
          variant: "destructive",
        });
        setBookingsData({
          content: [],
          totalPages: 0,
          totalElements: 0,
          size: 10,
          number: 0,
          first: true,
          last: true,
          empty: true,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [toast]);

  const handlePreviousPage = () => {
    if (bookingsData.content && !bookingsData.first) {
      setBookingsData((prev) => ({
        ...prev,
        number: prev.number - 1,
      }));
    }
  };

  const handleNextPage = () => {
    if (bookingsData.content && !bookingsData.last) {
      setBookingsData((prev) => ({
        ...prev,
        number: prev.number + 1,
      }));
    }
  };

  if (loading) {
    return (
      <div className="container py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">My Bookings</h1>
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (!bookingsData.content || bookingsData.empty) {
    return (
      <div className="container py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">My Bookings</h1>
        <Card>
          <CardContent className="flex flex-col justify-center items-center py-12">
            <div className="space-y-4 text-center">
              <Calendar className="mx-auto w-12 h-12 text-muted-foreground" />
              <h2 className="text-xl font-semibold">No bookings found</h2>
              <p className="text-muted-foreground">
                You haven't made any bookings yet.
              </p>
              <Link href="/rooms">
                <Button>Browse Rooms</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">My Bookings</h1>

      <div className="grid gap-6">
        {bookingsData.content.map((booking) => (
          <Card key={booking.id}>
            <div className="md:flex">
              <div className="relative h-48 md:h-auto md:w-1/3">
                <Image
                  src={
                    booking.room.images[0] ||
                    "/placeholder.svg?height=300&width=500"
                  }
                  alt={booking.room.name}
                  fill
                  className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                />
              </div>
              <div className="flex-1">
                <CardHeader>
                  <CardTitle>{booking.room.name}</CardTitle>
                  <CardDescription>{booking.room.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDate(booking.checkIn)} -{" "}
                          {formatDate(booking.checkOut)}
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{booking.guests} guests</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <BedDouble className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          Room capacity: {booking.room.capacity}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          Total: {formatCurrency(booking.totalPrice)}
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div
                          className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.status === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {booking.status.charAt(0) +
                            booking.status.slice(1).toLowerCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {booking.status === "PENDING" && (
                    <Button variant="destructive" size="sm">
                      Cancel Booking
                    </Button>
                  )}
                </CardFooter>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {bookingsData.totalPages > 1 && (
        <div className="flex gap-4 justify-center items-center mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={bookingsData.first}
          >
            <ChevronLeft className="mr-1 w-4 h-4" />
            Previous
          </Button>
          <span className="text-sm">
            Page {bookingsData.number + 1} of {bookingsData.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={bookingsData.last}
          >
            Next
            <ChevronRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
