import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, BedDouble, CalendarCheck, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto">
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Welcome to HotelWeb
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Your complete hotel management solution for customers and
                administrators
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/rooms">
                <Button size="lg" variant="secondary">
                  Browse Rooms
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <BedDouble className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Room Booking</CardTitle>
              <CardDescription>
                Browse and book from our selection of premium rooms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Find the perfect accommodation for your stay with our
                easy-to-use booking system.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/rooms">
                <Button variant="secondary" size="sm">
                  View Rooms
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CalendarCheck className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Manage Reservations</CardTitle>
              <CardDescription>
                View and manage your current and past bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Keep track of all your reservations and manage your stay details
                in one place.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/bookings">
                <Button variant="secondary" size="sm">
                  My Bookings
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Admin Controls</CardTitle>
              <CardDescription>
                Comprehensive tools for hotel administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Manage rooms, reservations, and hotel operations with our
                powerful admin dashboard.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/admin">
                <Button variant="secondary" size="sm">
                  Admin Portal
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
