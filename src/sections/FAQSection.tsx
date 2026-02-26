import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  const faqs = [
    {
      question: "What services do you offer?",
      answer:
        "We offer a complete range of car care services including exterior washing, interior detailing, engine bay cleaning, tyre and rim care, and protective treatments. Our packages range from basic washes to premium full-detail services.",
    },
    {
      question: "How long does a car wash take?",
      answer:
        "A basic wash typically takes 15-20 minutes, while our premium detailing service can take 2-3 hours depending on your vehicle's condition and size. We always prioritize quality over speed.",
    },
    {
      question: "Do you use eco-friendly products?",
      answer:
        "Yes! We're committed to environmental responsibility. We use plant-based, biodegradable cleaning products and recycle 80% of our water through advanced filtration systems.",
    },
    {
      question: "Can I book an appointment online?",
      answer:
        "Absolutely! You can book appointments through our website or mobile app. We also accept walk-ins, though appointments ensure faster service and your preferred time slot.",
    },
    {
      question: "Do you offer mobile car wash services?",
      answer:
        "Yes, we offer mobile car wash services for your convenience. Our team can come to your location with all necessary equipment. Additional charges may apply depending on distance.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center mb-8 sm:mb-12 opacity-0 animate-slideUp">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 px-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Find answers to common questions about our services
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-gray-800">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
