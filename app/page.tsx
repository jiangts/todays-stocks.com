import { Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import FeaturesAccordion from "@/components/FeaturesAccordion";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import FeaturesListicle from "@/components/FeaturesListicle";
import FeaturesGrid from "@/components/FeaturesGrid";
import HowItWorks from "@/components/HowItWorks";
import FeaturesList from "@/components/FeaturesList";

// Copy ideas
// https://chatgpt.com/share/67c2b8a8-1f54-8002-9336-66ade997617b

export default function Home() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main>
        <Hero />
        {/* <Problem /> */}
        <HowItWorks />
        <FeaturesList />
        {/* <FeaturesAccordion />
        <FeaturesListicle /> */}
        {/* <Pricing /> */}
        {/* Subscription & Pricing (Modify the Current Sign-up Section)
🚀 Try it free for 30 days.
📩 After the trial, continue for $10/month – that’s less than two cups of coffee.

What’s included:
✔ Daily email with AI-driven stock research
✔ Proprietary stock-picking strategies
✔ Custom alerts for your own stock list

[Start Free Trial] (CTA Button) */}
        {/* <FAQ /> */}
        {/* Testimonials Section (Show Social Proof)
🗣 “This tool helped me identify high-growth stocks I would have missed.” – Investor A
🗣 “The AI alerts helped me catch a stock breakout before it happened!” – Trader B */}
        <CTA />
      </main>
      <Footer />
    </>
  );
}
