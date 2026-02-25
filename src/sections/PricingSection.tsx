import { Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const PricingSection = () => {
  const pricingPlans = [
    {
      title: "Basic Wash",
      price: "£10",
      features: [
        "Exterior hand wash",
        "Basic tyre cleaning",
        "Window cleaning",
        "Quick interior vacuum",
      ],
    },
    {
      title: "Premium Wash",
      price: "£25",
      features: [
        "Exterior hand wash",
        "Basic tyre cleaning",
        "Window cleaning",
        "Quick interior vacuum",
        "Interior polish & finish",
        "Tyre & rim care",
        "Engine bay care",
        "Ultimate shine & protection",
      ],
      featured: true,
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Pricing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the perfect package for your vehicle
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`w-full max-w-[320px] bg-white rounded-xl shadow-lg ${
                plan.featured ? "ring-2 ring-blue-600" : ""
              }`}
            >
              <CardHeader className="px-6 pt-6 pb-4">
                <div className="flex flex-col gap-2">
                  <h3 className="font-poppins font-semibold text-[#020a1f] text-xl">
                    {plan.title}
                  </h3>
                  <p className="font-poppins font-bold text-[#020a1f] text-2xl">
                    {plan.price}
                  </p>
                </div>
              </CardHeader>

              <Separator className="mx-auto w-[90%]" />

              <CardContent className="px-6 pt-6 pb-8">
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="w-5 h-5 flex-shrink-0 text-green-600 mt-0.5" />
                      <span className="font-poppins text-gray-700 text-base">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
