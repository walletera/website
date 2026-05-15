import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhatIs from "./components/WhatIs";
import WhyWalletera from "./components/WhyWalletera";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhatIs />
        <WhyWalletera />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
