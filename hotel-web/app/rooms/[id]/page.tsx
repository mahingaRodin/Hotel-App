import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  BedDouble,
  Calendar,
  Check,
  CreditCard,
  MapPin,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// This would normally be fetched from the API based on the ID
const room = {
  id: "1",
  name: "Deluxe King Room",
  description:
    "Experience luxury in our spacious Deluxe King Room, featuring a plush king-sized bed, elegant furnishings, and a stunning city view. This room offers the perfect blend of comfort and style for your stay.",
  longDescription:
    "Our Deluxe King Room is designed with your comfort in mind. The room features a luxurious king-sized bed with premium linens, a spacious work desk, and a comfortable seating area where you can relax after a day of exploring or business meetings. The large windows offer breathtaking views of the city skyline, filling the room with natural light during the day and showcasing the city lights at night. The en-suite bathroom is equipped with a rainfall shower, deep soaking tub, and premium toiletries. Additional amenities include a smart TV with streaming capabilities, high-speed Wi-Fi, a mini-fridge, and a coffee maker. Room service is available 24/7 to cater to your dining needs.",
  capacity: 2,
  pricePerNight: 199,
  size: "32 m²",
  type: "King",
  amenities: [
    "Free WiFi",
    "TV with streaming",
    "Coffee Maker",
    "Room Service",
    "Air Conditioning",
    "Mini Fridge",
    "Safe",
    "Hairdryer",
    "Iron & Ironing Board",
  ],
  images: [
    "/placeholder.svg?height=500&width=800",
    "/placeholder.svg?height=500&width=800",
    "/placeholder.svg?height=500&width=800",
  ],
  location: "10th Floor, North Wing",
};

export default function RoomDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{room.name}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-1 text-sm">
              <BedDouble className="h-4 w-4 text-muted-foreground" />
              <span>{room.type} Bed</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Up to {room.capacity} guests</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{room.location}</span>
            </div>
          </div>

          <div className="relative h-[400px] w-full mb-4 rounded-lg overflow-hidden">
            <Image
              src={room.images[0] || "/placeholder.svg"}
              alt={room.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {room.images.slice(1).map((image, index) => (
              <div
                key={index}
                className="relative h-[200px] rounded-lg overflow-hidden"
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${room.name} - Image ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-muted-foreground mb-4">{room.description}</p>
            <p className="text-muted-foreground">{room.longDescription}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {room.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold mb-2">
                {formatCurrency(room.pricePerNight)}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  / night
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <CreditCard className="h-4 w-4" />
                <span>No prepayment needed – pay at the property</span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Check-in</label>
                    <div className="flex items-center gap-2 p-2 border rounded-md">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Select date</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Check-out</label>
                    <div className="flex items-center gap-2 p-2 border rounded-md">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Select date</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Guests</label>
                  <div className="flex items-center gap-2 p-2 border rounded-md">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>2 Adults, 0 Children</span>
                  </div>
                </div>

                <Link href={`/booking/${room.id}`}>
                  <Button className="w-full">Book Now</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
