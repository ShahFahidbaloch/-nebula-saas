import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Login from "@/components/sections/Login";
import Features from "@/components/sections/Features";
import ScrollGallery from "@/components/sections/ScrollGallery";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Login />
      <Features />
      <ScrollGallery />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
