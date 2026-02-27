import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Edit, Copy, Trash2, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  is_active: boolean;
}

export const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, revenue: 0 });

  useEffect(() => {
    fetchServices();

    const servicesSubscription = supabase
      .channel('admin-services')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        fetchServices();
      })
      .subscribe();

    return () => {
      servicesSubscription.unsubscribe();
    };
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase.from("services").select("*");

    if (data) {
      const parsedServices = data.map((service) => ({
        ...service,
        features: Array.isArray(service.features) ? service.features : [],
      }));
      setServices(parsedServices);
      setStats({
        total: data.length,
        active: data.filter((s) => s.is_active).length,
        revenue: 2500,
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Service Management</h1>
            <p className="mt-1 text-sm md:text-base text-gray-600">Add, Edit, & Disable Service</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <Card className="p-4 md:p-6 text-center">
            <p className="text-sm font-medium text-gray-600">Total Service</p>
            <p className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">{stats.total}</p>
          </Card>
          <Card className="p-4 md:p-6 text-center">
            <p className="text-sm font-medium text-gray-600">Active</p>
            <p className="mt-2 text-3xl md:text-4xl font-bold text-green-600">{stats.active}</p>
          </Card>
          <Card className="p-4 md:p-6 text-center">
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">€{stats.revenue}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">{service.name}</h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{service.description}</p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={service.is_active}
                        className="peer sr-only"
                        readOnly
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <p className="text-2xl font-bold text-gray-900">€{service.price}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration} min</span>
                  </div>
                </div>

                <ul className="mt-4 space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <span className="mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center gap-2 border-t pt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
