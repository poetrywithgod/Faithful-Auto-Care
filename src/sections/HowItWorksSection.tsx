import { Calendar, Wrench, Sparkles } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      icon: Calendar,
      number: "01",
      title: "Book Online",
      description:
        "Schedule your appointment through our easy-to-use online booking system. Choose your preferred date, time, and service package.",
    },
    {
      icon: Wrench,
      number: "02",
      title: "We Wash",
      description:
        "Our expert team uses premium products and proven techniques to thoroughly clean, detail, and protect your vehicle.",
    },
    {
      icon: Sparkles,
      number: "03",
      title: "Enjoy the Shine",
      description:
        "Drive away with a spotless, refreshed vehicle that looks and feels brand new. Guaranteed satisfaction every time.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Three simple steps to a pristine vehicle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center p-8"
            >
              <div className="absolute top-0 right-0 text-6xl font-bold text-gray-100">
                {step.number}
              </div>

              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6 relative z-10">
                <step.icon className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                {step.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
