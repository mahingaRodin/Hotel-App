"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAdminRoomById, updateRoom, deleteRoom } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import type { Room } from "@/lib/types";
import { ArrowLeft, Plus, X, Trash2, Save } from "lucide-react";
import Link from "next/link";

export default function EditRoomPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: 1,
    pricePerNight: 0,
    amenities: [] as string[],
    images: [] as string[],
    type: "",
    available: true,
  });

  // Temporary states for adding amenities and images
  const [newAmenity, setNewAmenity] = useState("");
  const [newImage, setNewImage] = useState("");

  // Fetch room data on component mount
  useEffect(() => {
    async function fetchRoom() {
      try {
        const roomData = await getAdminRoomById(params.id);
        setRoom(roomData);
        setFormData({
          name: roomData.name,
          description: roomData.description,
          capacity: roomData.capacity,
          pricePerNight: roomData.pricePerNight,
          amenities: roomData.amenities || [],
          images: roomData.images || [],
          type: roomData.type || "",
          available:
            roomData.available !== undefined ? roomData.available : true,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load room details. Please try again.",
          variant: "destructive",
        });
        router.push("/admin/rooms");
      } finally {
        setLoading(false);
      }
    }

    fetchRoom();
  }, [params.id, toast, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }));
      setNewImage("");
    }
  };

  const removeImage = (image: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((i) => i !== image),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Room name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Room description is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.capacity < 1) {
      toast({
        title: "Validation Error",
        description: "Room capacity must be at least 1",
        variant: "destructive",
      });
      return;
    }

    if (formData.pricePerNight <= 0) {
      toast({
        title: "Validation Error",
        description: "Price per night must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await updateRoom(params.id, formData);

      toast({
        title: "Room Updated",
        description: "The room has been updated successfully",
      });

      router.push("/admin/rooms");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update room",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this room? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteRoom(params.id);

      toast({
        title: "Room Deleted",
        description: "The room has been deleted successfully",
      });

      router.push("/admin/rooms");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete room",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8 mx-auto">
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Loading room details...</p>
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
              <Link href="/admin/rooms">
                <Button>Back to Rooms</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4 items-center">
          <Link href="/admin/rooms">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Room</h1>
            <p className="text-muted-foreground">
              Update room information and settings
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="mr-2 w-4 h-4" />
          {isDeleting ? "Deleting..." : "Delete Room"}
        </Button>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Room Details</CardTitle>
            <CardDescription>
              Update the information for this room
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Room Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g., Deluxe King Room"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the room features and amenities..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity *</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePerNight">Price per Night ($) *</Label>
                    <Input
                      id="pricePerNight"
                      name="pricePerNight"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="199.99"
                      value={formData.pricePerNight || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Input
                    id="type"
                    name="type"
                    type="text"
                    placeholder="e.g., Deluxe, Suite, Standard"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="available">Available</Label>
                  <input
                    id="available"
                    name="available"
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        available: e.target.checked,
                      }))
                    }
                    title="Available status"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <Label>Amenities</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an amenity (e.g., Free WiFi)"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addAmenity())
                    }
                  />
                  <Button
                    type="button"
                    onClick={addAmenity}
                    size="icon"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex gap-1 items-center px-2 py-1 text-sm rounded-md bg-secondary text-secondary-foreground"
                      >
                        <span>{amenity}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="p-0 w-4 h-4 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeAmenity(amenity)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Images */}
              <div className="space-y-4">
                <Label>Room Images</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add image URL"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addImage())
                    }
                  />
                  <Button
                    type="button"
                    onClick={addImage}
                    size="icon"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.images.length > 0 && (
                  <div className="space-y-2">
                    {formData.images.map((image, index) => (
                      <div
                        key={index}
                        className="flex gap-2 items-center p-2 rounded-md border"
                      >
                        <span className="flex-1 text-sm truncate">{image}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeImage(image)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 w-4 h-4" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
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
    </div>
  );
}
