"use client";

import { useEffect, useState } from "react";
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
import { getUserBookings } from "@/lib/api";
import type { BookingWithRoom, PaginatedResponse } from "@/lib/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  BedDouble,
  Calendar,
  CreditCard,
  Users,
  ArrowRight,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookingsData, setBookingsData] =
    useState<PaginatedResponse<BookingWithRoom> | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchRecentBookings() {
      try {
        const data = await getUserBookings(0); // Get first page
        setBookingsData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load your bookings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchRecentBookings();
    }
  }, [user, toast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate stats
  const totalBookings = bookingsData?.totalElements || 0;
  const confirmedBookings =
    bookingsData?.content.filter((booking) => booking.status === "APPROVED")
      .length || 0;
  const pendingBookings =
    bookingsData?.content.filter((booking) => booking.status === "PENDING")
      .length || 0;
  const totalSpent =
    bookingsData?.content.reduce(
      (sum, booking) => sum + booking.totalPrice,
      0
    ) || 0;

  // Get upcoming booking
  const upcomingBooking = bookingsData?.content
    .filter(
      (booking) =>
        booking.status === "APPROVED" && new Date(booking.checkIn) > new Date()
    )
    .sort(
      (a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
    )[0];

  if (loading) {
    return (
      <div className="container py-8 mx-auto">
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">
          Welcome back, {user?.name || "Guest"}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your bookings and account activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedBookings}</div>
            <p className="text-xs text-muted-foreground">Active reservations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalSpent)}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime spending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Upcoming Booking */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Upcoming Stay</h2>
          {upcomingBooking ? (
            <Card>
              <div className="md:flex">
                <div className="relative h-48 md:h-auto md:w-1/3">
                  <Image
                    src={
                      upcomingBooking.room.images[0] ||
                      "/placeholder.svg?height=300&width=500"
                    }
                    alt={upcomingBooking.room.name}
                    fill
                    className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                  />
                </div>
                <div className="flex-1">
                  <CardHeader>
                    <CardTitle className="flex gap-2 items-center">
                      {upcomingBooking.room.name}
                      <div
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          upcomingBooking.status
                        )}`}
                      >
                        {upcomingBooking.status.charAt(0) +
                          upcomingBooking.status.slice(1).toLowerCase()}
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {upcomingBooking.room.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {formatDate(upcomingBooking.checkIn)} -{" "}
                          {formatDate(upcomingBooking.checkOut)}
                        </span>
                      </div>
                      <div className="flex gap-2 items-center text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{upcomingBooking.guests} guests</span>
                      </div>
                      <div className="flex gap-2 items-center text-sm">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {formatCurrency(upcomingBooking.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/bookings">View Details</Link>
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col justify-center items-center py-12">
                <Calendar className="mb-4 w-12 h-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  No upcoming stays
                </h3>
                <p className="mb-4 text-center text-muted-foreground">
                  You don't have any confirmed bookings coming up.
                </p>
                <Link href="/rooms">
                  <Button>Browse Rooms</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Bookings */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Recent Bookings</h2>
          <Card>
            <CardHeader>
              <CardTitle>Your Latest Reservations</CardTitle>
              <CardDescription>
                Overview of your recent booking activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookingsData && bookingsData.content.length > 0 ? (
                <div className="space-y-4">
                  {bookingsData.content.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex justify-between items-center p-3 rounded-lg border"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{booking.room.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(booking.checkIn)} -{" "}
                          {formatDate(booking.checkOut)}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        {getStatusIcon(booking.status)}
                        <span className="text-sm font-medium">
                          {formatCurrency(booking.totalPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <BedDouble className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No bookings yet</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/bookings" className="w-full">
                <Button variant="outline" className="w-full">
                  View All Bookings
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <BedDouble className="mb-2 w-8 h-8 text-primary" />
              <CardTitle>Browse Rooms</CardTitle>
              <CardDescription>
                Discover our available rooms and make a new booking
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/rooms" className="w-full">
                <Button className="w-full">
                  Browse Rooms
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="mb-2 w-8 h-8 text-primary" />
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>
                View and manage all your current and past reservations
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/dashboard/bookings" className="w-full">
                <Button variant="outline" className="w-full">
                  View Bookings
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="mb-2 w-8 h-8 text-primary" />
              <CardTitle>Hotel Services</CardTitle>
              <CardDescription>
                Explore our amenities and additional services
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
