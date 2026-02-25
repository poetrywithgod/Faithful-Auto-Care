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
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the difference with our commitment to excellence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <reason.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                {reason.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
