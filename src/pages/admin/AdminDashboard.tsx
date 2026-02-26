import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Euro, Users, TrendingUp, AlertTriangle, Clock, CheckCircle, AlertCircle, Star, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Stats {
  totalBookings: number;
  revenue: number;
  totalCustomers: number;
  avgRating: number;
  completionRate: number;
  cancellationRate: number;
  satisfaction: number;
}

interface Booking {
  id: string;
  customer_name: string;
  booking_time: string;
  service_type: string;
  vehicle_type: string;
  service_price: number;
  status: string;
  customer_phone: string;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    revenue: 0,
    totalCustomers: 0,
    avgRating: 0,
    completionRate: 0,
    cancellationRate: 0,
    satisfaction: 0,
  });
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState("appointments");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data: bookings } = await supabase.from("bookings").select("*");

    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("status", "approved");

    if (bookings) {
      const totalBookings = bookings.length;
      const revenue = bookings.reduce((sum, b) => sum + (b.service_price || 0), 0);
      const uniqueCustomers = new Set(bookings.map(b => b.customer_email)).size;
      const confirmed = bookings.filter(b => b.status === "confirmed").length;
      const cancelled = bookings.filter(b => b.status === "cancelled").length;

      const avgRating = reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      setStats({
        totalBookings,
        revenue,
        totalCustomers: uniqueCustomers,
        avgRating: Math.round(avgRating * 10) / 10,
        completionRate: totalBookings > 0 ? Math.round((confirmed / totalBookings) * 100) : 0,
        cancellationRate: totalBookings > 0 ? Math.round((cancelled / totalBookings) * 100) : 0,
        satisfaction: avgRating,
      });

      setUpcomingBookings(bookings.slice(0, 3) as Booking[]);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Today</Button>
            <Button variant="outline" size="sm">This Week</Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">This Month</Button>
          </div>
        </div>

        <p className="text-gray-600">Welcome back! Here is your business review</p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                <p className="mt-1 text-sm text-green-600">+9.2% (30 days)</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">€{stats.revenue.toLocaleString()}</p>
                <p className="mt-1 text-sm text-green-600">+85.2% (30 days)</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Euro className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customer</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
                <p className="mt-1 text-sm text-green-600">+46.2% (30 days)</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.avgRating}</p>
                <p className="mt-1 text-sm text-gray-500">Based on review</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="bg-yellow-50 p-6 border-yellow-200">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Customer Review</h3>
                <p className="mt-1 text-sm text-gray-700">
                  You have 3 customers review, pending and waiting for your approval
                </p>
                <p className="mt-1 text-xs text-gray-500">2 hours ago</p>
                <Button size="sm" className="mt-3 bg-yellow-600 hover:bg-yellow-700">
                  Action required
                </Button>
              </div>
            </div>
          </Card>

          <Card className="bg-red-50 p-6 border-red-200">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">No Show Rate</h3>
                <p className="mt-1 text-sm text-gray-700">
                  Current no show rate is 10%, consider monitoring and follow up
                </p>
                <Button size="sm" className="mt-3 bg-red-600 hover:bg-red-700">
                  Monitor
                </Button>
              </div>
            </div>
          </Card>

          <Card className="bg-orange-50 p-6 border-orange-200">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Peak Hours</h3>
                <p className="mt-1 text-sm text-gray-700">
                  Peak Hours : Fri 10am -3pm<br />
                  Sat 8am - 7pm
                </p>
                <Button size="sm" className="mt-3 bg-orange-600 hover:bg-orange-700">
                  11am - 1pm
                </Button>
              </div>
            </div>
          </Card>

          <Card className="bg-green-50 p-6 border-green-200">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">System Health</h3>
                <p className="mt-1 text-sm text-gray-700">
                  The system is running smoothly with no issues detected.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center gap-4 border-b pb-0">
              <button
                onClick={() => setActiveTab("appointments")}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === "appointments"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Upcoming Appointments
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === "analytics"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Weekly Analytics
              </button>
            </div>

            {activeTab === "appointments" && (
              <div className="mt-4 space-y-4">
                {upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">{booking.customer_name}</p>
                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {booking.booking_time}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Service</p>
                          <p className="font-medium text-gray-900">{booking.service_type}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Vehicle</p>
                          <p className="font-medium text-gray-900">{booking.vehicle_type}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      booking.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{booking.customer_phone}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">£ {booking.service_price}</p>
                      <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="mt-4 space-y-6">
                <div>
                  <h3 className="mb-4 text-sm font-semibold text-gray-900">Daily Revenue</h3>
                  <div className="flex items-end justify-between gap-2" style={{ height: "200px" }}>
                    {[
                      { day: "Mon", value: 120, label: "120" },
                      { day: "Tue", value: 200, label: "200" },
                      { day: "Wed", value: 140, label: "140" },
                      { day: "Thur", value: 80, label: "80" },
                      { day: "Fri", value: 70, label: "70" },
                      { day: "Sat", value: 110, label: "110" },
                      { day: "Sun", value: 130, label: "130" },
                    ].map((item, index) => (
                      <div key={index} className="flex flex-1 flex-col items-center">
                        <div className="relative w-full">
                          <div
                            className="w-full rounded-t bg-blue-600"
                            style={{ height: `${item.value}px` }}
                          />
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-600">
                            {item.label}
                          </span>
                        </div>
                        <span className="mt-2 text-xs text-gray-600">{item.day}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded bg-blue-600" />
                      <span className="text-gray-600">Revenue</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-yellow-100 p-3 text-center">
                    <span className="text-xs text-gray-600">Bookings</span>
                  </div>
                  <div className="rounded-lg bg-purple-100 p-3 text-center">
                    <span className="text-xs text-gray-600">Customer</span>
                  </div>
                </div>

                <div>
                  <div className="relative" style={{ height: "200px" }}>
                    <svg className="h-full w-full">
                      <polyline
                        fill="none"
                        stroke="#EAB308"
                        strokeWidth="2"
                        points="0,120 60,80 120,100 180,70 240,60 300,70 360,60"
                      />
                      <polyline
                        fill="none"
                        stroke="#9333EA"
                        strokeWidth="2"
                        points="0,160 60,150 120,140 180,130 240,110 300,120 360,100"
                      />
                    </svg>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t pt-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Booking (This week)</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">45</p>
                    <p className="text-xs text-gray-500">Average: 6 per day</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue (This week)</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">£ 1,389</p>
                    <p className="text-xs text-gray-500">Average: £348 per day</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Customer (This week)</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">31</p>
                    <p className="text-xs text-gray-500">Average: 10 per day</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="text-center">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="mt-4 text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="mt-2 text-4xl font-bold text-gray-900">{stats.completionRate}%</p>
                <p className="mt-1 text-sm text-green-600">+5.2% (30 days)</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <p className="mt-4 text-sm font-medium text-gray-600">Cancellation Rate</p>
                <p className="mt-2 text-4xl font-bold text-gray-900">{stats.cancellationRate}%</p>
                <p className="mt-1 text-sm text-green-600">-3.2% (30 days)</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-yellow-100">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <p className="mt-4 text-sm font-medium text-gray-600">Customer Satisfaction</p>
                <p className="mt-2 text-4xl font-bold text-gray-900">{stats.satisfaction}/5</p>
                <p className="mt-1 text-sm text-green-600">+0.2% (30 days)</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
