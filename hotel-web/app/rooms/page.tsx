import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Wifi, Tv, Coffee, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

// This would normally be fetched from the API
const rooms = [
  {
    id: "1",
    name: "Deluxe King Room",
    description: "Spacious room with king-sized bed and city view",
    capacity: 2,
    pricePerNight: 199,
    amenities: ["Free WiFi", "TV", "Coffee Maker", "Room Service"],
    images: ["/placeholder.svg?height=300&width=500"],
  },
  {
    id: "2",
    name: "Executive Suite",
    description: "Luxury suite with separate living area and panoramic views",
    capacity: 3,
    pricePerNight: 299,
    amenities: ["Free WiFi", "TV", "Coffee Maker", "Room Service", "Mini Bar"],
    images: ["/placeholder.svg?height=300&width=500"],
  },
  {
    id: "3",
    name: "Family Room",
    description: "Perfect for families with two queen beds and extra space",
    capacity: 4,
    pricePerNight: 249,
    amenities: ["Free WiFi", "TV", "Coffee Maker", "Room Service"],
    images: ["/placeholder.svg?height=300&width=500"],
  },
  {
    id: "4",
    name: "Standard Twin Room",
    description: "Comfortable room with two twin beds",
    capacity: 2,
    pricePerNight: 149,
    amenities: ["Free WiFi", "TV", "Coffee Maker"],
    images: ["/placeholder.svg?height=300&width=500"],
  },
];

const getAmenityIcon = (amenity: string) => {
  switch (amenity) {
    case "Free WiFi":
      return <Wifi className="w-4 h-4" />;
    case "TV":
      return <Tv className="w-4 h-4" />;
    case "Coffee Maker":
      return <Coffee className="w-4 h-4" />;
    case "Room Service":
      return <UtensilsCrossed className="w-4 h-4" />;
    default:
      return null;
  }
};

export default function RoomsPage() {
  return (
    <div className="container py-8 mx-auto">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="mb-2 text-3xl font-bold">Our Rooms</h1>
        <p className="max-w-2xl text-center text-muted-foreground">
          Discover our selection of comfortable and luxurious rooms, designed to
          make your stay memorable.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden">
            <div className="relative w-full h-48">
              <Image
                src={room.images[0] || "/placeholder.svg"}
                alt={room.name}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{room.name}</CardTitle>
              <CardDescription>{room.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Up to {room.capacity} guests
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {room.amenities.slice(0, 4).map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-muted"
                  >
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>

              <div className="text-xl font-bold">
                {formatCurrency(room.pricePerNight)}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  / night
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/rooms/${room.id}`} className="w-full">
                <Button className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
