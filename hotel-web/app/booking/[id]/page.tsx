"use client";

import React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/authProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import { getCustomerRoomById, createBooking } from "@/lib/api";
import type { Room } from "@/lib/types";
import { BedDouble, Calendar, CreditCard, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const { id } = React.use(params);

  // Fetch room details
  useEffect(() => {
    async function fetchRoom() {
      try {
        const roomData = await getCustomerRoomById(id);
        setRoom(roomData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load room details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchRoom();
  }, [id, toast]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please login to book a room",
      });
      router.push(`/auth/login?redirect=/booking/${id}`);
    }
  }, [user, authLoading, router, id, toast]);

  // Calculate total price when dates change
  useEffect(() => {
    if (room && checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nights = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (nights > 0) {
        setTotalPrice(room.pricePerNight * nights);
      } else {
        setTotalPrice(0);
      }
    }
  }, [room, checkIn, checkOut]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to book a room",
        variant: "destructive",
      });
      return;
    }

    if (!checkIn || !checkOut) {
      toast({
        title: "Missing dates",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (start >= end) {
      toast({
        title: "Invalid dates",
        description: "Check-out date must be after check-in date",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createBooking({
        roomId: id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests,
      });

      toast({
        title: "Booking successful",
        description: "Your room has been booked successfully",
      });

      router.push("/dashboard/bookings");
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "Failed to book the room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="container py-8 mx-auto">
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container py-8 mx-auto">
        <Card>
          <CardContent className="flex flex-col justify-center items-center py-12">
            <div className="space-y-4 text-center">
              <h2 className="text-xl font-semibold">Room not found</h2>
              <p className="text-muted-foreground">
                The room you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/rooms">
                <Button>Browse Other Rooms</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const imageUrl =
    Array.isArray(room.images) && room.images.length > 0
      ? room.images[0]
      : "/placeholder.svg?height=500&width=800";

  return (
    <div className="container py-8 mx-auto">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-4 text-3xl font-bold">Book {room.name}</h1>

          <div className="relative h-[300px] w-full mb-6 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={room.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-semibold">Room Details</h2>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex gap-1 items-center text-sm">
                <BedDouble className="w-4 h-4 text-muted-foreground" />
                <span>Capacity: {room.capacity} guests</span>
              </div>
              <div className="flex gap-1 items-center text-sm">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span>{formatCurrency(room.pricePerNight)} per night</span>
              </div>
            </div>
            <p className="text-muted-foreground">{room.description}</p>
          </div>

          {room.amenities && room.amenities.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-semibold">Amenities</h2>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {room.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex gap-2 items-center p-2 rounded-md bg-muted"
                  >
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Book Your Stay</CardTitle>
              <CardDescription>
                Fill in the details to complete your booking
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="check-in">Check-in Date</Label>
                  <div className="flex items-center">
                    <Calendar className="mr-2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="check-in"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="check-out">Check-out Date</Label>
                  <div className="flex items-center">
                    <Calendar className="mr-2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="check-out"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests">Number of Guests</Label>
                  <div className="flex items-center">
                    <Users className="mr-2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="guests"
                      type="number"
                      value={guests}
                      onChange={(e) =>
                        setGuests(Number.parseInt(e.target.value))
                      }
                      min={1}
                      max={room.capacity}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maximum capacity: {room.capacity} guests
                  </p>
                </div>

                {totalPrice > 0 && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between mb-2">
                      <span>Price per night</span>
                      <span>{formatCurrency(room.pricePerNight)}</span>
                    </div>
                    {checkIn && checkOut && (
                      <div className="flex justify-between mb-2">
                        <span>Number of nights</span>
                        <span>
                          {Math.ceil(
                            (new Date(checkOut).getTime() -
                              new Date(checkIn).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between mt-2 text-lg font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Book Now"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
