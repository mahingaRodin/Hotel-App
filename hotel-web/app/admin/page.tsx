"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BedDouble, CalendarCheck, DollarSign, Users } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rooms</CardTitle>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+12 since last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Room Management</CardTitle>
                <CardDescription>
                  Add, edit, or remove rooms from your hotel inventory.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/admin/rooms"
                    className="text-primary hover:underline"
                  >
                    View all rooms
                  </Link>
                  <Link
                    href="/admin/rooms/new"
                    className="text-primary hover:underline"
                  >
                    Add new room
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Reservation Management</CardTitle>
                <CardDescription>
                  View and manage all current and upcoming reservations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/admin/reservations"
                    className="text-primary hover:underline"
                  >
                    View all reservations
                  </Link>
                  <Link
                    href="/admin/reservations/pending"
                    className="text-primary hover:underline"
                  >
                    Pending reservations
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage customer accounts and admin users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/admin/users"
                    className="text-primary hover:underline"
                  >
                    View all users
                  </Link>
                  <Link
                    href="/admin/users/new"
                    className="text-primary hover:underline"
                  >
                    Add new admin
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                View detailed analytics about your hotel performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Analytics dashboard coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Generate and download reports about your hotel operations.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Reports dashboard coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                View and manage system notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">No new notifications</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
