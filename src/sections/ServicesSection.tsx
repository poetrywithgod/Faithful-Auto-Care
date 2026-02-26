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
    <section id="services" className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Professional car care services tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 sm:p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <service.icon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                {service.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
