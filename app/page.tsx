import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhatIs from "./components/WhatIs";
import WhyWalletera from "./components/WhyWalletera";
import Capabilities from "./components/Capabilities";
import HowItWorks from "./components/HowItWorks";
import UseCases from "./components/UseCases";
import DeveloperExperience from "./components/DeveloperExperience";
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
        <Capabilities />
        <HowItWorks />
        <UseCases />
        <DeveloperExperience />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
