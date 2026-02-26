import { Routes, Route } from "react-router-dom";
import { HeroSection } from "./sections/HeroSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { AboutSection } from "./sections/AboutSection";
import { ServicesSection } from "./sections/ServicesSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { WhyChooseUsSection } from "./sections/WhyChooseUsSection";
import { StatisticsSection } from "./sections/StatisticsSection";
import { PricingSection } from "./sections/PricingSection";
import { ReviewsSection } from "./sections/ReviewsSection";
import { FAQSection } from "./sections/FAQSection";
import { FooterSection } from "./sections/FooterSection";
import { BookingPage } from "./pages/BookingPage";
import ViewBookingsPage from "./pages/ViewBookingsPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminBookings } from "./pages/admin/AdminBookings";
import { AdminCustomers } from "./pages/admin/AdminCustomers";
import { AdminServices } from "./pages/admin/AdminServices";
import { AdminReviews } from "./pages/admin/AdminReviews";

function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <ServicesSection />
      <HowItWorksSection />
      <WhyChooseUsSection />
      <StatisticsSection />
      <PricingSection />
      <ReviewsSection />
      <FAQSection />
      <FooterSection />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/book-now" element={<BookingPage />} />
      <Route path="/view-bookings" element={<ViewBookingsPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/bookings" element={<AdminBookings />} />
      <Route path="/admin/customers" element={<AdminCustomers />} />
      <Route path="/admin/services" element={<AdminServices />} />
      <Route path="/admin/reviews" element={<AdminReviews />} />
    </Routes>
  );
}

export default App;
