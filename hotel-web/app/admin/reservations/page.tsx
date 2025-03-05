"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllReservations, updateReservationStatus } from "@/lib/api";
import type { BookingWithRoom, PaginatedResponse } from "@/lib/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminReservationsPage() {
  const [reservationsData, setReservationsData] =
    useState<PaginatedResponse<BookingWithRoom> | null>(null);
  const [filteredReservations, setFilteredReservations] = useState<
    BookingWithRoom[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchReservations() {
      try {
        const data = await getAllReservations(currentPage);
        setReservationsData(data);
        setFilteredReservations(data.content);
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
  }, [toast, currentPage]);

  useEffect(() => {
    if (reservationsData) {
      let filtered = [...reservationsData.content];

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
    }
  }, [searchQuery, statusFilter, reservationsData]);

  const handleStatusChange = async (
    reservationId: string,
    newStatus: string
  ) => {
    try {
      await updateReservationStatus(reservationId, newStatus);

      // Refresh the reservations list
      const data = await getAllReservations(currentPage);
      setReservationsData(data);
      setFilteredReservations(data.content);

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

  const handlePreviousPage = () => {
    if (reservationsData && !reservationsData.first) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (reservationsData && !reservationsData.last) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="container py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Reservation Management</h1>
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Loading reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Reservation Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-4 md:flex-row">
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
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
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
                    <TableCell colSpan={8} className="py-8 text-center">
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
                            reservation.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : reservation.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : reservation.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {reservation.status.charAt(0) +
                            reservation.status.slice(1).toLowerCase()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          defaultValue={reservation.status}
                          onValueChange={(value: string) =>
                            handleStatusChange(reservation.id, value)
                          }
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="CONFIRMED">Confirm</SelectItem>
                            <SelectItem value="CANCELLED">Cancel</SelectItem>
                            <SelectItem value="COMPLETED">Complete</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {reservationsData && reservationsData.totalPages > 1 && (
            <div className="flex gap-4 justify-center items-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={reservationsData.first}
              >
                <ChevronLeft className="mr-1 w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {reservationsData.number + 1} of{" "}
                {reservationsData.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={reservationsData.last}
              >
                Next
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
