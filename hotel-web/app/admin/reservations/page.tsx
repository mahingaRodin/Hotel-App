"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllReservations, updateReservationStatus } from "@/lib/api";
import type { BookingWithRoom } from "@/lib/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<BookingWithRoom[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<
    BookingWithRoom[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchReservations() {
      try {
        const data = await getAllReservations();
        setReservations(data);
        setFilteredReservations(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load reservations. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, [toast]);

  useEffect(() => {
    let filtered = reservations;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (reservation) => reservation.status === statusFilter
      );
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (reservation) =>
          reservation.room.name.toLowerCase().includes(query) ||
          reservation.id.toLowerCase().includes(query)
      );
    }

    setFilteredReservations(filtered);
  }, [searchQuery, statusFilter, reservations]);

  const handleStatusChange = async (
    reservationId: string,
    newStatus: string
  ) => {
    try {
      await updateReservationStatus(reservationId, newStatus);

      // Update local state
      setReservations(
        reservations.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, status: newStatus as any }
            : reservation
        )
      );

      toast({
        title: "Status updated",
        description: `Reservation status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reservation status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Reservation Management</h1>
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Loading reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Reservation Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reservations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No reservations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-mono text-xs">
                        {reservation.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>{reservation.room.name}</TableCell>
                      <TableCell>{formatDate(reservation.checkIn)}</TableCell>
                      <TableCell>{formatDate(reservation.checkOut)}</TableCell>
                      <TableCell>{reservation.guests}</TableCell>
                      <TableCell>
                        {formatCurrency(reservation.totalPrice)}
                      </TableCell>
                      <TableCell>
                        <div
                          className={`px-2 py-1 text-xs rounded-full inline-block ${
                            reservation.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : reservation.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : reservation.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {reservation.status.charAt(0).toUpperCase() +
                            reservation.status.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          defaultValue={reservation.status}
                          onValueChange={(value) =>
                            handleStatusChange(reservation.id, value)
                          }
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirm</SelectItem>
                            <SelectItem value="cancelled">Cancel</SelectItem>
                            <SelectItem value="completed">Complete</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
