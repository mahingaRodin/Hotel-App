"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllRooms, deleteRoom } from "@/lib/api";
import type { Room, PaginatedResponse } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  Edit,
  Plus,
  Search,
  Trash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function AdminRoomsPage() {
  const [roomsData, setRoomsData] = useState<PaginatedResponse<Room> | null>(
    null
  );
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchRooms() {
      try {
        const data = await getAllRooms(currentPage);
        setRoomsData(data);
        setFilteredRooms(data.content);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load rooms. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, [toast, currentPage]);

  useEffect(() => {
    if (roomsData) {
      if (searchQuery.trim() === "") {
        setFilteredRooms(roomsData.content);
      } else {
        const query = searchQuery.toLowerCase();
        setFilteredRooms(
          roomsData.content.filter(
            (room) =>
              room.name.toLowerCase().includes(query) ||
              room.description.toLowerCase().includes(query)
          )
        );
      }
    }
  }, [searchQuery, roomsData]);

  const handleDeleteRoom = async (roomId: string) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(roomId);

        // Refresh the room list
        const data = await getAllRooms(currentPage);
        setRoomsData(data);
        setFilteredRooms(data.content);

        toast({
          title: "Room deleted",
          description: "The room has been deleted successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete room. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePreviousPage = () => {
    if (roomsData && !roomsData.first) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (roomsData && !roomsData.last) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="container py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Room Management</h1>
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Room Management</h1>
        <Link href="/admin/rooms/new">
          <Button>
            <Plus className="mr-2 w-4 h-4" />
            Add New Room
          </Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search rooms..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Price per Night</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center">
                      No rooms found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>{room.capacity}</TableCell>
                      <TableCell>
                        {formatCurrency(room.pricePerNight)}
                      </TableCell>
                      <TableCell className="hidden max-w-xs truncate md:table-cell">
                        {room.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Link href={`/admin/rooms/${room.id}`}>
                            <Button variant="outline" size="icon">
                              <Edit className="w-4 h-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteRoom(room.id)}
                          >
                            <Trash className="w-4 h-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {roomsData && roomsData.totalPages > 1 && (
            <div className="flex gap-4 justify-center items-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={roomsData.first}
              >
                <ChevronLeft className="mr-1 w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {roomsData.number + 1} of {roomsData.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={roomsData.last}
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
