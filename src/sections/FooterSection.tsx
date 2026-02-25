import { Phone, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export const FooterSection = () => {
  const contactInfo = [
    {
      icon: Phone,
      text: "+44 20 7946 0958",
    },
    {
      icon: MapPin,
      text: "27 Kensington High Street, London W8 5NP, United Kingdom",
    },
    {
      icon: Mail,
      text: "info@faithfulautocare.co.uk",
    },
  ];

  const companyLinks = ["About", "Company", "Blog", "Employee Handbook"];
  const legalLinks = ["Terms of service", "Privacy Policy", "Cookies Policy"];

  return (
    <footer className="relative w-full bg-[#002855] px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <img
                className="w-24 h-24 object-cover rounded-full"
                alt="Faithful Auto Care Logo"
                src="/logo.png"
              />
              <h2 className="font-poppins font-bold text-white text-2xl md:text-3xl">
                FAITHFUL AUTO CARE
              </h2>
            </div>

            <p className="max-w-md font-poppins text-white text-sm leading-7">
              We are a professional car care brand dedicated to delivering
              spotless results, premium detailing, and a seamless customer
              experience
            </p>

            <div className="flex flex-col gap-5">
              {contactInfo.map((contact, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <contact.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-poppins text-white text-sm">
                    {contact.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <h3 className="font-poppins font-semibold text-white text-xl mb-2">
                Company
              </h3>
              <nav className="flex flex-col gap-2">
                {companyLinks.map((link, index) => (
                  <a
                    key={index}
                    href="#"
                    className="font-poppins text-white text-sm hover:text-blue-300 transition"
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-poppins font-semibold text-white text-xl mb-2">
                Legal
              </h3>
              <nav className="flex flex-col gap-2">
                {legalLinks.map((link, index) => (
                  <a
                    key={index}
                    href="#"
                    className="font-poppins text-white text-sm hover:text-blue-300 transition"
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-8 max-w-md">
          <h3 className="font-poppins font-bold text-white text-xl mb-4">
            Newsletter
          </h3>
          <p className="font-poppins text-white text-sm mb-6">
            Subscribe to our newsletter for the latest updates.
          </p>
          <div className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="Your Email"
              className="bg-white text-gray-800 font-poppins rounded-xl px-4 py-6 h-auto"
            />
            <Button className="bg-[#020a1f] text-white font-poppins rounded-xl px-6 py-6 h-auto hover:bg-[#020a1f]/90">
              Subscribe Now
            </Button>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        <div className="flex justify-center text-white text-sm">
          <p>© 2026 Faithful Auto Care. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
