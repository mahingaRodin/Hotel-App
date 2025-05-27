"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAvailableRooms } from "@/lib/api"; // or getAllRooms if you want admin rooms
import type { Room } from "@/lib/types";
import Link from "next/link";
import React from "react";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const data = await getAvailableRooms(0); // or getAllRooms(0)
        setRooms(data.content || []);
      } catch (error) {
        setRooms([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  if (loading) {
    return <div className="container py-8 mx-auto">Loading rooms...</div>;
  }

  return (
    <div className="container py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Available Rooms</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price per Night</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center">
                  No rooms found
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>${room.pricePerNight}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>{room.available ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Link href={`/booking/${room.id}`}>
                      <button className="btn btn-primary">Book</button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
