import { Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const AboutSection = () => {
  const navigate = useNavigate();
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="text-center mb-12 opacity-0 animate-slideUp">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">About Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your trusted partner in professional car care
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="relative w-full md:w-1/2 flex justify-center opacity-0 animate-slideInLeft animation-delay-200">
            <div className="absolute rounded-xl z-0 w-[280px] sm:w-[391px] h-[280px] sm:h-[383px] bg-[#A8D4F5] rotate-[8deg] transform"></div>

            <img
              src="/washing.jpg"
              alt="Car Wash"
              className="relative z-10 w-full max-w-[280px] sm:max-w-[383px] h-[270px] sm:h-[366px] object-cover rounded-xl shadow-lg"
            />

            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-20 w-[120px] sm:w-[136px] h-[60px] sm:h-[67px] bg-[#A8D4F5] rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-black shadow-md animate-float">
              <Car className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-left leading-tight text-[10px] sm:text-xs">
                21 years of<br />
                quality<br />
                service
              </span>
            </div>
          </div>

          <div className="w-full md:w-1/2 opacity-0 animate-slideInRight animation-delay-300">
            <h2 className="text-gray-800 text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
              Professional Car Care You Can Trust
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We provide expert car washing and detailing services designed to
              keep your vehicle spotless, protected, and refreshed. From quick
              washes to full detailing, our team uses premium products and
              eco-friendly techniques to ensure every car gets thorough care,
              lasting shine, and a smooth, hassle-free experience.
            </p>
            <Button
              onClick={() => navigate('/book-now')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-8 rounded-lg hover:scale-105 transition-transform"
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
