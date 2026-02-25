import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <>
      <nav className="fixed top-0 left-0 z-50 w-full">
        <div className="mx-auto mt-6 max-w-7xl px-6">
          <div className="flex h-14 items-center justify-between rounded-xl bg-[#D6EAF84D] backdrop-blur-md px-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Faithful Auto Care Logo"
                className="h-10 w-auto"
              />
              <span className="text-lg text-blue-900 font-semibold uppercase tracking-wide">
                Faithful Auto Care
              </span>
            </div>

            <ul className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-700">
              <li className="cursor-pointer hover:text-blue-600 transition">Home</li>
              <li className="cursor-pointer hover:text-blue-600 transition">About Us</li>
              <li className="cursor-pointer hover:text-blue-600 transition">Services</li>
              <li className="cursor-pointer hover:text-blue-600 transition">Process</li>
              <li className="cursor-pointer hover:text-blue-600 transition">Price</li>
            </ul>

            <div className="flex items-center gap-3">
              <Button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                <MessageCircle className="w-4 h-4" /> Chat us
              </Button>
              <Button className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
                <Phone className="w-4 h-4" /> Call
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section
        className="relative flex h-screen w-full items-center bg-cover bg-center"
        style={{ backgroundImage: "url('/LandingPage1.png')" }}
      >
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              <span className="block">Professional shine.</span>
              <span className="block mt-3">Exceptional care.</span>
            </h1>

            <p className="text-base md:text-lg font-medium leading-relaxed text-gray-200 mb-8 max-w-lg">
              Where every wash restores that brand new feeling, leaving your car
              spotless, refreshed, ready to own the road with confidence.
            </p>

            <Button className="rounded-lg bg-blue-600 px-8 py-6 text-base font-semibold hover:bg-blue-700">
              Book Now
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
