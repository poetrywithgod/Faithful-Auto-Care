import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreVertical, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  date_joined: string;
  services_completed: number;
  rating: number;
  status: string;
}

export const AdminTeams = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [stats, setStats] = useState({ total: 0, active: 0, technicians: 0, bookingOfficers: 0 });
  const [topPerformers, setTopPerformers] = useState<{ name: string; bookings: number; revenue: number }[]>([]);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .order("rating", { ascending: false });

    if (data) {
      setTeamMembers(data as TeamMember[]);
      setStats({
        total: data.length,
        active: data.filter((m) => m.status === "active").length,
        technicians: data.filter((m) => m.role === "Technician").length,
        bookingOfficers: data.filter((m) => m.role === "Booking Officer").length,
      });

      const top = data
        .slice(0, 3)
        .map((m) => ({
          name: m.name,
          bookings: m.services_completed,
          revenue: m.services_completed * 50,
        }));
      setTopPerformers(top);
    }
  };

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || member.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
            <p className="mt-1 text-gray-600">Manage team member & assign roles</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <p className="text-sm font-medium text-gray-600">Total Members</p>
            <p className="mt-2 text-4xl font-bold text-gray-900">{stats.total}</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-sm font-medium text-gray-600">Active</p>
            <p className="mt-2 text-4xl font-bold text-green-600">{stats.active}</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-sm font-medium text-gray-600">Wash Technician</p>
            <p className="mt-2 text-4xl font-bold text-gray-900">{stats.technicians}</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-sm font-medium text-gray-600">Booking Officer</p>
            <p className="mt-2 text-4xl font-bold text-gray-900">{stats.bookingOfficers}</p>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Service completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ratings
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
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{member.phone}</p>
                        <p className="text-gray-500">{member.email}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {member.date_joined}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{member.role}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {member.services_completed}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {member.rating}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          member.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Performer This Week</h2>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <Card key={index} className="p-6 bg-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      #{index + 1} {performer.name}
                    </h3>
                    <p className="text-sm text-gray-600">{performer.bookings} Bookings</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">€{performer.revenue}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
