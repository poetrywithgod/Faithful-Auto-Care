import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AboutSection = () => {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="relative w-full md:w-1/2">
            <div className="absolute rounded-xl z-0 w-[391px] h-[383px] bg-[#A8D4F5] rotate-[8deg] transform"></div>

            <img
              src="/washing.jpg"
              alt="Car Wash"
              className="relative z-10 w-full max-w-[383px] h-[366px] object-cover rounded-xl shadow-lg"
            />

            <div className="absolute bottom-4 right-4 z-20 w-[136px] h-[67px] bg-[#A8D4F5] rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-black shadow-md">
              <Car className="w-5 h-5" />
              <span className="text-left leading-tight text-xs">
                21 years of<br />
                quality<br />
                service
              </span>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <h2 className="text-gray-800 text-3xl md:text-4xl font-semibold mb-4">
              Professional Car Care You Can Trust
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We provide expert car washing and detailing services designed to
              keep your vehicle spotless, protected, and refreshed. From quick
              washes to full detailing, our team uses premium products and
              eco-friendly techniques to ensure every car gets thorough care,
              lasting shine, and a smooth, hassle-free experience.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-8 rounded-lg">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
