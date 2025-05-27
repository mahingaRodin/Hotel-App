"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createRoom } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function NewRoomPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    type: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error("Room name is required");
      }
      if (!formData.type.trim()) {
        throw new Error("Room type is required");
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        throw new Error("Price must be greater than 0");
      }

      const roomData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        type: formData.type.trim(),
      };

      const response = await createRoom(roomData);
      console.log("Room created successfully:", response);

      toast({
        title: "Success",
        description: "Room created successfully",
      });

      router.replace("/admin/rooms");
    } catch (error) {
      console.error("Error creating room:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Add New Room</h1>
        <Link href="/admin/rooms">
          <Button variant="outline">Back to Rooms</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Room Type</Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                placeholder="e.g., Deluxe, Standard, Suite"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Night ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Room"}
              </Button>
              <Link href="/admin/rooms">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
