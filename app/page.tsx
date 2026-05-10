import Image from "next/image";
import Hero from "./_components/Hero";
import Header from "./_components/Header";
import AboutUs from "./_components/AboutUs";
import Timeline from "./_components/Timeline";
import Guidebook from "./_components/Guidebook";
import Faq from "./_components/Faq";
import Footer from "./_components/Footer";
export default function Home() {
  return (
    <div className="flex flex-col items-center w-full overflow-hidden bg-[#0c0e17]">
      {/* Header */}
      <Header />

      {/* Hero content */}
      <Hero />

      {/* About Us */}
      <AboutUs />



      {/* Timeline */}
      <Timeline />

      {/* Decorative Buah */}
      <div className="w-full flex justify-start py-10 relative z-10 pointer-events-none">
        <Image src="/images/ASSET/Buah.png" alt="Buah" width={285} height={285} className="absolute rotate-12 object-contain drop-shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:scale-110 transition-transform duration-500 pointer-events-auto" unoptimized />
      </div>

      {/* Guidebook */}
      <Guidebook />

      {/* Decorative Hotdog */}
      <div className="w-full  flex justify-end rotate-6  py-10 relative z-10 pointer-events-none">
        <Image src="/images/ASSET/Hotdog.png" alt="Hotdog" width={320} height={320} className="object-contain absolute drop-shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:rotate-12 transition-transform duration-500 pointer-events-auto" unoptimized />
      </div>

      {/* FAQ */}
      <Faq />

      {/* Footer */}
      <Footer />
    </div>
  );
}
