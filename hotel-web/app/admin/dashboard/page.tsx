"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllReservations, getAllRooms } from "@/lib/api";
import type { BookingWithRoom, Room } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  BedDouble,
  CalendarCheck,
  DollarSign,
  Users,
  TrendingUp,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";

// Helper function to calculate percentage change
const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
};

export default function AdminDashboardPage() {
  const [reservations, setReservations] = useState<BookingWithRoom[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchDashboardData() { 
      try {
        const [reservationsData, roomsData] = await Promise.all([
          getAllReservations(),
          getAllRooms(),
        ]);
        setReservations(reservationsData.data);
        setRooms(roomsData.data as unknown as Room[]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [toast]);

  // Calculate metrics
  const totalRevenue = reservations.reduce(
    (sum, booking) => sum + booking.totalPrice,
    0
  );
  const confirmedBookings = reservations.filter(
    (booking) => booking.status === "APPROVED"
  ).length;
  const occupiedRooms = reservations.filter(
    (booking) =>
      booking.status === "APPROVED" &&
      new Date(booking.checkIn) <= new Date() &&
      new Date(booking.checkOut) >= new Date()
  ).length;
  const activeGuests = reservations
    .filter(
      (booking) =>
        booking.status === "APPROVED" &&
        new Date(booking.checkIn) <= new Date() &&
        new Date(booking.checkOut) >= new Date()
    )
    .reduce((sum, booking) => sum + booking.guests, 0);

  // Mock previous period data for comparison
  const previousRevenue = totalRevenue * 0.8;
  const previousBookings = confirmedBookings * 0.9;
  const previousOccupancy = occupiedRooms * 0.85;
  const previousGuests = activeGuests * 0.75;

  if (loading) {
    return (
      <div className="container py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/admin/rooms/new">Add New Room</Link>
        </Button>
      </div>

      <div className="grid gap-4 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {calculatePercentageChange(totalRevenue, previousRevenue) > 0 ? (
                <>
                  <ArrowUpRight className="w-4 h-4 mr-1 text-green-500" />
                  <span className="text-green-500">
                    {calculatePercentageChange(
                      totalRevenue,
                      previousRevenue
                    ).toFixed(1)}
                    % from last month
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4 mr-1 text-red-500" />
                  <span className="text-red-500">
                    {Math.abs(
                      calculatePercentageChange(totalRevenue, previousRevenue)
                    ).toFixed(1)}
                    % from last month
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <CalendarCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedBookings}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {calculatePercentageChange(confirmedBookings, previousBookings) >
              0 ? (
                <>
                  <ArrowUpRight className="w-4 h-4 mr-1 text-green-500" />
                  <span className="text-green-500">
                    {calculatePercentageChange(
                      confirmedBookings,
                      previousBookings
                    ).toFixed(1)}
                    % from last month
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4 mr-1 text-red-500" />
                  <span className="text-red-500">
                    {Math.abs(
                      calculatePercentageChange(
                        confirmedBookings,
                        previousBookings
                      )
                    ).toFixed(1)}
                    % from last month
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Room Occupancy
            </CardTitle>
            <BedDouble className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((occupiedRooms / rooms.length) * 100).toFixed(1)}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {calculatePercentageChange(occupiedRooms, previousOccupancy) >
              0 ? (
                <>
                  <ArrowUpRight className="w-4 h-4 mr-1 text-green-500" />
                  <span className="text-green-500">
                    {calculatePercentageChange(
                      occupiedRooms,
                      previousOccupancy
                    ).toFixed(1)}
                    % from last month
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4 mr-1 text-red-500" />
                  <span className="text-red-500">
                    {Math.abs(
                      calculatePercentageChange(
                        occupiedRooms,
                        previousOccupancy
                      )
                    ).toFixed(1)}
                    % from last month
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Guests</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGuests}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {calculatePercentageChange(activeGuests, previousGuests) > 0 ? (
                <>
                  <ArrowUpRight className="w-4 h-4 mr-1 text-green-500" />
                  <span className="text-green-500">
                    {calculatePercentageChange(
                      activeGuests,
                      previousGuests
                    ).toFixed(1)}
                    % from last month
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4 mr-1 text-red-500" />
                  <span className="text-red-500">
                    {Math.abs(
                      calculatePercentageChange(activeGuests, previousGuests)
                    ).toFixed(1)}
                    % from last month
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Bookings</TabsTrigger>
          <TabsTrigger value="rooms">Room Status</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>
                Overview of the latest reservations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reservations.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{booking.room.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(booking.checkIn)} -{" "}
                        {formatDate(booking.checkOut)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(booking.totalPrice)}
                        </p>
                        <p
                          className={`text-sm ${
                            booking.status === "APPROVED"
                              ? "text-green-500"
                              : booking.status === "PENDING"
                              ? "text-yellow-500"
                              : booking.status === "REJECTED"
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/reservations/${booking.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <Link href="/admin/reservations">View All Reservations</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Room Status</CardTitle>
              <CardDescription>
                Current occupancy and availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rooms.slice(0, 5).map((room) => {
                  const isOccupied = reservations.some(
                    (booking) =>
                      booking.roomId === room.id &&
                      booking.status === "APPROVED" &&
                      new Date(booking.checkIn) <= new Date() &&
                      new Date(booking.checkOut) >= new Date()
                  );

                  return (
                    <div
                      key={room.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{room.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Capacity: {room.capacity} guests
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div
                          className={`px-3 py-1 rounded-full text-sm ${
                            isOccupied
                              ? "text-red-800 bg-red-100"
                              : "text-green-800 bg-green-100"
                          }`}
                        >
                          {isOccupied ? "Occupied" : "Available"}
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/rooms/${room.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <Link href="/admin/rooms">View All Rooms</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>
                Key performance metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">
                      Average Daily Rate
                    </CardTitle>
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(totalRevenue / confirmedBookings || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Per confirmed booking
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">
                      Occupancy Rate
                    </CardTitle>
                    <Percent className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {((occupiedRooms / rooms.length) * 100).toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Of total room capacity
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
