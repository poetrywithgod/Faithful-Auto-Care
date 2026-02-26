import { Clock, Award, Shield } from "lucide-react";

export const WhyChooseUsSection = () => {
  const reasons = [
    {
      icon: Clock,
      title: "Convenience",
      description:
        "Flexible scheduling, quick turnaround times, and multiple service locations to fit your busy lifestyle.",
    },
    {
      icon: Award,
      title: "Quality",
      description:
        "Premium products, skilled technicians, and attention to detail ensure your vehicle receives the best care possible.",
    },
    {
      icon: Shield,
      title: "Consistency",
      description:
        "Reliable service every single time. Our proven processes deliver consistent, exceptional results you can count on.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Why Choose Us
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Experience the difference with our commitment to excellence
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <reason.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>

              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
                {reason.title}
              </h3>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
