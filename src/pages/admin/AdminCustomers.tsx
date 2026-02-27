import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface Customer {
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  totalBookings: number;
  lastBooking: string;
  totalSpent: number;
  status: string;
}

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [topCustomers, setTopCustomers] = useState<{ name: string; bookings: number; spent: number }[]>([]);

  useEffect(() => {
    fetchCustomers();

    const bookingsSubscription = supabase
      .channel('admin-customers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchCustomers();
      })
      .subscribe();

    return () => {
      bookingsSubscription.unsubscribe();
    };
  }, []);

  const fetchCustomers = async () => {
    const { data: bookings } = await supabase.from("bookings").select("*");

    if (bookings) {
      const customerMap = new Map<string, Customer>();

      bookings.forEach((booking) => {
        const email = booking.customer_email;
        if (!customerMap.has(email)) {
          customerMap.set(email, {
            name: booking.customer_name,
            email: booking.customer_email,
            phone: booking.customer_phone,
            memberSince: booking.created_at?.split("T")[0] || "2026-01-01",
            totalBookings: 0,
            lastBooking: booking.booking_date,
            totalSpent: 0,
            status: "confirmed",
          });
        }

        const customer = customerMap.get(email)!;
        customer.totalBookings += 1;
        customer.totalSpent += booking.service_price || 0;
        if (booking.booking_date > customer.lastBooking) {
          customer.lastBooking = booking.booking_date;
        }
      });

      const customerList = Array.from(customerMap.values());
      setCustomers(customerList);

      const top = customerList
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 3)
        .map((c) => ({
          name: c.name,
          bookings: c.totalBookings,
          spent: c.totalSpent,
        }));
      setTopCustomers(top);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Customer Database</h1>
          <p className="text-sm md:text-base text-gray-600">View customer profiles and bookings</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name or email"
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select className="flex-1 sm:flex-initial rounded-lg border border-gray-300 px-3 md:px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>All Types</option>
            </select>
            <select className="flex-1 sm:flex-initial rounded-lg border border-gray-300 px-3 md:px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>All Status</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Member Since
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total Booking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Last Booking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredCustomers.map((customer, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <p className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                        {customer.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{customer.phone}</p>
                        <p className="text-gray-500">{customer.email}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {customer.memberSince}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {customer.totalBookings}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {customer.lastBooking}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      €{customer.totalSpent}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                        Confirmed
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Top Customers</h2>
          <div className="space-y-3 md:space-y-4">
            {topCustomers.map((customer, index) => (
              <Card key={index} className="p-4 md:p-6 bg-blue-50">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                      #{index + 1} {customer.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600">{customer.bookings} Bookings</p>
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-blue-600 whitespace-nowrap">€{customer.spent}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
