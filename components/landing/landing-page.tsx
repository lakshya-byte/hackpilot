"use client";

import SmoothScroll from "./smooth-scroll";
import Header from "./header";
import Hero from "./hero";
import SocialProof from "./social-proof";
import FeatureGrid from "./feature-grid";
import HowItWorks from "./how-it-works";
import FounderCredibility from "./founder-credibility";
import Pricing from "./pricing";
import FinalCta from "./final-cta";
import Footer from "./footer";

export default function LandingPage() {
  return (
    <SmoothScroll>
      <Header />
      <main className="w-full pt-16 bg-surface-bright">
        <div className="flex flex-col w-full">
          <Hero />
          <SocialProof />
          <FeatureGrid />
          <HowItWorks />
          <FounderCredibility />
          <Pricing />
          <FinalCta />
          <Footer />
        </div>
      </main>
    </SmoothScroll>
  );
}
