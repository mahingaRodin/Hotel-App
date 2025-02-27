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
import type { Room } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Plus, Search, Trash } from "lucide-react";
import Link from "next/link";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchRooms() {
      try {
        const data = await getAllRooms();
        setRooms(data);
        setFilteredRooms(data);
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
  }, [toast]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRooms(rooms);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredRooms(
        rooms.filter(
          (room) =>
            room.name.toLowerCase().includes(query) ||
            room.description.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, rooms]);

  const handleDeleteRoom = async (roomId: string) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(roomId);
        setRooms(rooms.filter((room) => room.id !== roomId));
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

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Room Management</h1>
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Room Management</h1>
        <Link href="/admin/rooms/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
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
                    <TableCell colSpan={5} className="text-center py-8">
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
                      <TableCell className="hidden md:table-cell max-w-xs truncate">
                        {room.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/rooms/${room.id}`}>
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteRoom(room.id)}
                          >
                            <Trash className="h-4 w-4" />
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
        </CardContent>
      </Card>
    </div>
  );
}
