import { Users, Car, Award, Heart } from "lucide-react";

export const StatisticsSection = () => {
  const stats = [
    {
      icon: Users,
      number: "10,000+",
      label: "Happy Customers",
    },
    {
      icon: Car,
      number: "50,000+",
      label: "Cars Washed",
    },
    {
      icon: Award,
      number: "21",
      label: "Years Experience",
    },
    {
      icon: Heart,
      number: "98%",
      label: "Satisfaction Rate",
    },
  ];

  return (
    <section className="py-20 bg-[#002855]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-4xl font-bold text-white mb-2">
                {stat.number}
              </h3>

              <p className="text-gray-300 text-sm font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
