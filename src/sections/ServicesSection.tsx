import { Wrench, Droplets, Wind } from "lucide-react";

export const ServicesSection = () => {
  const services = [
    {
      icon: Wrench,
      title: "Tyre & Rim Care",
      description:
        "Specialized cleaning and conditioning for tyres and rims, restoring their shine and protecting against wear.",
    },
    {
      icon: Droplets,
      title: "Engine Bay Care",
      description:
        "Thorough cleaning and degreasing of the engine compartment, enhancing performance and extending engine life.",
    },
    {
      icon: Wind,
      title: "Cabin Deep Clean",
      description:
        "Complete interior detailing including vacuuming, shampooing, and sanitizing for a fresh and healthy cabin.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Professional car care services tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <service.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
