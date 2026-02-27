import { Droplets, Car, Trash2 } from "lucide-react";

export const ServicesSection = () => {
  const services = [
    {
      icon: Droplets,
      title: "Tyre & Rim Care",
      description:
        "We remove dirt, brake dust, and grime while applying premium treatments to restore shine and protect surfaces.",
      image: "https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      icon: Car,
      title: "Engine Bay Care",
      description:
        "We carefully remove grease, dirt, and grime using specialized tools and eco-friendly degreasers, ensuring no damage",
      image: "https://images.pexels.com/photos/4488662/pexels-photo-4488662.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      icon: Trash2,
      title: "Cabin Deep Clean",
      description:
        "We carefully vacuum carpets, seats, and floor mats, wipe dashboards, and clean vents to remove dirt, and allergens",
      image: "https://images.pexels.com/photos/5247965/pexels-photo-5247965.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 opacity-0 animate-slideUp">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Professional car care services tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105 opacity-0 animate-scaleIn animation-delay-${(index + 1) * 200}`}
            >
              <div className="relative h-48 sm:h-56">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-4 w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <service.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
