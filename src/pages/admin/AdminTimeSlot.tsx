import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TimeSlot {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  capacity: number;
  is_active: boolean;
}

interface BlockedTime {
  id: string;
  day_of_week: string;
  blocked_time: string;
  reason: string;
}

export const AdminTimeSlot = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchTimeSlots();
    fetchBlockedTimes();
    fetchBookingCounts();
  }, []);

  const fetchTimeSlots = async () => {
    const { data } = await supabase.from("time_slots").select("*").order("day_of_week");

    if (data) {
      const sortedData = data.sort((a, b) => {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        return days.indexOf(a.day_of_week) - days.indexOf(b.day_of_week);
      });
      setTimeSlots(sortedData as TimeSlot[]);
    }
  };

  const fetchBlockedTimes = async () => {
    const { data } = await supabase.from("blocked_times").select("*");
    if (data) {
      setBlockedTimes(data as BlockedTime[]);
    }
  };

  const fetchBookingCounts = async () => {
    const { data } = await supabase.from("bookings").select("booking_date");
    if (data) {
      const counts: Record<string, number> = {};
      data.forEach((booking) => {
        const date = new Date(booking.booking_date);
        const day = date.toLocaleDateString("en-US", { weekday: "long" });
        counts[day] = (counts[day] || 0) + 1;
      });
      setBookingCounts(counts);
    }
  };

  const handleEdit = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setShowEditModal(true);
  };

  const handleDeleteBlockedTime = async (id: string) => {
    await supabase.from("blocked_times").delete().eq("id", id);
    fetchBlockedTimes();
  };

  const totalCapacity = timeSlots.reduce((sum, slot) => sum + slot.capacity, 0);
  const totalBookings = Object.values(bookingCounts).reduce((sum, count) => sum + count, 0);
  const avgOccupancy = totalCapacity > 0 ? ((totalBookings / totalCapacity) * 100).toFixed(1) : "0";
  const daysOpen = timeSlots.filter((slot) => slot.is_active).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Time Management</h1>
            <p className="mt-1 text-gray-600">Edit, Delete & Mange Time Schedule</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Time
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <p className="text-sm font-medium text-gray-600">Weekly Capacity</p>
            <p className="mt-2 text-4xl font-bold text-gray-900">{totalCapacity}</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-sm font-medium text-gray-600">Current Bookings</p>
            <p className="mt-2 text-4xl font-bold text-gray-900">{totalBookings}</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-sm font-medium text-gray-600">Average Occupancy</p>
            <p className="mt-2 text-4xl font-bold text-gray-900">{avgOccupancy}%</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-sm font-medium text-gray-600">Days Open</p>
            <p className="mt-2 text-4xl font-bold text-gray-900">{daysOpen} days</p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Operation Hours / Capacity</h2>
          <div className="space-y-4">
            {timeSlots.map((slot) => {
              const booked = bookingCounts[slot.day_of_week] || 0;
              const percentage = slot.capacity > 0 ? (booked / slot.capacity) * 100 : 0;

              return (
                <div key={slot.id} className="flex items-center gap-4">
                  <div className="w-24">
                    <p className="text-sm font-medium text-gray-900">{slot.day_of_week}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>⏱</span>
                    <span>
                      {slot.start_time} - {slot.end_time}
                    </span>
                  </div>
                  <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    Capacity: {slot.capacity}
                  </div>
                  <div className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                    Booked: {booked}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-auto"
                    onClick={() => handleEdit(slot)}
                  >
                    Edit
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {slot.is_active ? "Active" : "Inactive"}
                    </span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" checked={slot.is_active} className="peer sr-only" readOnly />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                    </label>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-blue-600 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="mt-1 text-right text-xs text-gray-500">{percentage.toFixed(0)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Blocked Service</h2>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowBlockModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Blocked Time
            </Button>
          </div>
          <div className="space-y-3">
            {blockedTimes.map((blocked) => (
              <div
                key={blocked.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⛔</span>
                  <div>
                    <p className="font-medium text-gray-900">
                      {blocked.day_of_week} {blocked.blocked_time}
                    </p>
                    <p className="text-sm text-gray-600">{blocked.reason}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteBlockedTime(blocked.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-blue-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Peak Hour Analysis</h2>
          <p className="text-sm text-gray-600 mb-4">According to your bookings peak hours are:</p>
          <ul className="space-y-2">
            <li className="flex items-start text-sm text-gray-700">
              <span className="mr-2">•</span>
              <span>Monday & Tuesdays - 87% - 92% Occupancy</span>
            </li>
            <li className="flex items-start text-sm text-gray-700">
              <span className="mr-2">•</span>
              <span>8:00am -10:00 am & 18:00 - 20:00 - Highest Demand Period</span>
            </li>
            <li className="flex items-start text-sm text-gray-700">
              <span className="mr-2">•</span>
              <span>Wednesday - Lowest Occupancy 50%</span>
            </li>
          </ul>
        </Card>
      </div>

      {showEditModal && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Operation Hours</h3>
              <button onClick={() => setShowEditModal(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Add, edit & manage operating time and capacity slots</p>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Day</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2">
                  <option>{selectedSlot.day_of_week}</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>
                  <Input type="time" defaultValue={selectedSlot.start_time} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">End Time</label>
                  <Input type="time" defaultValue={selectedSlot.end_time} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Capacity</label>
                <Input type="number" defaultValue={selectedSlot.capacity} />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Block Service</h3>
              <button onClick={() => setShowBlockModal(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Add, edit & manage operating time and capacity slots</p>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Day</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2">
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                  <option>Sunday</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Blocked Time</label>
                <Input type="text" placeholder="e.g. 8:00am" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Reason</label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Write here"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowBlockModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
};
